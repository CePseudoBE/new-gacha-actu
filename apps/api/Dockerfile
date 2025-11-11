# ============================================
# Stage 1: Base image with pnpm
# ============================================
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ============================================
# Stage 2: Install dependencies
# ============================================
FROM base AS deps
WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy package.json for all workspaces
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json

# Install dependencies with cache
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter=api...

# ============================================
# Stage 3: Build application
# ============================================
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages ./packages

# Copy source code
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api ./apps/api

# Build using Turborepo (génère les types Tuyau)
RUN pnpm turbo build --filter=api

# ============================================
# Stage 4: Production image
# ============================================
FROM base AS runner
WORKDIR /app

# Install wget for healthcheck
RUN apk add --no-cache wget

# Create non-root user
RUN addgroup --system --gid 1001 adonisjs && \
    adduser --system --uid 1001 adonisjs

# Copy built application (includes package.json)
COPY --from=builder --chown=adonisjs:adonisjs /app/apps/api/build ./

# Install production dependencies (no frozen-lockfile needed for standalone build)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod

# Switch to non-root user
USER adonisjs

# Expose API port
EXPOSE 3333

# Environment variables
ENV NODE_ENV=production
ENV PORT=3333
ENV HOST=0.0.0.0

# Health check (uses AdonisJS built-in health checks)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3333/health || exit 1

# Run migrations and start server
CMD ["sh", "-c", "node ace migration:run --force && node bin/server.js"]
