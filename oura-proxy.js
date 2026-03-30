const http = require('http');
const https = require('https');

const OURA_TOKEN = process.env.OURA_TOKEN || '4Z54ECQV6JAB2OSFJW7QY5TSIKBQN7PQ';
const PORT = 8077;

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // Only proxy /v2/ paths
  if (!req.url.startsWith('/v2/')) {
    res.writeHead(404); res.end('Not found'); return;
  }

  const options = {
    hostname: 'api.ouraring.com',
    path: req.url,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${OURA_TOKEN}` }
  };

  const proxy = https.request(options, (upstream) => {
    res.writeHead(upstream.statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    upstream.pipe(res);
  });
  proxy.on('error', (e) => { res.writeHead(502); res.end(JSON.stringify({ error: e.message })); });
  proxy.end();
});

server.listen(PORT, '0.0.0.0', () => console.log(`Oura proxy on :${PORT}`));
