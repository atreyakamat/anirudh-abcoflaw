# Architecture Overview

## Product Boundary

The platform is designed for a single-lawyer practice in Version 1. The data model and API layers are intentionally modular so multi-lawyer support can be introduced later without changing the public contract.

## Frontend

`frontend/` is a Next.js 15 App Router application with React 19, Tailwind CSS, shadcn-style local primitives, React Hook Form, Zod, TanStack Query, and premium editorial design language.

## Backend

`backend/` is a NestJS REST API backed by Prisma and PostgreSQL. Authentication uses a modular static-credential session layer now so Firebase Auth can replace it later.

## Data Model

The Prisma schema includes users, appointments, clients, blogs, blog categories, FAQs, payments, notifications, audit logs, settings, documents, appointment history, calendar blocks, and inquiries.

## Operational Principles

- Human review before confirmation
- Audit every meaningful CRUD change
- Keep booking intake and chatbot intake identical at the persistence layer
- Store automation integration points behind API boundaries instead of hard-coding them into the UI
