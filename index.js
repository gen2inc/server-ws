import { WebSocketServer } from 'ws';
import * as util from 'minecraft-server-util';

const wss = new WebSocketServer({ port: 8080 });
let cache = {};

async function grabData() {
  try {
    const options = {
        timeout: 1000 * 5, // timeout in milliseconds
        enableSRV: true // SRV record lookup
    };
    
    const res = await util.status("mcis.turningfrogs.gay", 25565, options)
    return {
      ver: res.version.name.replace("Paper ", ""),
      online: res.players.online, 
      max: res.players.max,
    }
  } catch (e) {
      console.error(e);
      return "error";
  }
}

cache = await grabData();

const data = setInterval(async () => {
  console.log('grabbing cache data');
  cache = await grabData();
}, 8000);

console.log("grabbed data from cache")

wss.on('connection', async function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.on('close', () => {
    clearInterval(saygex);
    console.log("a client has disconnected")
  })

  
  ws.send(JSON.stringify(cache))

  var saygex = setInterval(async () => {
    ws.send(JSON.stringify(cache));
  }, 10000);
});
