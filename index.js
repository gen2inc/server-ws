import { WebSocketServer } from 'ws';
import * as util from 'minecraft-server-util';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', async function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.on('close', () => {
    clearInterval(saygex);
    console.log("a client has disconnected")
  })

  
  try {
    const options = {
        timeout: 1000 * 5, // timeout in milliseconds
        enableSRV: true // SRV record lookup
    };
    
    const res = await util.status("mcis.turningfrogs.gay", 25565, options)
    ws.send(JSON.stringify({
        ver: res.version.name.replace("Paper ", ""),
        online: res.players.online, 
        max: res.players.max,
    }))
  } catch (e) {
      console.error(e);
      ws.send("error")
  }


  var saygex = setInterval(async () => {
    try {
        const options = {
            timeout: 1000 * 5, // timeout in milliseconds
            enableSRV: true // SRV record lookup
        };

        const res = await util.status("mcis.turningfrogs.gay", 25565, options)
        ws.send(JSON.stringify({
            ver: res.version.name.replace("Paper ", ""),
            online: res.players.online, 
            max: res.players.max,
        }))
    } catch (e) {
        console.error(e);
        ws.send("error")
    }
  }, 8000);
});
