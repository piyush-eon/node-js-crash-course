const express = require("express");
const controller = require("../controllers/applications.controller");
const {limiter, readLimiter} = require("../middleware/rateLimitter");
const router = express.Router();

// ===== PART 4a: Route registration =====
// Order matters: "/stats" must come before "/:id" or Express treats "stats" as an id.
// Get all applications (supports filter/sort/pagination)
router.get("/", readLimiter, controller.getAllApplications);
// Get application counts by status
router.get("/stats", readLimiter, controller.getStats);
// Get a single application by id
router.get("/:id",readLimiter,  controller.getApplicationById);
// Create a new application
router.post("/", limiter, controller.createApplication);
// Partially update an application
router.put("/:id", limiter, controller.updateApplication);
// Delete an application
router.delete("/:id", limiter, controller.deleteApplication);

module.exports = router;
