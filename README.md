# Cloudflare Video CDN

This project implements a small Cloudflare Workers-based video CDN demo (streams a public MP4 for testing). It includes a demo frontend (served at `/`) and a worker route `/stream/:id` that proxies a sample video supporting Range requests.

## Quick local (dev) run

Prereqs:
- Node 18+
- Yarn or npm
- Cloudflare account (for real R2/use of workers)
- A Cloudflare API token. Use `CLOUDFLARE_API_TOKEN` (preferred) and `CF_ACCOUNT_ID`.

Install and run locally:
```bash
yarn install
export CLOUDFLARE_API_TOKEN="your_token_here"
export CF_ACCOUNT_ID="your_account_id_here"
yarn wrangler dev    # or `yarn start`
# open http://localhost:8787
```

Demo frontend:
- Open http://localhost:8787
- The player loads `/stream/sample` by default (Big Buck Bunny demo).

Notes:
- The demo proxies a public MP4. Replace `resolveSourceUrl` in `src/routes/stream.ts` with R2 fetch/signed-URL logic for real content.
- If you get a deprecation message about `CF_API_TOKEN`, switch to `CLOUDFLARE_API_TOKEN`.

## Docker / Containerized development (optional)

This repository includes a Dockerfile and docker-compose setup so you can run the dev server inside a container (useful for consistent environments or submission requirements).

Build the image:
```bash
# from project root
docker build -t cloudflare-video-cdn:dev .
```

Run the container (passing token and account id):
```bash
docker run --rm -p 8787:8787 \
  -e CLOUDFLARE_API_TOKEN="your_token_here" \
  -e CF_ACCOUNT_ID="your_account_id_here" \
  cloudflare-video-cdn:dev
# open http://localhost:8787
```

Or use docker-compose (create a `.env` next to docker-compose.yml with values or export env vars):
```bash
docker-compose up --build
# open http://localhost:8787
```

Notes about the container:
- The container runs `wrangler dev --host 0.0.0.0` so the dev server is reachable from your host.
- Provide the Cloudflare token via `CLOUDFLARE_API_TOKEN` (recommended) or `CF_API_TOKEN` (deprecated).
- If you do not want cron triggers during `wrangler dev`, remove the cron entry from `wrangler.toml` or keep the noop scheduled handler that exists in `src/worker.ts`.

## Production container (no wrangler)

A production container runs a small Node proxy that serves the demo frontend and proxies `/stream/:id`. This is useful for packaging a runnable demo without Cloudflare credentials.

Build and run the production image:
```bash
# from project root
npm ci --only=production
docker build -f Dockerfile.prod -t cloudflare-video-cdn:prod .
docker run --rm -p 8080:8080 cloudflare-video-cdn:prod
# open http://localhost:8080
```

Or with docker-compose:
```bash
docker-compose -f docker-compose.prod.yml up --build
# open http://localhost:8080
```

Notes:
- The Node proxy forwards Range headers so the video element can seek.
- Replace resolveSourceUrl in server/index.js with your R2 or signed-URL logic for real content.

## Submission PDF (Tubi take-home)

A single-page submission summary is included in SUBMISSION.md. Convert to PDF (e.g. Print to PDF or use pandoc) and include the public repo link and video links per the take-home instructions.

## Next steps / improvements
- Replace demo proxy with R2 signed URLs and authentication
- Add CI to build + smoke-test worker
- Implement caching/edge-control headers and telemetry