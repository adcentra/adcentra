-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS tokens (
    hash bytea PRIMARY KEY,
    user_id bigint NOT NULL REFERENCES users ON DELETE CASCADE,
    expiry timestamp(0) with time zone NOT NULL,
    scope text NOT NULL,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS tokens_hash_scope_idx ON tokens(hash, scope);
CREATE INDEX IF NOT EXISTS tokens_user_id_idx ON tokens(user_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS tokens_user_id_idx;
DROP INDEX IF EXISTS tokens_hash_scope_idx;
DROP TABLE IF EXISTS tokens;
-- +goose StatementEnd
