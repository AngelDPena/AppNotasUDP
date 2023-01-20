const { json } = require("body-parser");
const { time } = require("console");
const dgram = require("dgram");
const { TIMEOUT } = require("dns");
const server = dgram.createSocket("udp4");

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://Angel:ycMVTPw6PNkHm1iy@cluster0.oqicaw7.mongodb.net/test';
const dbName = 'Notas';
const client = new MongoClient(url);
const dbCollection = 'MisNotas'
var data = ''

server.bind(41234);

server.on("message", (msg, rinfo) => {
  console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  data = JSON.parse(msg);
  
  const newJson = {
    noteName: data.noteName,
    noteBody: data.noteBody 
  };
  if(data.operation.toLowerCase() == "add"){
    client.connect(function(err) {
      console.log("Connected successfully to server");
      const db = client.db(dbName);
      const collection = db.collection(dbCollection);
  
      collection.insertOne(newJson, function(err, result) {
        if(err)throw err;
        msg = JSON.stringify(result)
        server.send(msg, rinfo.port, rinfo.address, (err) => {
          if (err) {
            console.error(`Error sending message: ${err}`);
          } else {
            console.log(`Message sent to ${rinfo.address}:${rinfo.port}`);
          }
          server.close();
        });
        client.close();
      });
    });
  }else if(data.operation.toLowerCase() == "get"){
    
    client.connect(function(err) {
      console.log("Connected successfully to server");
      const db = client.db(dbName);
      const collection = db.collection(dbCollection);
      collection.find({}).toArray(function(err, docs) { 
        const message = JSON.stringify(docs)
        server.send(message, rinfo.port, rinfo.address, (err) => {
          if (err) {
            console.error(`Error sending message: ${err}`);
          } else {
            console.log(`Message sent to ${rinfo.address}:${rinfo.port}`);
            client.close();
          }
          server.close();
        });
        
      });
    });
  
  } 
});
server.on("listening", () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

