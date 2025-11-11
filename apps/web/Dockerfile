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

# Install dependencies with cache (web + ses dépendances dont api)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter=web... --filter=api...

# ============================================
# Stage 3: Build application
# ============================================
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages ./packages

# Copy source code for both API (types Tuyau) and Web
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api ./apps/api
COPY apps/web ./apps/web

# Build using Turborepo (build API first pour générer types Tuyau, puis Web)
ARG NUXT_PUBLIC_API_URL=https://gachapulse.com/api
ARG NUXT_PUBLIC_SITE_URL=https://gachapulse.com
ENV NUXT_PUBLIC_API_URL=$NUXT_PUBLIC_API_URL
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL
RUN pnpm turbo build --filter=web...

# ============================================
# Stage 4: Production image
# ============================================
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nuxtjs && \
    adduser --system --uid 1001 nuxtjs

# Copy built application
COPY --from=builder --chown=nuxtjs:nuxtjs /app/apps/web/.output ./

# Copy node_modules (needed for runtime dependencies)
COPY --from=builder --chown=nuxtjs:nuxtjs /app/node_modules ./node_modules
COPY --from=builder --chown=nuxtjs:nuxtjs /app/apps/web/node_modules ./apps/web/node_modules

# Switch to non-root user
USER nuxtjs

# Expose web port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the Nuxt server
CMD ["node", "server/index.mjs"]
