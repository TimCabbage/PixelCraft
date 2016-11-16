import ws from 'ws'
import path from 'path'
import open from 'open'

import ClientConnection from '~/Server/ClientConnection'

var wss = new ws.Server({ port: 3000 });
console.log('Listening on port 3000...');
wss.on('connection', function (ws) {
  new ClientConnection(ws);
});
console.log('Accepting connections.');
