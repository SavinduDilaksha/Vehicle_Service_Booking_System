# Vehicle Service Booking System (MERN Stack)

A complete decoupled **MERN Stack** (MongoDB, Express.js, React.js, Node.js) web application for vehicle service booking and management.

---

## Directory Structure

```
MERN_App/
├── backend/          # Node.js + Express + Mongoose REST API (Port 5000)
│   ├── config/       # Database connection
│   ├── controllers/  # API request handlers
│   ├── middleware/   # JWT authentication & admin protection
│   ├── models/       # MongoDB Schemas (User, Booking, ServiceCategory, etc.)
│   ├── routes/       # Express route handlers
│   ├── seed.js       # Database seeder script
│   ├── server.js     # Express App entry point
│   └── .env          # Environment configuration
│
└── frontend/         # React + Vite Single Page Application (Port 3000)
    ├── src/
    │   ├── api/      # Axios client with JWT headers
    │   ├── components/# Navbar, Footer, AdminSidebar, ProtectedRoute
    │   ├── context/  # AuthContext for global user state
    │   ├── pages/    # Home, Services, Book, Login, Register, Profile, Admin Pages
    │   ├── App.jsx   # Client-side router
    │   └── main.jsx
    └── vite.config.js
```

---

## How to Run the Project

### 1. Backend Setup (`backend/`)

Open a terminal window and navigate to `backend`:

```bash
cd backend
npm install
```

**Seed Initial Data (Admin & Demo Users):**
```bash
npm run seed
```

**Start Backend Server:**
```bash
npm run dev
```
> Server will start at: **http://localhost:5000**

---

### 2. Frontend Setup (`frontend/`)

Open a second terminal window and navigate to `frontend`:

```bash
cd frontend
npm install
npm run dev
```
> React App will open at: **http://localhost:3000**



## Default Credentials

- **Admin Account**: `admin@shinywave.lk` / `admin123`
- **User Account**: `kasun@example.com` / `user123`

---

## REST API Endpoints

## Authentication (`/api/auth`)
- **`POST /api/auth/register`** — Register new user
- **`POST /api/auth/login`** — Login & receive JWT token
- **`GET /api/auth/me`** — Get current logged-in user profile (Requires `Authorization: Bearer <TOKEN>`)

## 🔧 Services (`/api/services`)
- **`GET /api/services`** — Get all service categories
- **`GET /api/services/:slug`** — Get single service details
- **`POST /api/services`** — Create service category (Admin)
- **`PUT /api/services/:id`** — Update service category (Admin)
- **`DELETE /api/services/:id`** — Delete service category (Admin)

## Bookings (`/api/bookings`)
- **`POST /api/bookings`** — Create new vehicle booking (User)
- **`GET /api/bookings/my`** — Get logged-in user's booking history
- **`GET /api/bookings`** — Get all bookings (Admin)
- **`PUT /api/bookings/:id/status`** — Update booking status (`Pending`, `Approved`, `Completed`, `Cancelled`) (Admin)
