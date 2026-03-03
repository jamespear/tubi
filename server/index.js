const path = require('path');
const express = require('express');
const got = require('got');

const app = express();
const PORT = process.env.PORT || 8080;

function resolveSourceUrl(id) {
  if (!id) return null;
  if (id === 'sample') {
    return 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  }
  return null;
}

// Serve static frontend placed in /public
app.use(express.static(path.join(__dirname, '..', 'public'), { index: 'index.html' }));

// Proxy stream endpoint with Range support
app.get('/stream/:id', async (req, res) => {
  const id = req.params.id;
  const sourceUrl = resolveSourceUrl(id);
  if (!sourceUrl) {
    return res.status(404).send('Video not found');
  }

  const headers = {};
  if (req.headers.range) headers.range = req.headers.range;

  try {
    const upstream = got.stream(sourceUrl, { headers, timeout: { request: 60000 } });

    upstream.on('response', (upstreamRes) => {
      // forward relevant headers
      const hdrs = { ...upstreamRes.headers };
      // Ensure CORS and content-type present
      hdrs['access-control-allow-origin'] = '*';
      if (!hdrs['content-type']) hdrs['content-type'] = 'video/mp4';
      res.writeHead(upstreamRes.statusCode || 200, hdrs);
      upstream.pipe(res);
    });

    upstream.on('error', (err) => {
      if (!res.headersSent) {
        res.status(502).send('Upstream fetch error');
      } else {
        res.end();
      }
      console.error('Upstream error', err && err.message);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal error');
  }
});

// Health
app.get('/', (req, res, next) => {
  // If static served index exists, express.static will have responded first.
  // This fallback returns OK for health checks.
  if (!res.headersSent) res.status(200).type('text').send('OK');
});

app.listen(PORT, () => {
  console.log(`Production proxy listening on http://0.0.0.0:${PORT}`);
});