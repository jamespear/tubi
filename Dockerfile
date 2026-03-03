# Build a dev container that runs wrangler dev and exposes the worker on 0.0.0.0:8787
FROM node:18-alpine

# Install build tools for any native deps
RUN apk add --no-cache python3 make g++ bash

WORKDIR /app

# Copy package manifests first for caching
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies (prefer yarn if lockfile present)
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else npm ci; fi

# Copy the rest of the repo
COPY . .

# Build TypeScript once (wrangler dev will also run build if configured)
RUN yarn build || true

EXPOSE 8787

# Run wrangler dev and bind to 0.0.0.0 so host can access it.
# Consumer must supply CLOUDFLARE_API_TOKEN and CF_ACCOUNT_ID as env vars.
CMD ["sh", "-c", "yarn wrangler dev --host 0.0.0.0"]