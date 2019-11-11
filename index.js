require('dotenv').config();

const server = require('./server.js');

const port = 6000;

server.listen(port, () => {
  console.log(`=== server listening on port ${port} ===`)
});