const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.text());

let client_send_times = [];

// Utility function to sleep
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
 
// Endpoint to get data from client
app.post('/data', function (request, response) {
    
    const message = request.body;

    // Log it to the console
    console.log("Received '%s' from client via post request (sse)", message);

    // Get the sent_time in microseconds of the message
    const sent_time = message.substr(message.lastIndexOf(' ') + 1);

    // Add the time in microseconds that this message took to get here
    // to the client_send_times array
    client_send_times.push(Date.now() - sent_time);

    response.set({"Access-Control-Allow-Origin": "*"});
    response.sendStatus(200);
});

// Endpoint to get server sent events
app.get('/sse-server', async function (request, response) {
    response.status(200).set({
        "connection": "keep-alive",
	"cache-control": "no-cache",
	"content-type": "text/event-stream",
	"access-control-allow-origin": "*"
    });
    
    //response.write(`data: hello world!\n\n`);
    //response.write(`data: hello world 2!\n\n`);

    // Ping client with sent unix time in microseconds, wait 500 milliseconds,
    // and repeat 100 times
    for (let i = 0; i < 100; i++) {
        let data = "Sent at " + Date.now();
        console.log("Sending '" + data + "' to client via sse");
        response.write(`data: ${data}\n\n`);
        await sleep(500);
    }

    // Done with everything, output our client send times
    console.log(client_send_times);
});

// start the express app
app.listen(8081, () => {});
