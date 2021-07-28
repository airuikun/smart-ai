const path = require('path');
const HttpServer = require('http-server');

const server = HttpServer.createServer({ root: path.join(__dirname, 'lib') });
server.listen(13190, () => {
  console.log('正在监听13190端口的mock组件')
});

