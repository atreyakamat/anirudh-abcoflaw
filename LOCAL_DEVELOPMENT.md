# AB & CO. LEGAL — LOCAL DEVELOPMENT & RUNTIME GUIDE

This guide provides instructions for setting up, running, and validating the complete AB & Co. Legal CRM & Consultation Platform on a fresh local development machine without containers or Docker.

---

## 1. Prerequisites

- **Node.js:** `v20.x` or `v22.x` LTS recommended (`v20.0.0` or higher)
- **npm:** `v10.0.0` or higher
- **PostgreSQL:** PostgreSQL 16+ (Local system service on port 5432 or Supabase PostgreSQL instance)
- **Required Ports:**
  - `3000`: Next.js Frontend (Public website, Client Portal & Admin Dashboard)
  - `3001`: NestJS Backend API & Swagger Docs
  - `5432`: PostgreSQL Database
  - `5678`: n8n Workflow Automation Engine

---

## 2. Fresh Machine Setup (One-Command Onboarding)

Follow these 4 simple steps on any fresh development machine:

```bash
# 1. Clone the repository and enter the directory
git clone <repository-url>
cd anirudh-abcoflaw

# 2. Install monorepo workspace dependencies
npm install

# 3. Configure environment variables (from template)
cp .env.example .env

# 4. Run automated setup (generates Prisma client, runs migrations, seeds data, syncs envs)
npm run setup

# 5. Verify local environment health
npm run doctor

# 6. Launch the complete local stack
npm run dev:all
```

---

## 3. Local Environment Variables (.env)

The root `.env` file is automatically synchronized to `backend/.env` and `frontend/.env.local` by `npm run setup`.

Key Variables:
```env
# Application
NODE_ENV=development
APP_NAME="Law Practice CRM"
APP_URL=http://localhost:3000
API_URL=http://localhost:3001

# PostgreSQL Database (Local or Supabase)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/law_practice_crm?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/law_practice_crm"
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=law_practice_crm

# Authentication (Static MVP & JWT Sessions)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Ports & Client API
BACKEND_PORT=3001
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000

# n8n Automation Engine
N8N_URL=http://localhost:5678
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_WEBHOOK_SECRET=local-dev-webhook-secret
```

> [!WARNING]
> **DEVELOPMENT ONLY:** Credentials such as `admin`/`admin123` and dev OTP `123456` are strictly for isolated local development and testing.

---

## 4. Daily Development Commands

| Command | Purpose |
| :--- | :--- |
| `npm run dev:all` | **Daily Development Command**: Starts frontend (3000), backend (3001), and n8n (5678) concurrently |
| `npm run dev:frontend` | Starts only the Next.js frontend dev server (`http://localhost:3000`) |
| `npm run dev:backend` | Starts only the NestJS backend API in watch mode (`http://localhost:3001/api/v1`) |
| `npm run doctor` | Runs 10 enterprise diagnostic checks across environment, database, and scripts |
| `npm run setup` | Runs complete database migration, seeding, and workspace environment sync |
| `npm run stop` | Cross-platform script to gracefully terminate local Node dev processes |
| `npm run clean` | Cross-platform script to delete compiled build artifacts (`backend/dist`, `frontend/.next`) |
| `npm run db:backup` | Dumps current PostgreSQL schema/data to `backups/` directory |
| `npm run db:restore` | Validates and verifies latest SQL dump in `backups/` |
| `npm run typecheck` | Runs TypeScript type checking across backend and frontend |
| `npm run lint` | Runs ESLint checks across backend and frontend |
| `npm run test` | Runs Jest backend unit test suite (36 tests) |
| `npm run build` | Full production build of backend and frontend packages |

---

## 5. Local Service Endpoints

- **Frontend Public Website & Portal:** [http://localhost:3000](http://localhost:3000)
- **Staff Admin Dashboard:** [http://localhost:3000/login](http://localhost:3000/login)
- **Backend API Base:** [http://localhost:3001/api/v1](http://localhost:3001/api/v1)
- **Backend Health Check:** [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health)
- **Backend Readiness Check:** [http://localhost:3001/api/v1/health/ready](http://localhost:3001/api/v1/health/ready)
- **API Documentation (Swagger):** [http://localhost:3001/docs](http://localhost:3001/docs)
- **n8n Automation Editor:** [http://localhost:5678](http://localhost:5678)

---

## 6. Seed Credentials (DEV ONLY)

- **Admin Login:** Username: `admin`, Password: `admin123`
- **Lawyer Login:** Username: `lawyer`, Password: `lawyer123`
- **Receptionist Login:** Username: `receptionist`, Password: `receptionist123`
- **Client Portal Login:** Phone: `9876543210`, Dev OTP: `123456`
