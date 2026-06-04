const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let url = req.url;
  if (url === '/') url = '/index.html';
  const filePath = path.join(__dirname, url.split('?')[0]);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

const wss = new WebSocket.Server({ server });

let displaySocket = null;
const controllers = new Map(); // ws -> { id, color }

const PLAYER_COLORS = ['#00e676', '#448aff', '#ff9100'];
const PLAYER_NAMES = ['Hijau', 'Biru', 'Oranye'];

function broadcastToDisplay(msg) {
  if (displaySocket && displaySocket.readyState === WebSocket.OPEN) {
    displaySocket.send(JSON.stringify(msg));
  }
}

function broadcastControllers(msg) {
  controllers.forEach((info, ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  });
}

wss.on('connection', (ws, req) => {
  const url = req.url || '';

  if (url.startsWith('/ws/display')) {
    console.log('[SERVER] Display connected');
    displaySocket = ws;
    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw);
        // Display can broadcast to controllers
        if (msg.type === 'to_controller') {
          const target = Array.from(controllers.entries()).find(([_, info]) => info.id === msg.playerId);
          if (target) {
            const [targetWs] = target;
            if (targetWs.readyState === WebSocket.OPEN) {
              targetWs.send(JSON.stringify(msg.data));
            }
          }
        }
        if (msg.type === 'to_all_controllers') {
          broadcastControllers(msg.data);
        }
      } catch (e) {}
    });
    ws.on('close', () => {
      console.log('[SERVER] Display disconnected');
      displaySocket = null;
    });
    return;
  }

  if (url.startsWith('/ws/controller')) {
    // Controller connection
  const playerId = controllers.size + 1;
  const color = PLAYER_COLORS[playerId - 1] || '#fff';
  const name = PLAYER_NAMES[playerId - 1] || `P${playerId}`;
  controllers.set(ws, { id: playerId, color, name });
  console.log(`[SERVER] Controller ${playerId} connected`);

  // Notify controller of its identity
  ws.send(JSON.stringify({ type: 'identity', playerId, color, name }));

  // Notify display of new player
  broadcastToDisplay({ type: 'player_join', playerId, color, name });

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);
      const info = controllers.get(ws);
      if (!info) return;
      // Relay to display with player context
      broadcastToDisplay({
        type: 'input',
        playerId: info.id,
        ...msg
      });
    } catch (e) {}
  });

  ws.on('close', () => {
    const info = controllers.get(ws);
    if (info) {
      console.log(`[SERVER] Controller ${info.id} disconnected`);
      broadcastToDisplay({ type: 'player_leave', playerId: info.id });
      controllers.delete(ws);
    }
  });
  }
});

server.listen(PORT, () => {
  const ifaces = require('os').networkInterfaces();
  let localIP = 'localhost';
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIP = iface.address;
        break;
      }
    }
  }
  console.log('\n========================================');
  console.log('  ATMI Workshop Overdrive Server');
  console.log('========================================');
  console.log(`  Local URL:  http://${localIP}:${PORT}`);
  console.log(`  Display:    http://${localIP}:${PORT}/display.html`);
  console.log(`  Controller: http://${localIP}:${PORT}/controller.html`);
  console.log('========================================\n');
});
