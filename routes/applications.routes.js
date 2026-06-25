const express = require("express");
const controller = require("../controllers/applications.controller");

const router = express.Router();

// ===== PART 4a: Route registration =====
// Order matters: "/stats" must come before "/:id" or Express treats "stats" as an id.
// Get all applications (supports filter/sort/pagination)
router.get("/", controller.getAllApplications);
// Get application counts by status
router.get("/stats", controller.getStats);
// Get a single application by id
router.get("/:id", controller.getApplicationById);
// Create a new application
router.post("/", controller.createApplication);
// Partially update an application
router.put("/:id", controller.updateApplication);
// Delete an application
router.delete("/:id", controller.deleteApplication);

module.exports = router;
