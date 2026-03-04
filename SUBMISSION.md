James Pearce — Tubi Builders Program — Take-Home Submission

Video intro:
- [Link to 2-min intro video](https://youtu.be/qffZpgx6gSc)

Product walkthrough:
- [Link to 3-5 minute walkthrough](https://youtu.be/eHQk6400Hgk)

Repository:
- Public GitHub repo: https://github.com/jamespear/tubi

Project summary
- What it is: A small Cloudflare Workers-based video CDN demo. Frontend served at / and a /stream/:id worker route that proxies a public MP4 (supports Range requests).
- Key components:
  - Frontend: simple HTML5 <video> player (public/index.html)
  - Worker: Cloudflare Worker (src/worker.ts) routes /stream/:id to stream logic
  - Demo proxy: production Node proxy (server/index.js) + Dockerfile.prod for containerized demo
- Design decisions:
  - Cloudflare Worker for edge proxying and easy R2 integration.
  - Range forwarding preserved to enable seeking in browsers.
  - Dev flow uses wrangler; production container provides an isolated runnable demo without Cloudflare credentials.
- Tradeoffs & future improvements:
  - Add signed URLs and auth for private content.
  - Integrate R2 and caching policies, use Cloudflare Cache-Control at edge.
  - Add logging/telemetry, rate-limiting, and CI that builds and smoke-tests the worker.
- How to run locally:
  - Dev (Cloudflare Worker): yarn wrangler dev (requires CLOUDFLARE_API_TOKEN & CF_ACCOUNT_ID)
  - Prod demo (no Cloudflare): docker build -f Dockerfile.prod -t cloudflare-video-cdn:prod . && docker run -p 8080:8080 cloudflare-video-cdn:prod

Notes:
- I certify the code portions written by me are the original work. Third-party libs listed in package.json.