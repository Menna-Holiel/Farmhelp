const cors = require("cors");
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { SerialPort } = require('serialport'); 
const { ReadlineParser } = require('@serialport/parser-readline'); 

const app = express();
app.use(
    cors({
        origin: "*",
    })
)
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: '*', 
      methods: ['GET', 'POST'], 
    },
  });


const portName = 'COM7'; 
const serialPort = new SerialPort({ path: portName, baudRate: 9600 });


const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

io.on('connection', (socket) => {
  console.log('A user connected');

  parser.on('data', (data) => { 
    const message = data.toString();
    console.log(data)
    const [temperature, humidity, soilMoisture] = message.split(',');
    socket.emit('sensorData', {
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      soilMoisture: parseInt(soilMoisture),
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


const PORT = 7001; 
server.listen(PORT, () => {
  console.log(`Socket.io server is running on http://localhost:${PORT}`); 
});