import StreamController from '../controllers/streamController';

const streamController = new StreamController();

// Worker-compatible stream handler that proxies a demo MP4 for quick frontend testing.
// For production, replace `resolveSourceUrl` with your R2 fetch logic and keep Range handling.
function resolveSourceUrl(id?: string): string | null {
  if (!id) return null;
  // demo id "sample" -> public Big Buck Bunny sample (supports range requests)
  if (id === 'sample') {
    return 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  }
  // TODO: return R2 URL or signed URL for id
  return null;
}

export async function streamHandler(request: Request, id?: string): Promise<Response> {
  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const sourceUrl = resolveSourceUrl(id);
  if (!sourceUrl) {
    return new Response('Video not found', { status: 404 });
  }

  // Forward Range header so remote server can return partial content for seeking
  const forwardHeaders = new Headers();
  const range = request.headers.get('range');
  if (range) forwardHeaders.set('range', range);

  const upstreamResp = await fetch(sourceUrl, {
    method: 'GET',
    headers: forwardHeaders,
  });

  // Propagate status and headers (include CORS for browser access)
  const outHeaders = new Headers(upstreamResp.headers);
  outHeaders.set('Access-Control-Allow-Origin', '*');
  // Ensure video content type is set (upstream usually sets it)
  if (!outHeaders.has('Content-Type')) {
    outHeaders.set('Content-Type', 'video/mp4');
  }

  return new Response(upstreamResp.body, {
    status: upstreamResp.status,
    statusText: upstreamResp.statusText,
    headers: outHeaders,
  });
}