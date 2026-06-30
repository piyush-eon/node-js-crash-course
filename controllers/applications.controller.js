const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data.json");

function readData() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw).applications;
}

function writeData(applications) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ applications }, null, 2));
}

// ===== PART 4c: Response helpers =====
function sendSuccess(res, status, data) {
  res.status(status).json({ success: true, data });
}

function sendError(res, status, message) {
  res.status(status).json({ success: false, error: message });
}

// ===== PART 4d: getAllApplications with sort/pagination =====
// Supports ?status=, ?sort=date, and ?page=&limit= — all optional and combinable.
// Order matters: filter first, then sort, then paginate.
exports.getAllApplications = (req, res) => {
  const { status, sort, page, limit } = req.query;

  let result = readData();

  if (status) {
    result = result.filter((app) => app.status === status);
  }

  // slice() first so we don't mutate the original array while sorting.
  if (sort === "date") {
    result = result
      .slice()
      .sort((a, b) => (a.appliedDate > b.appliedDate ? 1 : -1));
  }

  // Only paginate if both page and limit were given.
  if (page && limit) {
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const start = (pageNum - 1) * limitNum;
    result = result.slice(start, start + limitNum);
  }

  sendSuccess(res, 200, result);
};

// ===== PART 4e: getApplicationById =====
// req.params.id arrives as a string, so we convert it before comparing.
exports.getApplicationById = (req, res) => {
  const id = Number(req.params.id);
  const application = readData().find((app) => app.id === id);

  if (!application) {
    return sendError(res, 404, "Application not found");
  }

  sendSuccess(res, 200, application);
};

// ===== PART 4f: createApplication =====
// Create a new application.
exports.createApplication = (req, res) => {
  const { company, role, status } = req.body;

  if (!company || !role) {
    return sendError(res, 400, "Company and role are required");
  }

  const applications = readData();
  const nextId =
    applications.length > 0
      ? Math.max(...applications.map((a) => a.id)) + 1
      : 1;
  const appliedDate = new Date().toISOString().split("T")[0];

  const newApplication = {
    id: nextId,
    company,
    role,
    status: status || "applied",
    appliedDate,
  };

  applications.push(newApplication);
  writeData(applications);

  // 201 = Created
  sendSuccess(res, 201, newApplication);
};

// ===== PART 4g: updateApplication =====
// Partial update: only overwrite fields the client actually sent.
exports.updateApplication = (req, res) => {
  const id = Number(req.params.id);
  const applications = readData();
  const application = applications.find((app) => app.id === id);

  if (!application) {
    return sendError(res, 404, "Application not found");
  }

  const { company, role, status } = req.body;

  if (company !== undefined) application.company = company;
  if (role !== undefined) application.role = role;
  if (status !== undefined) application.status = status;

  writeData(applications);
  sendSuccess(res, 200, application);
};

// ===== PART 4h: deleteApplication =====
// Delete an application.
exports.deleteApplication = (req, res) => {
  const id = Number(req.params.id);
  const applications = readData();
  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) {
    return sendError(res, 404, "Application not found");
  }

  applications.splice(index, 1);
  writeData(applications);

  // 204 = No Content, so we skip the helpers and just end the response.
  res.status(204).end();
};

// ===== PART 4i: getStats =====
// Tally up applications per status, e.g. { applied: 2, interview: 1 }.
exports.getStats = (req, res) => {
  const counts = readData().reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  sendSuccess(res, 200, counts);
};
