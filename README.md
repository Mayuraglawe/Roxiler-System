# ⭐ Store Rating Platform — Full Stack Web Application

A modern, high-performance **Store Rating & Review Management Platform** built with **Next.js (App Router)**, **TypeScript**, **NextAuth.js**, **Prisma ORM**, and **PostgreSQL (Supabase)**.

This application fulfills 100% of the requirements specified in the **FullStack Intern Coding Challenge**, featuring **Role-Based Access Control (RBAC)** for 3 distinct user roles, **1-to-5 Star Interactive Ratings**, **Glassmorphism Modals**, **Rating Distribution Analytics**, **One-Click CSV Report Exports**, and **Physics-Based Micro-Animations**.

---

## ✨ Features Overview

### 👥 1. Role-Based Access Control (RBAC)
- **👑 System Administrator (`ADMIN`)**:
  - Full platform metrics dashboard (Total Users, Stores, Ratings count).
  - Add & delete users and stores via glassmorphic modals.
  - Assign user roles (`USER`, `STORE_OWNER`, `ADMIN`).
  - Search, sort, and export system reports.
- **🏪 Store Owner (`STORE_OWNER`)**:
  - View registered store metrics & average ratings.
  - Inspect list of customers who submitted ratings for their store.
- **👥 Normal User (`USER`)**:
  - Browse stores with multi-field search (Name, Email, Address) & rating threshold filters.
  - Submit and modify interactive 1-to-5 star ratings (★).

---

### 📊 2. Store Rating Distribution & Analytics Modal
- Click **`📊 Breakdown`** on any store row to view:
  - Overall average rating score & total review counts.
  - Interactive **Star Rating Distribution Bar Chart** (5★, 4★, 3★, 2★, 1★ breakdown percentages & progress bars).

---

### 📥 3. One-Click CSV Data Export
- **Export Stores CSV**: Download store names, emails, addresses, and average rating scores as `.csv` files.
- **Export Users CSV**: Download user accounts, emails, addresses, and assigned roles into `.csv` files.

---

### 🔍 4. Multi-Criteria Search & Filtering
- **Stores Filter**: Filter by rating threshold (`All Ratings`, `4.0★ & Above`, `3.0★ & Above`, `Unrated Stores`).
- **Users Filter**: Filter by role (`All Roles`, `Normal Users`, `Store Owners`, `System Admins`).
- **Column Header Sorting**: Click headers to sort table rows by Name, Rating, or Role ascending/descending.

---

### 🔒 5. Security & Account Management
- **Password Strength Meter Bar**: Real-time evaluation of password complexity (8–16 chars, 1 Uppercase, 1 Special char).
- **Show/Hide Password Toggles**: Eye icon buttons (👁️ / 🙈) across Sign In, Register, Reset Password, and Settings.
- **Confirm Password Verification**: Real-time matching badges.
- **Profile Management**: Update Full Name & Physical Address in Settings with instant NextAuth session synchronization.

---

### 🎨 6. Premium UI & Micro-Animations
- **Glassmorphism Design**: Frosted glass cards, backdrop blurs, dark/light theme toggle.
- **Micro-Animations**: Spring pop modals (`modalPop`), star scaling (★), card hover lifts (`glowLift`), and active button tactile feedback.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Modules (Custom Design System with CSS Custom Properties)
- **Database**: PostgreSQL (via Supabase)
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider with bcrypt password hashing)

---

## 💻 Local Setup & Execution Guide

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database URL (e.g. Supabase, Neon, or local PostgreSQL)

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@host:port/dbname"
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Migration & Setup
Push the Prisma schema to your database:
```bash
npx prisma db push
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build Verification

To verify that the application compiles cleanly for production deployment:
```bash
npm run build
```

---

## 📄 License
This project is open-source and submitted for evaluation. All rights reserved.
