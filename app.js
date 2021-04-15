const http = require("http");
const port = 8080;


const server = http.createServer((request, response) => {
  console.log("Request Received!");

  const req = `${request.url} ${request.method}`;

  if (request.url === "/") {
    response.end("welcome");
  } else if (request.url === "/urls") {
    response.write("www.lighthouselabs.ca\nwww.google.com");
    response.end();
  } else {
    response.statusCode = 404;
    response.end("404 Page Not Found");
  }

});


console.log('Server created');

server.listen(port, () => {
  console.log(`Server listening on: http//localhost:${port}`);
});

console.log('Last line (after  .listen call)');