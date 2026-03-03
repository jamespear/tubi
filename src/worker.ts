import { streamHandler } from "./routes/stream";

const INDEX_HTML = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Cloudflare Video CDN — Demo</title>
    <style>
      body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; padding: 24px; background:#fafafa; }
      header { margin-bottom: 12px; }
      video { max-width: 100%; height: auto; background: #000; }
      .note { color:#666; font-size: 0.9rem; margin-top: 8px; }
    </style>
  </head>
  <body>
    <header>
      <h1>Cloudflare Video CDN — Demo Frontend</h1>
      <p class="note">Playback demo uses the "sample" video id. For real videos, implement R2 fetches in the worker.</p>
    </header>

    <section>
      <video id="player" controls crossorigin="anonymous" preload="metadata">
        <source src="/stream/sample" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>

    <script>
      // Basic UI: allow loading by id from query param ?id=...
      (function () {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        if (id) {
          const player = document.getElementById('player');
          player.src = '/stream/' + encodeURIComponent(id);
          player.load();
        }
      })();
    </script>
  </body>
</html>`;

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Serve demo frontend at root
    if (url.pathname === "/" || url.pathname === "") {
      return new Response(INDEX_HTML, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (url.pathname === "/favicon.ico") {
      return new Response(null, { status: 204 });
    }

    // stream route: /stream/:id
    if (url.pathname.startsWith("/stream/")) {
      const parts = url.pathname.split("/").filter(Boolean);
      const id = parts[1] ?? parts[0];
      return streamHandler(request, id);
    }

    return new Response("Not found", { status: 404 });
  },
};

// scheduled noop to match wrangler config (if used)
export async function scheduled(event: ScheduledEvent) {
  event.waitUntil(
    (async () => {
      console.log("scheduled event fired");
    })()
  );
}