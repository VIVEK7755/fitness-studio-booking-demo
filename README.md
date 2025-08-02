
# 💪 Fitness Studio Booking Demo

A comprehensive full-stack fitness studio booking application built with **FastAPI** (backend) and **React + Vite + Tailwind** (frontend).

---

## 📚 Table of Contents
- [✨ Key Features](#-key-features)
- [🚀 Quick Start](#-quick-start)
- [🎯 Enhanced Features](#-enhanced-features)
- [📊 Sample Data (Auto-generated)](#-sample-data-auto-generated)
- [🧪 API Testing](#-api-testing)
- [📁 Project Structure](#-project-structure)
- [🎨 Brand Design System](#-brand-design-system)
- [🔧 Technical Implementation Details](#-technical-implementation-details)
- [🗃️ Database Schema](#-database-schema)
- [🛠 Development Notes](#-development-notes)
- [📦 Available Scripts](#-available-scripts)
- [🚀 Production Deployment](#-production-deployment)
- [🎉 Demo Highlights](#-demo-highlights)
- [📝 License](#-license)

---

## ✨ Key Features

### 🎯 Enhanced Backend
- ✅ Persistent SQLite database
- ✅ Timezone support (IST)
- ✅ Modular architecture
- ✅ Instructor info & booking tracking
- ✅ Validation + logging
- ✅ Auto-generated API docs

### 🎨 Enhanced Frontend
- ✅ View bookings by email
- ✅ Built-in API tester UI
- ✅ Tailwind CSS + Responsive layout
- ✅ Real-time feedback + error handling
- ✅ Modals for booking/history/tester

---

## 🚀 Quick Start

### ✅ Prerequisites
- Python 3.8+
- Node.js 18+

### 📦 Install & Setup

```bash
cd "c:\Users\vivek\Desktop\demo omnify"
````

#### Option 1: Install All at Once (Recommended)

```bash
npm install
npm run install:all
```

#### Option 2: Manual Install

```bash
# Backend
cd backend && pip install -r requirements.txt && cd ..

# Frontend
cd frontend && npm install && cd ..
```

> ✅ **No `.env` file needed** for local development. The backend uses SQLite and defaults to CORS open for `localhost`.

---

## ▶️ Running the Application

### Option 1: Start Both Services Together

```bash
npm start
```

### Option 2: Start Services Separately

```bash
# Backend
npm run dev:backend

# Frontend
npm run dev:frontend
```

### Access

* Frontend UI: [http://localhost:3000](http://localhost:3000)
* API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🎯 Enhanced Features

### 📋 Backend (FastAPI + SQLite)

* Modular structure: `main.py`, `models.py`
* Persistent DB: `database.db`
* Timezone: Full IST support via `pytz`
* Endpoints:

  * `GET /classes`
  * `POST /book`
  * `GET /bookings?email=`
* Pydantic validation, CORS, logging

### 🖼️ Frontend (React + TypeScript)

* View your bookings by email
* Built-in API Tester
* Booking and history modals
* Error boundaries + success feedback
* Tailwind-based brand styling

---

## 📊 Sample Data (Auto-generated)

First-time run will auto-generate 6 classes (only if `database.db` doesn't exist):

| Class         | Date  | Time     | Instructor | Slots |
| ------------- | ----- | -------- | ---------- | ----- |
| Morning Yoga  | Aug 2 | 8:00 AM  | Alice      | 10    |
| HIIT Training | Aug 2 | 6:00 PM  | Bob        | 8     |
| Pilates       | Aug 3 | 9:00 AM  | Charlie    | 12    |
| CrossFit      | Aug 3 | 7:00 PM  | David      | 6     |
| Zumba         | Aug 4 | 10:00 AM | Eva        | 15    |
| Boxing        | Aug 4 | 11:00 AM | Frank      | 5     |

---

## 🧪 API Testing

### Built-in UI Tester

* Click **"Test API"** in the header
* Choose endpoint & method
* Submit JSON and view response

### cURL Examples

```bash
# Book a class
curl -X POST "http://localhost:8000/book" \
     -H "Content-Type: application/json" \
     -d '{
       "class_id": 1,
       "client_name": "John Doe",
       "client_email": "john@example.com"
     }'

# View all classes
curl -X GET "http://localhost:8000/classes"

# View bookings for a user
curl -X GET "http://localhost:8000/bookings?email=john@example.com"
```

---

## 📁 Project Structure

```
demo omnify/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── models.py            # SQLModel ORM
│   ├── requirements.txt
│   └── database.db          # Auto-created SQLite DB
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── package.json             # Monorepo scripts
├── .gitignore
└── README.md
```

---

## 🎨 Brand Design System

* **Colors**:

  * Brand Blue: `#14253e`
  * Brand Gold: `#F8D578`
* **Font**: Inter (Google Fonts)
* **UI**: Modal interface, cards, mobile responsive
* **Icons**: Emoji-enhanced UX

---

## 🔧 Technical Implementation Details

### Backend

* FastAPI + SQLModel ORM
* SQLite DB
* Pydantic for models & validation
* Timezone aware (`pytz`)
* Logging + error handling
* Auto Swagger docs (`/docs`)

### Frontend

* React + Vite + TypeScript
* Tailwind CSS
* Fetch API for backend calls
* React Hooks + modals
* Error handling, real-time UI feedback

---

## 🗃️ Database Schema

```sql
-- Classes Table
CREATE TABLE class (
  id INTEGER PRIMARY KEY,
  name VARCHAR NOT NULL,
  start_datetime_IST DATETIME NOT NULL,
  instructor VARCHAR NOT NULL,
  available_slots INTEGER NOT NULL
);

-- Bookings Table
CREATE TABLE booking (
  id INTEGER PRIMARY KEY,
  class_id INTEGER NOT NULL,
  client_name VARCHAR NOT NULL,
  client_email VARCHAR NOT NULL,
  instructor VARCHAR NOT NULL
);
```

---

## 🛠 Development Notes

* SQLite DB persists across restarts
* Timezone conversion for consistent display
* CORS enabled for `localhost`
* Auto-reload supported (backend + frontend)
* Input validations on client & server
* Email validation and form constraints included

---

## 📦 Available Scripts

```bash
npm start                # Run both backend & frontend
npm run dev:backend      # Backend only
npm run dev:frontend     # Frontend only
npm run install:all      # Install both sides
npm run build:frontend   # Build frontend for production
```

---

## 🚀 Production Deployment

```bash
# Build frontend
npm run build:frontend

# Serve static files (e.g., using Nginx or Express)
# Backend should be served via Gunicorn/Uvicorn with proper env vars
```

> Don’t forget to:

* Set up `.env` or config files
* Restrict CORS origins
* Add logging/monitoring
* Run DB backups for SQLite or migrate to Postgres

---

## 🎉 Demo Highlights

* ✅ Full-stack architecture (FastAPI + React)
* ✅ Real-time booking with availability handling
* ✅ Custom UI with modals, validation, and state management
* ✅ API explorer for manual testing
* ✅ Modern tech stack with production-ready config

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

**🚀 Ready to start your fitness journey — one booking at a time!**

