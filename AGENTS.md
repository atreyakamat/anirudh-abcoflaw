# Agent Guidance

## Project Structure
- **Frontend**: Next.js 15 (App Router) + React 19 + Tailwind v4 + shadcn/ui + TanStack Query
- **Backend**: NestJS + Prisma + PostgreSQL
- **Monorepo**: npm workspaces (frontend, backend, shared)

## Development Commands
- `npm install` — install all dependencies (run from root)
- `npm run dev` — start both frontend and backend in development
- `npm run build` — build both packages
- `npx prisma generate` — regenerate Prisma client
- `npx prisma migrate dev` — run migrations
- `npx prisma db seed` — seed the database
- `npx prisma studio` — open Prisma Studio

## Code Conventions
- Keep changes aligned with the existing single-lawyer production workflow
- Prefer additive changes over rewrites unless a file is clearly inconsistent with the current Prisma schema
- Use the existing NestJS service/controller pattern for backend modules
- Keep the public website premium and minimal; keep dashboard views operational rather than decorative
- Do not introduce multi-tenant abstractions until explicitly requested

## Auth
- Default credentials: `admin` / `admin123`
- JWT with refresh token rotation
- Modular Passport strategy for future Firebase replacement

## API Conventions
- All responses wrapped in `{ success: true, data: ... }` format
- Pagination: `{ items: [], total, page, totalPages, hasNextPage, hasPreviousPage }`
- Use `@Public()` decorator for unauthenticated endpoints
- Use `@Roles('ADMIN')` for admin-only endpoints

## Frontend Conventions
- Tailwind v4 uses `@import "tailwindcss"` and `@theme inline` (no tailwind.config.ts)
- TanStack Query for server state, React Hook Form + Zod for forms
- CSS variables for light/dark themes via next-themes
- All API calls go through `lib/api/client.ts`