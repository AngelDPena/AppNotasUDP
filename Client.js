const dgram = require("dgram");
const readline = require("readline");
const client = dgram.createSocket("udp4");
const server = dgram.createSocket("udp4");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const serverPort = 41234;
const serverAddress = "localhost";
rl.question("Operation: ", (operacion) => {
  rl.question("Note Name: ", (noteName) => {
    rl.question("Note Body: ", (noteBody) => {
      let message = `{
        "operation" : "${operacion}",
        "noteName": "${noteName}",
        "noteBody": "${noteBody}"
        }`;
      message = Buffer.from(message);
      client.send(message, serverPort, serverAddress, (err) => {
        if (err) {
          console.error(`Error sending message: ${err}`);
        } else {
          console.log(`Message sent to ${serverAddress}:${serverPort}`);
        }
        client.on('message', (msg, rinfo) => {
          const message = JSON.stringify(JSON.parse(msg))
          console.log(`Client received: ${message} from ${rinfo.address}:${rinfo.port}`);
          client.close();
        });
        rl.close();
      });
    });
  });
});



/*client.on("listening", () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});*/

