const WebSocket = require('ws');
 
const wss = new WebSocket.Server({ port: 8080 });

let client_send_times = [];
let messages_received = 0;

// Utility function to sleep
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
 
// Wait for websocket connection to be established
wss.on('connection', function connection(ws) {

  // When we get a message from the client
  ws.on('message', async function incoming(message) {

    // Log it to the console
    console.log('received: %s', message);

    // Get the sent_time in microseconds of the message
    const sent_time = message.substr(message.lastIndexOf(' ') + 1);

    // Add the time in microseconds that this message took to get here
    // to the client_send_times array
    client_send_times.push(Date.now() - sent_time);

    messages_received++;

    // If we are on our last message, start sending messages to the client
    if (messages_received == 100) {

      // Ping client with sent unix time in microseconds, wait 500 milliseconds,
      // and repeat 100 times
      for (let i = 0; i < 100; i++) {
        ws.send("Sent at " + Date.now());
        await sleep(500);
      }

      // Done with everything, output our client send times
      console.log(client_send_times);
    }
  });
});
