# Law Practice CRM & Consultation Automation Platform

Enterprise monorepo for a single-lawyer practice with a public website, consultation booking, receptionist dashboard, lawyer workspace, client portal foundation, blog CMS, audit logging, and automation-ready APIs.

## Workspace Structure

- `frontend/` Next.js 15 public site and admin experience
- `backend/` NestJS REST API with Prisma and PostgreSQL
- `shared/` cross-app types, constants, and contracts
- `docs/` implementation and architecture notes
- `docker/` local infrastructure and container definitions
- `scripts/` developer convenience scripts

## Core Commands

- `npm install`
- `npm run dev` starts the frontend
- `npm run build` builds shared, backend, and frontend
- `npm run typecheck` checks both applications
- `npm run db:generate` generates the Prisma client
- `npm run db:migrate` runs database migrations

## MVP Scope

Version 1 includes the public site, consultation intake, floating chatbot, receptionist/admin dashboard shell, appointment and client management foundation, blog and FAQ management, offline payments, notifications, analytics, settings, audit logs, and search-ready APIs.