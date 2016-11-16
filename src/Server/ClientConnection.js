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

  messageQueue = []

  constructor(ws){
    this.ws = ws;
    this.lastMessage = new Date().getTime();
    this.id = ClientConnection.getNewID();
    ClientConnection.registerConnection(this);

    ws.on('close', () => {
      console.log(this.id+'| closed');
      ClientConnection.unregisterConnection(this);
    });
    ws.on('message', this.onMessage);
  }

  heartBeat = () => {
    this.keepAlive();
  }

  keepAlive = () => {
    const now = new Date().getTime();
    if(now - this.lastMessage > 2*1000) {
      this.send({keepAlive:true});
    }
  }

  send = (data) => {
    this.lastMessage = new Date().getTime();
    try{
      this.ws.send(JSON.stringify(data), () => {
        console.log(this.id+'| send callback');
      });
    } catch(err) {
      console.log(err);
    }
  }

  onMessage = (message) => {
    this.lastMessage = new Date().getTime();
    console.log(this.id+'| message(last: '+this.lastMessage+'): ', message);
    this.send({'reply':''});
  }
}
