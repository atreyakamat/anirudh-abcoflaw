#!/bin/bash
set -e

# This script runs only when the Postgres volume is empty (first boot).
# It can be used to set up initial databases, extensions, or roles.
# Note: Prisma migrations and seeding are handled automatically by the 
# backend container's start.sh script upon connecting to the database.

echo "Initializing PostgreSQL database..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    -- Add any other raw SQL initialization here
EOSQL

echo "PostgreSQL initialization complete."