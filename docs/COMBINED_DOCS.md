# NOVA Workspace - Project Documentation

Welcome to the documentation for **NOVA**, a premium, next-generation project management and collaboration platform.

## Overview

NOVA is designed for high-performing teams to plan with precision, collaborate seamlessly, and deliver projects on time. It features a modern, role-based architecture, blazing-fast Kanban boards, and a sleek, dark-mode aesthetic.

## Documentation Index

1. **[Local Setup & Installation](SETUP.md)**: Instructions on how to get the project running on your local machine.
2. **[Architecture & Tech Stack](ARCHITECTURE.md)**: Details about the technologies used and how the application is structured.

## Core Features

- **Role-Based Access Control (RBAC):** Distinct `ADMIN` and `MEMBER` roles. Admins can create projects, invite users, and allocate tasks. Members can view and update their assigned tasks.
- **Kanban Task Boards:** Visual drag-and-drop (or status-based) task management within projects.
- **Team Directory:** A centralized place to view all team members and their roles.
- **Premium UI/UX:** Built with a focus on aesthetics, featuring glassmorphism, deep dark modes, and subtle micro-animations.

## Target Audience
NOVA is built for modern agile teams, engineering squads, and design agencies who need powerful project management without the bloated complexity of legacy tools.
# Local Setup & Installation

Follow these steps to get NOVA running on your local development machine.

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.x or higher)
- **npm** or **yarn**
- **PostgreSQL** database (running locally or via a cloud provider like Supabase/Neon)

## 1. Clone the Repository

```bash
git clone https://github.com/Mayuraglawe/newwllly-one-.git
cd newwllly-one-
```

## 2. Install Dependencies

```bash
npm install
# or
yarn install
```

## 3. Environment Variables

Create a `.env` file in the root directory of the project. You will need to configure your database connection and NextAuth secret.

```env
# Database Connection String (Replace with your actual PostgreSQL URL)
DATABASE_URL="postgresql://user:password@localhost:5432/nova_db?schema=public"

# NextAuth Configuration
# Generate a secret using: `openssl rand -base64 32`
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## 4. Database Setup

Run the Prisma migrations to generate the database schema.

```bash
npx prisma db push
```
*(Note: If you have existing data you want to preserve, use `npx prisma migrate dev` instead)*

## 5. Start the Development Server

Start the Next.js development server:

```bash
npm run dev
# or
yarn dev
```

The application will now be running at `http://localhost:3000`.

## 6. Initial Admin Account

The first account registered in the system is automatically granted the `ADMIN` role. Subsequent registrations default to `MEMBER`. 

1. Go to `http://localhost:3000/register`
2. Create an account. This will be your primary Admin account.
3. Sign in and start creating projects!
# Architecture & Technology Stack

NOVA is built using a modern, robust, and scalable technology stack focused on performance and developer experience.

## Technology Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/) - React framework for Server-Side Rendering (SSR) and API routes.
- **Language:** TypeScript - For static typing and safer code.
- **Database ORM:** [Prisma](https://www.prisma.io/) - Next-generation Node.js and TypeScript ORM.
- **Database:** PostgreSQL - Relational database for structured data storage.
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) - Comprehensive authentication solution for Next.js, utilizing a credentials-based JWT strategy.
- **Styling:** Vanilla CSS Modules (`*.module.css`) - For scoped, highly customized, and premium styling without the overhead of utility-class frameworks.
- **Fonts:** Google Fonts (Inter) via `next/font/google`.

## Database Schema Overview

The database is defined in `prisma/schema.prisma` and contains the following core models:

### `User`
Represents individuals using the platform.
- `id`: String (UUID)
- `name`: String (Optional)
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: String (Defaults to `"MEMBER"`, can be `"ADMIN"`)

### `Project`
Represents a high-level grouping of work.
- `id`: String (UUID)
- `name`: String
- `description`: String (Optional)
- `createdById`: String (Relation to User)

### `Task`
Represents an actionable piece of work within a Project.
- `id`: String (UUID)
- `title`: String
- `description`: String (Optional)
- `status`: String (e.g., "TODO", "IN_PROGRESS", "DONE")
- `projectId`: String (Relation to Project)
- `assignedToId`: String (Optional, Relation to User)

## Application Structure (App Router)

The application utilizes the Next.js App Router (`src/app/`):

- `/` - Premium public landing page.
- `/login`, `/register` - Authentication routes.
- `/dashboard` - Protected layout containing the main application interface and Sidebar navigation.
  - `/dashboard/projects` - Project listing and creation.
  - `/dashboard/projects/[id]` - Project-specific Kanban board.
  - `/dashboard/tasks` - "My Tasks" view and global task allocation.
  - `/dashboard/team` - Team directory and platform-wide invitations.
- `/api/...` - Backend API routes handling CRUD operations and authentication logic.

## Security & Authentication Flow

1. **Authentication:** Handled via NextAuth `CredentialsProvider`. Passwords are encrypted before storing in the database.
2. **Session Management:** Uses JSON Web Tokens (JWT). 
3. **Role Validation (JWT Callback):** The NextAuth JWT callback is configured to re-query the database for the user's current `role` on every token refresh. This ensures that if a user's role is updated in the database, the UI and API permissions are updated immediately without requiring a manual logout/login.
4. **API Protection:** API routes check the active session to verify authentication and, where necessary (e.g., creating projects, allocating tasks), verify the `ADMIN` role before proceeding.
