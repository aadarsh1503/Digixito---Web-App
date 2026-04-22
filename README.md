# Task Management App — MERN Stack

A full-stack Task Management application built with MongoDB, Express, React, and Node.js.

## Project Structure

```
├── client/                        # React + Vite frontend
│   └── src/
│       ├── api/axios.js           # Axios instance with JWT interceptors
│       ├── context/AuthContext.jsx
│       ├── hooks/useTasks.js
│       ├── components/            # Navbar, TaskCard, TaskModal, Filters, Pagination, PrivateRoute, AdminRoute
│       └── pages/                 # Login, Register, Dashboard, AdminDashboard
└── server/                        # Express + MongoDB backend
    ├── config/db.js
    ├── controllers/               # auth, task, comment, user
    ├── middleware/                # auth (JWT + RBAC), errorHandler, validate
    ├── models/                    # User, Task, Comment
    ├── routes/                    # auth, task, comment, user
    └── scripts/createAdmin.js
```

---

## Setup

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

### Create Admin Account

A seed script is provided for **development/testing purposes only**.

Set the admin credentials in your `.env` before running:

```
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_secure_password
ADMIN_NAME=Admin
```

```bash
cd server
node scripts/createAdmin.js
```

> In a production environment, admin accounts should be provisioned through a secure internal process — not via a publicly documented script. Credentials are intentionally not hardcoded here. If you are an evaluator reviewing this project and need test credentials, please request them directly — they will be shared privately.

### Environment Variables

**Server** — copy `server/.env.example` to `server/.env`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend.vercel.app
ADMIN_NAME=Admin
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_secure_password
```

**Client** — copy `client/.env.example` to `client/.env`:

```
VITE_API_URL=https://your-backend.onrender.com/api
```

For local development, set `VITE_API_URL=http://localhost:5000/api` in `client/.env`.

---

## Deployment

### Backend — Render
1. Push the `server/` folder to a Git repo
2. Create a new Web Service on [Render](https://render.com)
3. Set build command: `npm install`, start command: `npm start`
4. Add environment variables:
   - `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`
   - `CLIENT_URL` — set to your Vercel frontend URL (e.g. `https://your-app.vercel.app`)

### Frontend — Vercel
1. Push the `client/` folder to a Git repo
2. Create a new project on [Vercel](https://vercel.com)
3. Add environment variable:
   - `VITE_API_URL` — set to your Render backend URL (e.g. `https://your-api.onrender.com/api`)

### CORS
The backend reads `CLIENT_URL` from env to configure CORS. Without it, cross-origin requests from the deployed frontend will be blocked. The Vite dev proxy (`server.proxy`) is commented out in `vite.config.js` — it is only needed for local development.

### Why VITE_API_URL is Required in Production

In local development, Vite's `server.proxy` intercepts any request to `/api/*` and forwards it to `http://localhost:5000`. This means relative URLs like `/api/auth/login` work without specifying a full origin.

In production (Vercel + Render), there is no proxy layer — the frontend is a static bundle served from Vercel's CDN and the backend runs as a separate service on Render. A relative URL like `/api/auth/login` would resolve to `https://your-frontend.vercel.app/api/auth/login`, which doesn't exist and returns a 404.

To solve this, `VITE_API_URL` is injected at build time by Vite and used as the `baseURL` in the Axios instance:

```js
// client/src/api/axios.baseURL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});
```

Every API call across the app (`api.get(...)`, `api.post(...)`, etc.) automatically prepends this base URL — so setting `VITE_API_URL=https://your-api.onrender.com/api` on Vercel is the only change needed to point all requests at the correct backend origin.

### Environment Variables

Copy `server/.env.example` to `server/.env`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

---

## Features

### Auth
- JWT-based register and login
- Token stored in localStorage, sent via Authorization header
- Auto-redirect to login on 401

### User Dashboard
- Create, edit, delete personal tasks
- Filter by status and priority
- Sort by date created, due date, or priority
- Pagination (9 tasks per page)
- Task stats (todo / in-progress / done counts)

### Admin Panel (RBAC)
- Admin logs in and lands directly on `/admin`
- Cannot access user dashboard
- Sees all registered users (non-admin only) with task stats and completion progress
- Can assign tasks to any user via a searchable user dropdown
- Can edit any user's task (including reassigning to a different user)
- Can delete any user's task
- Expandable task list per user row
- Summary stats: total users, tasks, completed, completion rate
- Search users by name or email

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Tasks (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get own tasks (filter, sort, paginate) |
| POST | /api/tasks | Create task |
| GET | /api/tasks/:id | Get single task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/tasks/admin/all | All tasks — admin only |
| POST | /api/tasks/admin/create-for-user | Create task for a user — admin only |
| PUT | /api/tasks/admin/:id | Update any task — admin only |
| DELETE | /api/tasks/admin/:id | Delete any task — admin only |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get all non-admin users with task stats |

### Comments (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks/:taskId/comments | Get comments for a task |
| POST | /api/tasks/:taskId/comments | Add comment |
| DELETE | /api/tasks/:taskId/comments/:id | Delete comment |

---

## Section 4: Debugging

### Bug 1 — Missing await in backend

When you forget `await` on a Mongoose query, the function receives a Promise object instead of the resolved document. Calling methods or accessing properties on it will fail silently or throw.

```js
// BUGGY — returns a Promise, not the user document
const getUser = async (id) => {
  const user = User.findById(id); // missing await
  return user.name;               // TypeError: cannot read properties of Promise
};

// FIXED — awaits the query before accessing the result
const getUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  return user.name;
};
```

This fix is applied across all controllers — every Mongoose query uses `await`.

---

### Bug 2 — Infinite loop in React useEffect

When an object or array is passed as a `useEffect` dependency, React compares by reference — not by value. A new object is created on every render, so the effect re-runs endlessly even if the values inside haven't changed.

```js
// BUGGY — `filters` is a new object reference every render → infinite loop
useEffect(() => {
  fetchTasks(filters);
}, [filters]);

// FIXED — stringify serializes the object to a stable string for comparison
useEffect(() => {
  fetchTasks(filters);
}, [JSON.stringify(filters)]);
```

This fix is applied in `client/src/hooks/useTasks.js`:

```js
const fetchTasks = useCallback(async () => {
  // fetch logic
}, [JSON.stringify(filters)]); // only re-runs when filter values actually change

useEffect(() => { fetchTasks(); }, [fetchTasks]);
```

---

## Section 5: Database Design

### Users
- `email` — unique index for fast login lookups
- `role` — enum: `user | admin` for RBAC

### Tasks
- Compound index on `{ user, status, priority, createdAt }` to support filtered + sorted queries efficiently
- `user` ref for ownership scoping

### Comments
- Index on `{ task, createdAt }` for fast per-task comment retrieval in reverse chronological order

---

## Section 6: Theory

### REST vs GraphQL
- REST uses fixed endpoints per resource — simple, cacheable, widely supported.
- GraphQL uses a single endpoint with flexible queries — avoids over/under-fetching.
- Use REST for simple CRUD APIs. Use GraphQL when clients need flexible, nested data.

### API Optimization
- Pagination to limit response size
- Compound indexes for filtered/sorted queries
- Select only required fields with `.select()`
- Use `Promise.all` for parallel async operations
- HTTP caching headers for read-heavy endpoints

### MongoDB Scaling
- Vertical scaling (bigger instance) for early stage
- Horizontal scaling via sharding for large datasets
- Replica sets for high availability and read scaling
- Atlas auto-scaling handles this managed

### Indexing
- Single field indexes for equality queries
- Compound indexes for multi-field filter + sort
- Avoid over-indexing — each index slows writes
- Use `explain()` to verify index usage

---

## Section 7: Flatten Nested Array

```js
const flatten = (arr) => arr.reduce(
  (acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val),
  []
);

// Example
flatten([1, [2, [3, [4]], 5]]);
// => [1, 2, 3, 4, 5]

// Native alternative (any depth)
[1, [2, [3, [4]], 5]].flat(Infinity);
```

---

## Section 8: DevOps

- Use `.env` for local secrets, never commit it (listed in `.gitignore`)
- Use `.env.example` to document required variables for other developers
- In production, inject secrets via environment variables (Railway, Render, AWS ECS)
- Use `NODE_ENV=production` to hide stack traces in error responses
- Containerize with Docker; use multi-stage builds to keep images small

---

## Section 9: Git

Commit convention: `feat`, `fix`, `chore`, `refactor` prefixes.

```
feat: add JWT auth with register and login
feat: add task CRUD with pagination, filtering, sorting
feat: add comment model and nested routes
feat: add RBAC with admin middleware
feat: build React dashboard with auth and task management
feat: build admin panel with user management and task assignment
fix: resolve mongoose async pre-save hook error
fix: remove duplicate schema index warning
chore: add .env.example and .gitignore
chore: add admin seed script
```
