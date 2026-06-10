# syntax=docker/dockerfile:1

# ── Stage 1: build the Vite frontend ─────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
# Cache mount keeps downloaded packages across rebuilds — only re-installs when lockfile changes
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# ARGs declared after npm ci so a changed build arg doesn't bust the install cache
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_BACKEND_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY . .
RUN npm run build

# ── Stage 2: serve with nginx (~25 MB final image) ───────────────────────────
FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
