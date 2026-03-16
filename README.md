# TaskFlow — Full Stack Task Manager

A production-ready task management app built with **Node.js + TypeScript + Prisma (PostgreSQL)** on the backend and **Next.js 14 + TypeScript + Tailwind CSS** on the frontend.

---

## Project Structure

```
taskflow/
├── backend/          # Node.js + Express + Prisma API
└── frontend/         # Next.js 14 App Router
```

---

## Backend Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — set your DATABASE_URL and generate JWT secrets:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Set up the database
```bash
# Make sure PostgreSQL is running, then:
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Start the dev server
```bash
npm run dev
# API running at http://localhost:4000
```

---

## Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
# Default: NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Start the dev server
```bash
npm run dev
# App running at http://localhost:3000
```

---

## API Reference

### Auth
| Method | Endpoint         | Auth | Description              |
|--------|-----------------|------|--------------------------|
| POST   | /auth/register  | No   | Register a new user      |
| POST   | /auth/login     | No   | Login, get tokens        |
| POST   | /auth/refresh   | No   | Refresh access token     |
| POST   | /auth/logout    | No   | Revoke refresh token     |

### Tasks
| Method | Endpoint           | Auth | Description                    |
|--------|--------------------|------|-------------------------------|
| GET    | /tasks             | Yes  | List tasks (paginated, filtered) |
| POST   | /tasks             | Yes  | Create a task                 |
| GET    | /tasks/:id         | Yes  | Get a single task             |
| PATCH  | /tasks/:id         | Yes  | Update a task                 |
| DELETE | /tasks/:id         | Yes  | Delete a task                 |
| POST   | /tasks/:id/toggle  | Yes  | Toggle task status            |

### GET /tasks Query Parameters
| Param      | Type                        | Description         |
|------------|-----------------------------|---------------------|
| page       | number (default: 1)         | Page number         |
| limit      | number (default: 10, max 50)| Items per page      |
| search     | string                      | Filter by title     |
| status     | PENDING \| IN_PROGRESS \| COMPLETED | Filter by status |
| priority   | LOW \| MEDIUM \| HIGH       | Filter by priority  |
| sortBy     | createdAt \| updatedAt \| dueDate \| title \| priority | Sort field |
| sortOrder  | asc \| desc                 | Sort direction      |

---

## Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT (access + refresh tokens), bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios (with auto token-refresh interceptor)
- **Toasts**: react-hot-toast
- **Icons**: lucide-react

---

## Key Features

- ✅ JWT auth with automatic silent refresh
- ✅ Bcrypt password hashing
- ✅ Refresh token rotation (old token revoked on each refresh)
- ✅ Paginated task list with server-side filtering & search
- ✅ Full CRUD on tasks with optimistic UI updates
- ✅ Status toggle (Pending ↔ Completed)
- ✅ Priority & due date tracking with overdue highlighting
- ✅ Rate limiting on auth endpoints
- ✅ Responsive design (mobile + desktop)
- ✅ Toast notifications for all actions
- ✅ Skeleton loading states
- ✅ Confirm dialog for destructive actions