#!/bin/bash
set -e

echo "Waiting for database to be ready..."
until pg_isready -h db -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-law_practice_crm}"; do
  echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Postgres is up - running migrations..."

cd /app

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Generate Prisma client if needed
echo "Generating Prisma client..."
npx prisma generate

# Seed the database if not already seeded
echo "Seeding database..."
npm run db:seed || echo "Seed completed or already seeded"

echo "Database initialization complete!"