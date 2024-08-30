const express = require('express');
const cors = require('cors');
const { createServer } = require('node:http');
const { join } = require('node:path');
const socketIO = require('socket.io');

const { upload, fileUpload, cancelProgress } = require('./routes');
const fetchQueueNames = require('./lib/fetchQueueNames');

const app = express();
const server = createServer(app);
const io = socketIO(server);
const distDir = join(__dirname, '..', 'client', 'dist');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(distDir));

app.use((req, res, next) => {
  req.io = io;
  next();
}, upload);

app.use((req, res, next) => {
  req.io = io;
  next();
}, fileUpload);

app.use(cancelProgress);

app.use('*/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'dist', 'index.html'));
});

fetchQueueNames(io);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.clear();
  console.log(`Server running on: http://127.0.0.1:${PORT}`);
});
