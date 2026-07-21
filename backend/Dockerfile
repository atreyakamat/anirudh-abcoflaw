FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy workspace package files
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/

# Install dependencies for all workspaces
RUN npm ci

# Copy source code
COPY backend ./backend
COPY shared ./shared

# Build shared and backend
RUN cd backend && npm run build

FROM node:20-alpine AS runner

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

# Install production dependencies only (using npm ci without --omit=dev because prisma needs typescript for seeding)
RUN npm ci

# Copy built code and prisma schema
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/shared ./shared
COPY backend/package.json ./backend/

# Create a startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'cd /app/backend' >> /app/start.sh && \
    echo 'npx prisma generate' >> /app/start.sh && \
    echo 'npx prisma migrate deploy' >> /app/start.sh && \
    echo 'npx tsx prisma/seed.ts || echo "Seed complete or skipped"' >> /app/start.sh && \
    echo 'npm run start:prod' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]