#!/bin/bash
set -e

# Initialize Postgres data directory if empty
if [ ! -d "/var/lib/postgresql/data/base" ]; then
    echo "Initializing database..."
    chown -R postgres:postgres /var/lib/postgresql/data
    sudo -u postgres /usr/lib/postgresql/14/bin/initdb -D /var/lib/postgresql/data
fi

# Start Postgres in the background
echo "Starting PostgreSQL..."
sudo -u postgres /usr/lib/postgresql/14/bin/pg_ctl -D /var/lib/postgresql/data -l /var/lib/postgresql/data/logfile start

# Wait for Postgres to be ready
echo "Waiting for PostgreSQL to start..."
until sudo -u postgres psql -c '\q'; do
  sleep 1
done

# Create Database and User if they don't exist
echo "Setting up database user and schema..."
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'Sid7000' SUPERUSER;" || true
sudo -u postgres psql -c "CREATE DATABASE devconnect;" || true

# Start Java App
echo "Starting DevConnect App..."
java -jar app.jar
