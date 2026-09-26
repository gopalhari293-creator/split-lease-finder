# SplitLease — Smart Roommate & Apartment Finder

> **Don't just find an apartment. Find the right person to share it with.**

SplitLease is a full-stack web application designed to solve roommate incompatibility and simplify apartment hunting by combining **Roommate Lifestyle Matching + Apartment Discovery + Combined Group Matching + Real-Time Messaging**.

---

## 🌟 Key Features

* **AI Lifestyle Compatibility Algorithm**: Transparent 0–100% compatibility scoring across 5 weighted categories (Budget, Lifestyle & Cleanliness, Location, Schedule, Habits & Preferences).
* **Combined Roommate + Apartment Matching**: Calculates whether two or more roommate budgets align with a specific 2+ bedroom apartment rent, checking location fit, pet policy, and capacity.
* **Roommate Discovery**: Browse detailed roommate profiles with sliders for cleanliness, sleep schedule, social level, pets, smoking, and room preferences.
* **Apartment Search**: Filter apartments by location, price range, bedrooms, bathrooms, furnishing, and amenities in Grid or List view.
* **Saved Apartments**: Bookmark favorite properties (persisted in MongoDB Atlas).
* **In-App Messaging**: Real-time conversation threads between matched roommates and landlords.
* **Personalized Dashboard**: View profile completion score, recommended roommates, combined matches, stats, and quick actions.
* **Admin Portal**: System metrics, user management (suspension/deletion), and apartment listing creation.
* **Strict JWT Authentication**: Passwords hashed with `bcrypt`, authentication state managed via HTTP-Only cookies.

---

## 🏗️ Project Architecture

SplitLease is built using a decoupled architecture with separate frontend and backend applications.

```text
SplitLease/
├── frontend/             # Next.js 14 App Router UI (Port 3000)
│   ├── app/              # Page routes (Landing, Auth, Onboarding, Dashboard, Matches, etc.)
│   ├── components/       # Reusable UI, cards, layout, chat, and matching badges
│   ├── context/          # AuthContext & ToastContext
│   ├── services/         # Axios API clients
│   └── types/            # TypeScript interfaces
│
├── backend/              # Node.js + Express REST API Server (Port 5000)
│   ├── src/
│   │   ├── config/       # MongoDB Atlas connection + In-memory fallback
│   │   ├── controllers/  # Express route handlers
│   │   ├── middleware/   # JWT auth, role validation, Zod validation, error handler
│   │   ├── models/       # Mongoose Schemas (User, Profile, Apartment, Match, Chat)
│   │   ├── routes/       # REST API endpoints
│   │   ├── services/     # Matching algorithm service
│   │   └── seed/         # Database seed script
│
├── .env.example          # Environment variable template
├── package.json          # Root concurrent development scripts
└── README.md             # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
* Node.js v18+ and npm installed.

### 1. Clone & Install Dependencies
Run the root command to install dependencies for root, backend, and frontend:

```bash
npm run install:all
```

### 2. Configure Environment Variables
Copy `.env.example` to `backend/.env` (or configure your MongoDB Atlas URI):

```env
# backend/.env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/splitlease
JWT_SECRET=splitlease_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

*Note*: If `MONGODB_URI` is unconfigured or a local MongoDB server is not running, backend automatically boots an in-memory MongoDB database so the project works out-of-the-box!

### 3. Seed Database with Realistic Data
Populate realistic users, roommate profiles, apartments, matches, and chats:

```bash
npm run seed
```

### 4. Run Development Server
Start both Frontend (`http://localhost:3000`) and Backend API (`http://localhost:5000`) concurrently:

```bash
npm run dev
```

---

## 🔑 Demo Test Credentials

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Test User** | `alex@splitlease.com` | `password123` | USER |
| **Test User 2** | `sarah@splitlease.com` | `password123` | USER |
| **System Admin** | `admin@splitlease.com` | `admin123` | ADMIN |

---

## 📡 REST API Overview

* `POST /api/auth/register` — Register user & create profile
* `POST /api/auth/login` — Authenticate & set HTTP-only cookie
* `POST /api/auth/logout` — Clear token cookie
* `GET  /api/auth/me` — Fetch current logged in user & profile
* `GET  /api/roommates` — Search & filter roommate profiles
* `GET  /api/apartments` — Search & filter apartments
* `GET  /api/matches` — Get compatibility matches
* `GET  /api/matches/combined` — Get combined roommate + apartment matches
* `GET  /api/conversations` — Get active user chat threads
* `GET  /api/admin/stats` — System statistics (ADMIN only)
