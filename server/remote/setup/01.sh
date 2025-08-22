#!/bin/bash
set -eu

# ==================================================================================== #
# VARIABLES
# ==================================================================================== #

# Set the timezone for the server. A full list of available timezones can be found by 
# running timedatectl list-timezones.
TIMEZONE=Asia/Kolkata

# Set the name of the new user to create.
USERNAME=adcentra

# Prompt to enter a password for the PostgreSQL adcentra user (rather than hard-coding a
# password in this script).
read -p "Enter password for adcentra DB user: " DB_PASSWORD

# Force all output to be presented in en_US for the duration of this script. This avoids  
# any "setting locale failed" errors while this script is running, before we have 
# installed support for all locales. Do not change this setting!
export LC_ALL=en_US.UTF-8 

# ==================================================================================== #
# SCRIPT LOGIC
# ==================================================================================== #

# Enable the "universe" repository.
add-apt-repository --yes universe

# Update all software packages.
apt update

# Set the system timezone and install all locales.
timedatectl set-timezone ${TIMEZONE}
apt --yes install locales-all

# Add the new user (and give them sudo privileges).
useradd --create-home --shell "/bin/bash" --groups sudo "${USERNAME}"

# Force a password to be set for the new user the first time they log in.
passwd --delete "${USERNAME}"
chage --lastday 0 "${USERNAME}"

# Copy the SSH keys from the root user to the new user.
rsync --archive --chown=${USERNAME}:${USERNAME} /root/.ssh /home/${USERNAME}

# Configure the firewall to allow SSH, HTTP and HTTPS traffic.
ufw allow 22
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Install fail2ban.
apt --yes install fail2ban

# Install the goose migrate CLI tool.
curl -fsSL https://raw.githubusercontent.com/pressly/goose/master/install.sh | sudo sh

# Install PostgreSQL.
apt --yes install postgresql

# Set up the adcentra DB and create a user account with the password entered earlier.
sudo -i -u postgres psql -c "CREATE DATABASE adcentra"
sudo -i -u postgres psql -d adcentra -c "CREATE EXTENSION IF NOT EXISTS citext"
sudo -i -u postgres psql -d adcentra -c "CREATE ROLE adcentra WITH LOGIN PASSWORD '${DB_PASSWORD}'"
sudo -i -u postgres psql -d adcentra -c "GRANT USAGE ON SCHEMA public TO adcentra;"
sudo -i -u postgres psql -d adcentra -c "GRANT CREATE ON SCHEMA public TO adcentra;"

# Add a DSN for connecting to the adcentra database to the system-wide environment 
# variables in the /etc/environment file.
echo "DB_DSN='postgres://adcentra:${DB_PASSWORD}@localhost/adcentra'" >> /etc/environment

# Install Caddy (see https://caddyserver.com/docs/install#debian-ubuntu-raspbian).
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt --yes install caddy

# Install Redis server
apt --yes install redis-server

# Backup the original Redis configuration
cp /etc/redis/redis.conf /etc/redis/redis.conf.bak

# Configurations for Redis are directly done in the server without using this script

# Set up memory overcommit to ensure Redis can save its data properly
echo "vm.overcommit_memory = 1" >> /etc/sysctl.conf
sysctl vm.overcommit_memory=1

# Restart Redis to apply changes
systemctl restart redis-server

# Enable Redis to start at boot
systemctl enable redis-server

# Check Redis status
systemctl status redis-server

# Upgrade all packages. Using the --force-confnew flag means that configuration 
# files will be replaced if newer ones are available.
apt --yes -o Dpkg::Options::="--force-confnew" upgrade

echo "Script complete! Rebooting..."
reboot