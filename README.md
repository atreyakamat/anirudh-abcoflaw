# Law Practice CRM & Consultation Automation Platform

Enterprise-grade Consultation Management, Client Relationship Management, Website, Blog CMS and Workflow Automation Platform for a single law practice.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Monorepo Structure                       │
├──────────────┬──────────────┬──────────┬────────────────────┤
│   frontend   │   backend    │  shared  │      docker        │
│  (Next.js)   │  (NestJS)    │ (Types)  │  (Compose/Files)   │
└──────────────┴──────────────┴──────────┴────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- Docker & Docker Compose
- PostgreSQL 16+ (via Docker)

### Installation

```bash
# Clone and install dependencies
git clone <repository-url>
cd law-practice-crm
npm install

# Start development environment (PostgreSQL + Backend + Frontend)
npm run docker:up

# Generate Prisma client and run migrations
npm run db:generate
npm run db:migrate:dev

# Seed database with default data
npm run db:seed

# Start frontend development server
npm run dev:frontend

# In another terminal, start backend development server
npm run dev:backend
```

### Access Points

- **Frontend (Website + Dashboard)**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation (Swagger)**: http://localhost:3001/api/docs
- **Prisma Studio**: `npm run db:studio`
- **PostgreSQL**: localhost:5432 (user: postgres, password: postgres)

### Default Credentials

- **Admin/Receptionist Login**: `admin` / `admin123`

## 📁 Project Structure

```
law-practice-crm/
├── frontend/                 # Next.js 15 (App Router) + React 19
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── (public)/    # Public website routes
│   │   │   ├── (dashboard)/ # Protected dashboard routes
│   │   │   └── (auth)/      # Auth routes
│   │   ├── components/      # Shared components
│   │   ├── lib/             # Utilities, hooks, configs
│   │   └── types/           # TypeScript types
│   └── ...
├── backend/                  # NestJS + Prisma + PostgreSQL
│   ├── src/
│   │   ├── common/          # Shared utilities (guards, pipes, etc.)
│   │   ├── config/          # Configuration modules
│   │   ├── modules/         # Feature modules
│   │   └── prisma/          # Prisma service & extensions
│   └── prisma/
│       └── schema.prisma    # Database schema
├── shared/                   # Shared TypeScript types & utilities
├── docker/                   # Docker configuration
├── docs/                     # Documentation
└── scripts/                  # Utility scripts
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5+
- **UI**: React 19, Tailwind CSS v4, shadcn/ui (New York style)
- **Forms**: React Hook Form + Zod
- **State**: TanStack Query (React Query)
- **Auth**: Modular auth client (Firebase-ready)

### Backend
- **Framework**: NestJS 10+
- **Language**: TypeScript 5+
- **Database**: PostgreSQL 16
- **ORM**: Prisma 5+
- **Auth**: JWT + Passport (Static → Firebase ready)
- **Validation**: class-validator + class-transformer
- **API Docs**: Swagger/OpenAPI

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL 16 (Alpine)
- **Reverse Proxy**: Nginx (production)
- **Monitoring**: Uptime Kuma, Portainer

## 📦 Available Scripts

### Root Level
```bash
npm run dev              # Start frontend dev server
npm run dev:backend      # Start backend dev server
npm run dev:frontend     # Start frontend dev server
npm run build            # Build all workspaces
npm run lint             # Lint all workspaces
npm run typecheck        # Type check all workspaces
npm run test             # Run all tests
```

### Database
```bash
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes (dev)
npm run db:migrate       # Run migrations (prod)
npm run db:migrate:dev   # Create & run migration (dev)
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database
npm run db:reset         # Reset database (dev only)
```

### Docker
```bash
npm run docker:up        # Start all services
npm run docker:down      # Stop all services
npm run docker:logs      # View logs
npm run docker:build     # Build images
```

## 🔐 Authentication

### MVP (Static)
- Single admin user: `admin` / `admin123`
- JWT-based sessions with refresh token rotation
- HttpOnly cookies for token storage
- Role-based access: `RECEPTIONIST`, `LAWYER`, `CLIENT`

### Future (Firebase)
- Modular auth strategy pattern implemented
- Firebase Auth strategy scaffolded
- Seamless migration path

## 🗄️ Database Schema

Key models:
- **User** - Internal users (receptionist, lawyer)
- **Client** - External clients
- **Appointment** - Core consultation entity with 10 statuses
- **AppointmentHistory** - Immutable audit trail
- **Document** - File uploads (PDF, DOCX, JPG, PNG ≤10MB)
- **BlogPost** - CMS with SEO, categories, tags
- **FAQ** - Categorized, ordered, toggleable
- **Payment** - Offline payments (Cash, GPay, Bank Transfer)
- **Notification** - In-app notifications
- **AuditLog** - Immutable system audit trail
- **Setting** - Key-value system configuration
- **AvailabilitySlot** - Lawyer calendar availability

## 🎯 Features (V1)

### Public Website
- Modern landing page (Stripe/Vercel/Linear aesthetic)
- Consultation booking with file upload
- AI Chatbot for FAQs & booking guidance
- Blog with SEO, categories, tags
- Dark/Light mode

### Receptionist Dashboard
- Appointment management (CRUD + status workflow)
- Client management with timeline
- Blog CMS (TipTap editor)
- FAQ management
- Payment recording
- Calendar (Month/Week/Agenda)
- Analytics & Reports
- Audit logs
- Settings

### Lawyer Workspace
- Appointment confirm/reject/reschedule
- Availability management
- Blog publishing
- Consultation notes

### Client Portal
- View appointments
- Request reschedule/cancel
- Upload documents
- View history

## 🔧 Development

### Code Quality
```bash
# Pre-commit hooks (husky + lint-staged)
npm run lint        # ESLint (Airbnb + TypeScript)
npm run typecheck   # TypeScript strict mode
npm run test        # Jest (backend) + Vitest (frontend)
```

### Conventional Commits
```bash
# Commit message format
<type>(<scope>): <subject>

# Examples
feat(appointments): add conflict detection
fix(auth): resolve refresh token rotation
docs(api): update swagger annotations
```

### Database Migrations
```bash
# Create migration
npm run db:migrate:dev -- --name add_appointment_notes

# Apply in production
npm run db:migrate
```

## 🐳 Docker Deployment

### Development
```bash
docker-compose -f docker/docker-compose.dev.yml up -d
```

### Production
```bash
docker-compose -f docker/docker-compose.prod.yml up -d --build
```

### Environment Variables
Copy `.env.example` to `.env` in each workspace:
- `backend/.env` - Database, JWT, App config
- `frontend/.env.local` - API URL, Feature flags

## 📚 Documentation

- [Architecture](./docs/architecture/)
- [Database Design](./docs/database/)
- [API Reference](./docs/api/)
- [UI/UX Specifications](./docs/uiux/)

## 🔒 Security

- Helmet.js for HTTP headers
- CORS configured for specific origins
- Rate limiting on auth endpoints
- Input validation on all endpoints
- Soft deletes (audit trail)
- Immutable audit logs
- Secure file uploads (type/size validation)

## 🧪 Testing

- **Unit**: Jest (backend), Vitest (frontend)
- **Integration**: Testcontainers (PostgreSQL)
- **E2E**: Playwright
- **Visual**: Chromatic/Storybook

## 📄 License

Private - All Rights Reserved

---

**Built with discipline for Version 1, architected for Version 10.**