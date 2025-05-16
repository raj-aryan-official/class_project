# TaskBoard Pro

## Project Introduction
TaskBoard Pro is an advanced project collaboration platform with workflow automation. It allows users to create projects, manage tasks in a Kanban view, invite teammates, and set up custom automations for workflow efficiency.

## Features
- Google OAuth authentication
- Project creation and member invitations
- Task management (CRUD, Kanban, due dates, assignees)
- Workflow automations (e.g., assign badge, move task, send notification)
- Real-time updates (WebSockets)
- Commenting system on tasks
- User badges and notifications
- Access control (only project members can view/modify data)

## API Documentation
### Auth
- `POST /api/users/login` — Upsert user on login

### Projects
- `GET /api/projects?email=...` — List projects for user
- `POST /api/projects` — Create project
- `POST /api/projects/:id/invite` — Invite user by email
- `GET /api/projects/:id/members` — List project members

### Tasks
- `GET /api/tasks/:projectId` — List tasks for project
- `POST /api/tasks/:projectId` — Create task
- `PATCH /api/tasks/:taskId` — Update task (status, assignee)
- `GET /api/tasks/:taskId/comments` — List comments
- `POST /api/tasks/:taskId/comments` — Add comment

### Automations
- `GET /api/automations/:projectId` — List automations
- `POST /api/automations/:projectId` — Create automation

### Notifications
- `GET /api/notifications` — List notifications for user

## Database Schema Diagrams
```
User: { name, email, avatar }
Project: { title, description, owner, members, statuses }
Task: { project, title, description, dueDate, assignee, status, comments }
Automation: { project, trigger, condition, action, createdBy }
Notification: { user, message, read }
```

## Sample Automation JSON
```
{
  "trigger": "status_change",
  "condition": { "status": "Done" },
  "action": { "type": "assign_badge", "badge": "Finisher" }
}
```

## Getting Started
1. Clone the repo
2. Install dependencies: `npm install`
3. Set up `.env` for backend (MongoDB URI, etc.)
4. Start backend: `npm run server`
5. Start frontend: `npm run dev`

## Video Demo
- [Add your Loom/YouTube link here]

## Postman Collection
- [Add your exported Postman collection here]
