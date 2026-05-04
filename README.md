# To-Do List App

Full-stack To-Do List application built with Node.js, Express.js, MongoDB, and React.

## Features

- Create, read, update, and delete tasks
- Update task status separately
- Search tasks by title or description
- Filter tasks by status
- Validate task input on the backend
- Display loading and error states on the frontend

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    services/
    validators/
frontend/
  src/
    services/
```

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Update `backend/.env` if needed:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/todo_list_app
CLIENT_URL=http://localhost:5173
```

The API runs at `http://localhost:5000/api`.

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Update `frontend/.env` if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

The React app runs at `http://localhost:5173`.

If the browser shows a blank page on Windows with a Vite `spawn EPERM` error, run the production preview instead:

```bash
npm run build
npm run preview:local
```

You can also run the built app without Vite:

```bash
npm run serve:dist
```

That fallback opens on `http://localhost:5174`.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Check server health |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks?search=work&status=pending` | Search and filter tasks |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update task details |
| PATCH | `/api/tasks/:id/status` | Update task status |
| DELETE | `/api/tasks/:id` | Delete a task |

Example task body:

```json
{
  "title": "Complete assignment",
  "description": "Build backend APIs and connect React frontend",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-05-10"
}
```

Valid statuses are `pending`, `in-progress`, and `completed`. Valid priorities are `low`, `medium`, and `high`.

## Testing With Postman

1. Start MongoDB locally or use a MongoDB Atlas URI in `backend/.env`.
2. Start the backend with `npm run dev`.
3. Test the API endpoints listed above in Postman.
4. Start the frontend and verify that adding, deleting, searching, filtering, and status updates sync with MongoDB.

## Deployment Notes

- Backend can be hosted on Render.
- Frontend can be hosted on Netlify.
- On Render, add `MONGO_URI` and `CLIENT_URL` environment variables.
- On Netlify, add `VITE_API_URL` pointing to the deployed backend API URL.

## Implementation Decisions

- The backend uses a controller, service, route, model, validator, and middleware structure for maintainability.
- Mongoose schema validation is combined with explicit request validation for clearer API error messages.
- The frontend uses Axios in a small API service module so components do not repeat request setup.
- React state is kept local with `useState` because this app has a focused data model and does not require a larger state library.

## Challenges Faced

- Validation needed to be handled consistently for both create and update operations. This was addressed by using shared validator middleware plus Mongoose validators.
- The frontend needs to stay responsive after updates. This was handled with optimistic status and delete updates, with rollback if an API request fails.
