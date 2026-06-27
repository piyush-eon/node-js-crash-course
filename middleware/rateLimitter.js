
const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again after 15 minutes."
  // standardHeaders: true, // Return rate limit info in headers
  // legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Relaxed — for frequent read routes
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: "Too many requests, please try again later." },
});



module.exports ={ limiter, readLimiter}