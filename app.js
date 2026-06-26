// ===== PART 3a: Setup + first route =====
const express = require("express");
const applicationsRouter = require("./routes/applications.routes");

const app = express();

// ===== PART 3c: Middleware =====
// Parses JSON request bodies into req.body — required for POST/PUT.
app.use(express.json());

// For Swagger
app.use(express.static(__dirname));

// Custom logging middleware. Must call next() or the request hangs forever.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Welcome route, just to confirm the server is alive.
app.get("/", (req, res) => {
  res.send("Welcome to the Job Tracker API");
});

// ===== PART 4a: Router mounting + middleware =====
// Anything under /applications is handled by its own router file.
app.use("/applications", applicationsRouter);

// ===== PART 4j: Error handling =====
// Catch-all 404 handler. Runs only if no route above matched.
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Error-handling middleware. 4 params (err first) is how Express
// recognizes this as an error handler instead of regular middleware.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Internal server error" });
});

app.listen(3000, () => {
  console.log("Job Tracker API running on http://localhost:3000");
});
