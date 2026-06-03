# Task Management System — Frontend

React single-page app for the **ICON Studios** full-stack trial. It talks to the
**Task Manager API** (separate repo: `TaskManagementSystem`) over HTTP using a JWT bearer token.

Features: register / log in, list tasks, create & edit (modal form), mark complete/incomplete,
filter by status / priority / completion / search, and **drag-and-drop reordering** — all responsive.

- React 19 + Vite · React Router · **Context API** state · axios · `@hello-pangea/dnd`

---

## Prerequisites

- Node.js 20+
- A running Task Manager API (see the backend repo). Default dev API URL: `http://localhost:5062/api`.

## Run locally

```bash
cp .env.example .env      # set VITE_API_URL to your API base URL (no trailing slash)
npm install
npm run dev               # http://localhost:5173
```

Then open the app, **register an account**, and start managing tasks.

Other scripts:

```bash
npm run build             # production build to dist/
npm run preview           # preview the production build
npm run lint              # ESLint
```

## Run with Docker

Builds the app and serves it with Nginx on port 3000. The API URL is baked in at build time.

```bash
# VITE_API_URL defaults to http://localhost:5000/api (matches the backend Docker stack)
docker compose up --build         # http://localhost:3000

# or override the API URL:
docker build --build-arg VITE_API_URL=http://localhost:5062/api -t tms-frontend .
docker run -p 3000:80 tms-frontend
```

## Configuration

| Variable | Default | Notes |
|----------|---------|-------|
| `VITE_API_URL` | `http://localhost:5062/api` | API base URL. Inlined at build time by Vite. |

## Structure

```
src/
  components/   # Navbar, TaskList (drag-and-drop), TaskCard, TaskForm, TaskFilters, ProtectedRoute
  context/      # AuthContext, TaskContext (Context API state)
  pages/        # LoginPage, RegisterPage, TasksPage
  services/     # api.js (axios + JWT interceptors), authService, taskService
  constants.js  # status/priority values mirroring the API enums
Dockerfile · nginx.conf · docker-compose.yml
```
