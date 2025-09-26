package main

import (
	"context"
	"expvar"
	"flag"
	"fmt"
	"log/slog"
	"os"
	"runtime"
	"strings"
	"sync"
	"time"

	"adcentra.ai/internal/cache"
	"adcentra.ai/internal/data"
	"adcentra.ai/internal/i18n"
	"adcentra.ai/internal/mailer"
	"adcentra.ai/internal/vcs"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

var (
	version = vcs.Version()
)

type config struct {
	port int
	env  string
	db   struct {
		dsn          string
		maxOpenConns int
		maxIdleConns int
		maxIdleTime  time.Duration
	}
	redis struct {
		dsn      string
		db       int
		poolSize int
	}
	smtp struct {
		host     string
		port     int
		username string
		password string
		sender   string
	}
	limiter struct {
		rps     float64
		burst   int
		enabled bool
	}
	cors struct {
		trustedOrigins []string
	}
	cleanup struct {
		tokensCleanupPeriod time.Duration
	}
}

type application struct {
	config          config
	logger          *slog.Logger
	models          data.Models
	cache           cache.Cache
	mailer          *mailer.Mailer
	wg              sync.WaitGroup
	serverCtx       context.Context
	serverCtxCancel context.CancelFunc
}

func main() {
	var cfg config

	flag.IntVar(&cfg.port, "port", 4000, "API server port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")

	flag.StringVar(&cfg.db.dsn, "dsn", os.Getenv("DB_DSN"), "PostgreSQL connection string")
	flag.IntVar(&cfg.db.maxOpenConns, "db-max-open-conns", 25, "PostgreSQL max open connections")
	flag.IntVar(&cfg.db.maxIdleConns, "db-max-idle-conns", 25, "PostgreSQL max idle connections")
	flag.DurationVar(&cfg.db.maxIdleTime, "db-max-idle-time", 15*time.Minute, "PostgreSQL max connection idle time (default: 15m)")

	flag.StringVar(&cfg.redis.dsn, "redis-dsn", os.Getenv("REDIS_DSN"), "Redis connection string")
	flag.IntVar(&cfg.redis.db, "redis-db", 0, "Redis database number")
	flag.IntVar(&cfg.redis.poolSize, "redis-pool-size", 10, "Redis connection pool size")

	flag.StringVar(&cfg.smtp.host, "smtp-host", "sandbox.smtp.mailtrap.io", "SMTP host")
	flag.IntVar(&cfg.smtp.port, "smtp-port", 2525, "SMTP port")
	flag.StringVar(&cfg.smtp.username, "smtp-username", "", "SMTP username")
	flag.StringVar(&cfg.smtp.password, "smtp-password", "", "SMTP password")
	flag.StringVar(&cfg.smtp.sender, "smtp-sender", "Adcentra <no-reply@adcentra.ai>", "SMTP sender")

	flag.Float64Var(&cfg.limiter.rps, "limiter-rps", 4, "Rate limiter maximum requests per second")
	flag.IntVar(&cfg.limiter.burst, "limiter-burst", 8, "Rate limiter maximum burst")
	flag.BoolVar(&cfg.limiter.enabled, "limiter-enabled", true, "Enable rate limiter")

	// Create a new version boolean flag with the default value of false.
	displayVersion := flag.Bool("version", false, "Display version and exit")

	flag.Func("cors-trusted-origins", "Trusted CORS origins (space separated within double quotes)", func(val string) error {
		cfg.cors.trustedOrigins = strings.Fields(val)
		return nil
	})

	flag.DurationVar(&cfg.cleanup.tokensCleanupPeriod, "tokens-cleanup-period", time.Hour*12, "Tokens cleanup period (default: 12h)")

	flag.Parse()

	// If the version flag value is true, then print out the version number and
	// immediately exit.
	if *displayVersion {
		fmt.Printf("Version:\t%s\n", version)
		os.Exit(0)
	}

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	pool, err := intiDB(cfg)
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
	defer pool.Close()

	logger.Info("database connection pool established")

	rdb, err := initRedis(cfg)
	if err != nil {
		logger.Warn("Failed to connect to Redis, continuing without cache", "error", err.Error())
		rdb = nil
	} else {
		defer rdb.Close()
		logger.Info("redis connection pool established")
	}

	expvar.NewString("version").Set(version)
	expvar.Publish("goroutines", expvar.Func(func() any {
		return runtime.NumGoroutine()
	}))

	expvar.Publish("database", expvar.Func(func() any {
		return pool.Stat()
	}))

	expvar.Publish("redis", expvar.Func(func() any {
		if rdb != nil {
			return rdb.PoolStats()
		}
		return map[string]string{"status": "unavailable"}
	}))

	expvar.Publish("timestamp", expvar.Func(func() any {
		return time.Now().Unix()
	}))

	mailer, err := mailer.New(cfg.smtp.host, cfg.smtp.port, cfg.smtp.username, cfg.smtp.password, cfg.smtp.sender)
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}

	// Initialize i18n bundle
	err = i18n.Init()
	if err != nil {
		logger.Error("failed to initialize i18n", "error", err.Error())
		os.Exit(1)
	}
	logger.Info("i18n bundle initialized")

	// Initialize cache with graceful degradation
	var cacheInstance cache.Cache
	if rdb != nil {
		cacheInstance = cache.NewRedisCache(rdb)
	} else {
		logger.Warn("Redis unavailable, running without cache")
		cacheInstance = cache.NewNullCache()
	}

	app := &application{
		config: cfg,
		logger: logger,
		models: data.NewModels(pool, cacheInstance),
		cache:  cacheInstance,
		mailer: mailer,
	}

	// Create a new context for background goroutines which is cancelled on graceful shutdown.
	app.serverCtx, app.serverCtxCancel = context.WithCancel(context.Background())

	err = app.serve()
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
}

func intiDB(cfg config) (*pgxpool.Pool, error) {
	poolConfig, err := pgxpool.ParseConfig(cfg.db.dsn)
	if err != nil {
		return nil, err
	}

	poolConfig.MaxConns = int32(cfg.db.maxOpenConns)
	poolConfig.MaxConnIdleTime = cfg.db.maxIdleTime

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		return nil, err
	}

	err = pool.Ping(ctx)
	if err != nil {
		defer pool.Close()
		return nil, err
	}

	return pool, nil
}

func initRedis(cfg config) (*redis.Client, error) {
	options, err := redis.ParseURL(cfg.redis.dsn)
	if err != nil {
		return nil, err
	}
	options.DB = cfg.redis.db
	options.PoolSize = cfg.redis.poolSize

	rdb := redis.NewClient(options)

	// Test Redis connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := rdb.Ping(ctx).Err(); err != nil {
		return nil, err
	}

	return rdb, nil
}
