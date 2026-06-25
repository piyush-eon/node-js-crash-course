// This file is just for the "before Express" part of the tutorial.
// It builds a tiny web server using ONLY Node's built-in "http" module,
// with no third-party packages at all. We use it to show what a framework
// like Express is actually doing for us behind the scenes.

// ===== PART 2b: Raw HTTP server, no dependencies =====
const http = require("http");

// http.createServer takes a function that runs every single time a request
// comes in. Node gives us two objects: "req" (the incoming request) and
// "res" (the response we send back).
const server = http.createServer((req, res) => {
  // With raw Node, there is no built-in router. So we have to manually
  // check the URL and method ourselves with a chain of if/else statements.
  // This is exactly the kind of repetitive work that Express's app.get(),
  // app.post(), etc. do for us automatically — Express is really just a
  // nicer way of writing this same if/else logic.
  if (req.method === "GET" && req.url === "/") {
    // Plain text response: we set the content type and just write a string.
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Welcome to the Job Tracker API");
  } else if (req.method === "GET" && req.url === "/health") {
    // JSON response: with raw http, we have to manually stringify the
    // object ourselves. Express normally does this for us with res.json().
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
  } else {
    // If nothing above matched, fall through to a generic 404.
    // This is the same idea as Express's catch-all 404 middleware,
    // just written by hand instead of using app.use().
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
