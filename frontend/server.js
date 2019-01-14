const http = require("http");
const port = 8080;

const requestHandler = (request, response) => {
  response.end("Hello Node.js Server!\nGraphQL Endpoint: " + process.cwd());
};

const server = http.createServer(requestHandler);

server.listen(port, err => {
  if (err) {
    return console.log("something bad happened", err);
  }

  console.log(`server is listening on http://localhost:${port}`);
});
