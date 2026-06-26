# Node JS Crash Course - Build a Job Tracker API

> **Documentation preview** — `swagger.yaml` is a standalone OpenAPI 3.0 spec and `swagger.html`
> loads Swagger UI from a CDN pointed at that file. Neither is wired into the running server;
> open `swagger.html` in a browser (via `file://` or `npx serve .`) for an offline interactive
> preview of all endpoints without installing any extra npm packages.


A simple in-memory job application tracker built with Node + Express.

The project uses a routes/controllers split (`routes/applications.routes.js` defines the URLs, `controllers/applications.controller.js` holds the logic).

## Setup

```bash
npm install
npm run dev
```

The server runs at `http://localhost:3000`.

All responses follow the same shape: `{ "success": true, "data": ... }` on success, or `{ "success": false, "error": "..." }` on failure.

## Routes

### Create an application

```
POST /applications
```

```bash
curl -X POST http://localhost:3000/applications -H "Content-Type: application/json" -d '{"company":"Google","role":"SWE","status":"applied"}'
```

Returns `{ "success": true, "data": { "id": 3, "company": "Google", "role": "SWE", "status": "applied", "appliedDate": "2026-06-23" } }`.

### Update an application (partial update)

```
PUT /applications/:id
```

```bash
curl -X PUT http://localhost:3000/applications/1 -H "Content-Type: application/json" -d '{"status":"interview"}'
```

Returns `{ "success": true, "data": { "id": 1, "company": "Google", "role": "SWE", "status": "interview", "appliedDate": "2026-06-01" } }`.

### Get all applications (optionally filtered, sorted, and paginated)

```
GET /applications?status=interview
GET /applications?status=applied&sort=date
GET /applications?page=1&limit=1
```

```bash
curl http://localhost:3000/applications?status=interview
curl "http://localhost:3000/applications?status=applied&sort=date"
curl "http://localhost:3000/applications?page=1&limit=1"
```

Returns `{ "success": true, "data": [ ... ] }`.

### Get application stats

```
GET /applications/stats
```

```bash
curl http://localhost:3000/applications/stats
```

Returns counts per status, e.g. `{ "success": true, "data": { "applied": 1, "interview": 1 } }`.

### Get a single application by id

```
GET /applications/:id
```

```bash
curl http://localhost:3000/applications/1
```

Returns `{ "success": true, "data": { "id": 1, "company": "Google", "role": "SWE", "status": "applied", "appliedDate": "2026-06-01" } }`.

### Delete an application

```
DELETE /applications/:id
```

```bash
curl -X DELETE http://localhost:3000/applications/1
```

Returns `204 No Content` with no body.
