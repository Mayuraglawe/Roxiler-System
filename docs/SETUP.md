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
