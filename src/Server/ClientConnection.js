export default class ClientConnection {
  static lastConnectionID = 0;
  static connections = {};
  static keepAliveInterval = setInterval(function () {
    for(var i in ClientConnection.connections){
      ClientConnection.connections[i].heartBeat()
    }
  }, 1000);

  static getNewID(){
    ClientConnection.lastConnectionID ++;
    return ClientConnection.lastConnectionID;
  }

  static registerConnection(client){
    ClientConnection.connections[client.id] = client;
  }

  static unregisterConnection(client){
    delete ClientConnection.connections[client.id];
  }

  static broadcastMessage(message, excludeConnection){
    for(var i in ClientConnection.connections){
      if(ClientConnection.connections[i]===excludeConnection) continue;
      ClientConnection.connections[i].send(message)
    }
  }

  messageQueue = []

  constructor(ws){
    this.ws = ws;
    this.lastMessage = new Date().getTime();
    this.id = ClientConnection.getNewID();
    this.pos = [Math.floor(Math.random()*10) - 5, Math.floor(Math.random()*10) - 5];
    ClientConnection.registerConnection(this);
    console.log(this.id+'| open');

    ws.on('close', () => {
      console.log(this.id+'| closed');
      ClientConnection.unregisterConnection(this);
      ClientConnection.broadcastMessage({
        type: 'remove',
        id: this.id,
        pos: this.pos
      })
    });
    ws.on('message', this.onMessage);
    //reply with the current state of board
    const others = [];
    for(var i in ClientConnection.connections){
      if(ClientConnection.connections[i]===this) continue;
      others.push({
        id: ClientConnection.connections[i].id,
        pos: ClientConnection.connections[i].pos
      });
    }
    this.send({
      type: 'login',
      id: this.id,
      pos: this.pos,
      others: others
    })
    ClientConnection.broadcastMessage({
      type: 'add',
      id: this.id,
      pos: this.pos
    }, this)
  }

  heartBeat = () => {
    this.keepAlive();
  }

  keepAlive = () => {
    const now = new Date().getTime();
    if(now - this.lastMessage > 20*1000) {
      this.send({});
    }
  }

  send = (data) => {
    this.lastMessage = new Date().getTime();
    try{
      //console.log(data);
      this.ws.send(JSON.stringify(data), () => {
        //console.log(this.id+'| send callback');
      });
    } catch(err) {
      console.log(this.id+'| Error: ', err);
    }
  }

  onMessage = (message) => {
    this.lastMessage = new Date().getTime();
    ClientConnection.broadcastMessage(JSON.parse(message), this);
    //console.log(this.id+'| message(last: '+this.lastMessage+'): ', message);
  }
}
