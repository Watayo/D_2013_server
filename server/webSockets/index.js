'use strict'

module.exports = (wss) => {
  wss.on('connection', ws => {
    ws.on('message', message => {
      wss.clients.forEach(client => {
        // if (client.readyState === ws.OPEN) {
        //   client.send(message);
        // }
        // 自分以外
        if (client !== ws && client.readyState === ws.OPEN) {
          client.send("user_id:" + message);
        }
      })
      // ws.send("user_id:" + message);
      // console.log(message);
    });
  });
};