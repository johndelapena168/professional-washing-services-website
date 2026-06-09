const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HTML_DIR = 'c:\\Users\\johnd\\OneDrive\\Desktop\\readdy.cc1\\deploy';

const routeMap = {
  '/': 'home.html',
  '/about': 'about.html',
  '/services': 'services.html',
  '/contact': 'contact.html',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // Check if it's a known route
  const htmlFile = routeMap[pathname];
  if (htmlFile) {
    const filePath = path.join(HTML_DIR, htmlFile);
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // Serve static files
  const filePath = path.join(HTML_DIR, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const types = { '.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.woff2':'font/woff2' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Fallback to home.html (SPA)
  const fallback = path.join(HTML_DIR, 'home.html');
  if (fs.existsSync(fallback)) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(fallback).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
