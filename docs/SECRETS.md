# Secrets & Environment Variables Guide

## Overview

This document lists all secrets, environment variables, and configuration needed to run the Law Practice CRM platform. **Never commit actual secrets to version control.**

---

## Environment Files

| File | Purpose | Variables Count |
|------|---------|-----------------|
| `backend/.env` | Backend local development | ~15 |
| `backend/.env.docker` | Backend Docker deployment | ~15 |
| `frontend/.env.local` | Frontend local development | ~3 |
| `frontend/.env.docker` | Frontend Docker deployment | ~3 |
| `docker/.env.example` | Docker Compose variables | ~20 |
| `docker/.env` | Docker Compose actual values | ~20 |

---

## Required Secrets

### Backend (`backend/.env`)

```env
# ============================================
# DATABASE - PostgreSQL Connection
# ============================================
DATABASE_URL=postgresql://user:password@host:5432/database?options
DIRECT_URL=postgresql://user:password@host:5432/database

# ============================================
# JWT AUTHENTICATION
# Generate secure secrets: openssl rand -base64 32
# ============================================
JWT_SECRET=your-32-char-minimum-secret-key-here
JWT_REFRESH_SECRET=your-32-char-minimum-refresh-secret-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ============================================
# ADMIN CREDENTIALS (Change in Production!)
# ============================================
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-secure-password
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
```

---

## Optional Secrets

### Firebase (Future Use)

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### n8n Webhook (Optional)

```env
N8N_WEBHOOK_URL=https://your-n8n-instance/webhook
```

### AWS/Cloud Services (if using S3, SES, etc.)

```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
S3_BUCKET=
```

---

## Docker Compose Variables (`docker/.env`)

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_DB=law_practice_crm

# Secrets
JWT_SECRET=change-this-secret-in-production
JWT_REFRESH_SECRET=change-this-refresh-in-production

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# URLs
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000

# Timezone
TIMEZONE=Asia/Kolkata
```

---

## Secret Generation Commands

### Generate JWT Secrets

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) )
```

### Generate PostgreSQL Password

```bash
# Linux/Mac
openssl rand -base64 24

# Database random password
psql -c "SELECT gen_random_uuid();"
```

---

## Security Checklist

- [ ] Change default `admin` password
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Never commit `.env` files
- [ ] Use different secrets for production vs development
- [ ] Rotate secrets periodically
- [ ] Use a secrets manager (AWS Secrets Manager, HashiCorp Vault) in production
- [ ] Enable SSL/TLS for database connections
- [ ] Disable debug mode in production

---

## Environment Variable Templates

### Development (`backend/.env.example`)

```env
# Database
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/law_practice_crm
DIRECT_URL=postgresql://postgres:postgres123@localhost:5432/law_practice_crm

# JWT
JWT_SECRET=dev-jwt-secret-minimum-32-characters-long
JWT_REFRESH_SECRET=dev-refresh-secret-minimum-32-characters-long

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Production (`backend/.env.prod.example`)

```env
# Database - Use cloud provider secrets manager
DATABASE_URL=${DB_URL}

# JWT - Generate strong random secrets
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}

# Admin - Use strong passwords
ADMIN_USERNAME=${ADMIN_USERNAME}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
```

---

## Docker Secrets (docker-compose)

For production, use Docker secrets:

```yaml
services:
  backend:
    secrets:
      - db_password
      - jwt_secret
    environment:
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/db

secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

---

## Quick Setup Script

```bash
#!/bin/bash
# Setup environment files

# Backend
cp backend/.env.example backend/.env
# Edit with: nano backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
# Edit with: nano frontend/.env.local

# Docker
cp docker/.env.example docker/.env
# Edit with: nano docker/.env
```

---

## Troubleshooting

### "JWT_SECRET is not set"
```bash
# Generate and set
export JWT_SECRET=$(openssl rand -base64 32)
```

### "Database connection failed"
1. Check DATABASE_URL format
2. Verify credentials
3. Check network access (cloud DBs need IP whitelist)

### "CORS error in browser"
1. Verify CORS_ORIGINS matches frontend URL
2. Check for trailing slashes