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
