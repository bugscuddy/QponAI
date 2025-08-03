const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const pathname = url.parse(req.url).pathname;

  console.log(`${req.method} ${pathname}`);

  res.setHeader('Content-Type', 'application/json');

  if (pathname === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'QponAI API is running!' }));
  } else if (pathname === '/cart') {
    res.writeHead(200);
    res.end(JSON.stringify([
      { id: '1', name: 'Test Item 1', quantity: 2, userId: 'user1' },
      { id: '2', name: 'Test Item 2', quantity: 1, userId: 'user1' }
    ]));
  } else if (pathname === '/smartlist') {
    res.writeHead(200);
    res.end(JSON.stringify([
      { id: '1', title: 'Grocery List', items: ['milk', 'bread', 'eggs'], userId: 'user1' },
      { id: '2', title: 'Shopping List', items: ['laptop', 'mouse'], userId: 'user1' }
    ]));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🧠 QponAI test backend running on http://localhost:${PORT}`);
});
