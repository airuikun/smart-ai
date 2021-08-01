const path = require('path');
const HttpServer = require('http-server');

const server = HttpServer.createServer({ root: path.join(__dirname, 'lib') });
server.listen(20522, () => {
  console.log('正在监听20522端口的mock组件')
});

