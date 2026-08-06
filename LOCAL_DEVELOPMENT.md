# AB & CO. LEGAL — LOCAL DEVELOPMENT & RUNTIME GUIDE

This guide provides instructions for setting up, running, and validating the complete AB & Co. Legal CRM & Consultation Platform on a local development machine.

---

## 1. Prerequisites

- **Node.js:** `v20.0.0` or higher (Tested on `v24.14.0`)
- **npm:** `v10.0.0` or higher (Tested on `v10.9.0`)
- **Prisma:** `v5.22.0`
- **n8n:** `v1.109.2`
- **PostgreSQL:** PostgreSQL 15+ (Local or Supabase PostgreSQL instance)

---

## 2. Local Environment Variables (.env)

Ensure `.env` exists in the repository root and `backend/.env`.

Key Required Variables:
```env
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public&pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public"

# Application
NODE_ENV=development
PORT=3001
API_PREFIX=api/v1

# Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=dev-jwt-secret-min-32-chars-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=dev-jwt-refresh-secret-min-32-chars-key-here
JWT_REFRESH_EXPIRES_IN=7d
JWT_PORTAL_EXPIRY=1h

# n8n Automation Webhook & HMAC
N8N_WEBHOOK_URL=http://localhost:5678/webhook/appointment-created
N8N_WEBHOOK_SECRET=dev-webhook-secret

# CORS & Frontend
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

> [!WARNING]
> **DEVELOPMENT ONLY:** Credentials such as `admin`/`admin123` and dev OTP `123456` are strictly for isolated local development and testing. They are automatically disabled when `NODE_ENV=production`.

---

## 3. Database Setup & Prisma Migrations

```bash
# 1. Validate Prisma schema
npx prisma validate --schema=backend/prisma/schema.prisma

# 2. Generate Prisma Client
npx prisma generate --schema=backend/prisma/schema.prisma

# 3. Apply DB migrations (Non-destructive)
npx prisma migrate deploy --schema=backend/prisma/schema.prisma
```

---

## 4. Starting the Complete Local System

To start NestJS backend, Next.js frontend, and local n8n engine concurrently with color-prefixed logs:

```bash
npm run dev:all
```

Log Prefixes:
- `[backend]` — NestJS Backend API on `http://localhost:3001/api/v1`
- `[frontend]` — Next.js Public Website & Admin Dashboard on `http://localhost:3000`
- `[n8n]` — n8n Workflow Automation Engine on `http://localhost:5678`

To stop all services: Press `Ctrl + C` in the terminal.

---

## 5. Local Service Endpoints

- **Frontend Public Website:** [http://localhost:3000](http://localhost:3000)
- **Backend API Base:** [http://localhost:3001/api/v1](http://localhost:3001/api/v1)
- **Backend Health Check:** [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health) or [http://localhost:3001/health](http://localhost:3001/health)
- **n8n Automation Editor:** [http://localhost:5678](http://localhost:5678)
- **n8n Health Check:** [http://localhost:5678/healthz](http://localhost:5678/healthz)

---

## 6. Testing & Quality Gates

```bash
# Run TypeScript typechecks
npm run typecheck

# Run ESLint checks
npm run lint

# Run Backend Unit & Integration Tests (35/35 PASS)
npm test

# Run Playwright E2E Test Suite (6/6 PASS)
$env:PLAYWRIGHT_TEST_BASE_URL="http://localhost:3000"; npx playwright test

# Production Build Rehearsal
npm run build
```

---

## 7. Development Credentials (DEV ONLY)

- **Admin Login:** Username: `admin`, Password: `admin123` (Accesses `/dashboard` and `/automations`)
- **Receptionist Login:** Username: `receptionist`, Password: `receptionist123`
- **Lawyer Login:** Username: `lawyer`, Password: `lawyer123`
- **Client Portal Login:** Phone: `+919876500111`, Dev OTP: `123456`
