# syntax=docker/dockerfile:1

# ── Stage 1: compile TypeScript ───────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ── Stage 2: production runtime (~130 MB final image) ────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

COPY package.json package-lock.json ./
# Cache mount means prod-dep installs are also fast on rebuilds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --no-audit --no-fund

COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/index.js"]
