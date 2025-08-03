# 💪 Fitness Studio Booking Demo

A comprehensive full-stack fitness studio booking application built with **FastAPI** (backend) and **React + Vite + Tailwind** (frontend).

[![CI - Fitness Studio Booking](https://github.com/VIVEK7755/fitness-studio-booking-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/VIVEK7755/fitness-studio-booking-demo/actions/workflows/ci.yml)

---

## 📚 Table of Contents
- [✨ Key Features](#-key-features)
- [🚀 Quick Start](#-quick-start)
- [▶️ Running the Application](#-running-the-application)
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
- [📹 Loom Demo Video](#-loom-demo-video)
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
- ✅ GitHub Actions CI with test + build steps

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
# Clone the repository
git clone https://github.com/VIVEK7755/fitness-studio-booking-demo.git
cd fitness-studio-booking-demo
```


#### Option 1: Install All at Once (Recommended)

```bash
npm install
npm run install:all
```

#### Option 2: Manual Install

```bash
# Backend
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
pip install -r requirements.txt
cd ..

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

### 🖼️ Frontend (React + JSX)

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


## 🧪 API Testing with Postman

You can test the backend API locally using the included Postman collection:

📁 **File**: [`FitnessBooking.postman_collection.json`](./FitnessBooking.postman_collection.json)

### 🔧 How to Use

1. Make sure your **local backend server** is running on [http://localhost:8000](http://localhost:8000)
2. **Install the Postman desktop app** if not already installed

   > 🌐 Postman Web users: Localhost requests require the **Postman Agent** to be installed and running.
3. Open Postman → click **"Import"**
4. Select: `FitnessBooking.postman_collection.json`
5. Explore and test endpoints like:

   * `GET /classes`
   * `POST /book`
   * `GET /bookings?email=your@email.com`

> The collection includes examples for booking, viewing classes, and checking booking history.

---


## 📁 Project Structure

```
fitness-studio-booking-demo/
├── .github/workflows/
│   └── ci.yml                     # GitHub Actions CI config
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── models.py                  # SQLModel ORM models
│   ├── db.py                      # DB setup + session
│   ├── tests/
│   │   └── test_main.py           # Pytest tests
│   ├── __init__.py
│   └── requirements.txt
│   
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── postcss.config.js
│   └── tailwind.config.js
└── database.db                # SQLite DB (auto-generated)
├── FitnessBooking.postman_collection.json
├── pytest.ini
├── package.json                  # Monorepo script runner
├── .gitignore
└── README.md
```

---

## 🎨 Brand Design System

* **Colors**:

  * Brand Blue: `#14253e`
  * Brand Gold: `#F8D578`
* **Font**: Inter (Google Fonts)
* **UI**: Modal interface, responsive layout
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
* CI: Pytest run via GitHub Actions on `main`

### Frontend

* React + Vite + JSX
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
npm run dev:backend      # Backend only (FastAPI)
npm run dev:frontend     # Frontend only (React)
npm run install:all      # Install backend + frontend
npm run build:frontend   # Build frontend for production
```

> Requires [`concurrently`](https://www.npmjs.com/package/concurrently) for `npm start` to work.

---

## 🚀 Production Deployment

```bash
# Build frontend
npm run build:frontend

# Serve static files (e.g., Nginx, Express)
# Run backend via Gunicorn/Uvicorn for production
```

**Important**:

* Configure `.env` for production if needed
* Restrict CORS origins
* Set up logging & monitoring
* Use production-grade DB (e.g., Postgres)

---

Here’s the full **Markdown block** you can copy-paste into your `README.md` file to showcase your **edited demo video** professionally:

---


### ▶️ Demo Video

[🎥 **Watch Demo Video**](https://drive.google.com/file/d/1yN8cE3cHBknRqWWW54YFMUKOzQCVbZYL/view?usp=sharing)

> 🎬 **Polished walkthrough** of the Fitness Studio Booking app with AI voiceover
> 🔊 Covers backend API, frontend UI, and booking logic
> 📺 *Click the link above to watch the demo in action on Google Drive*


---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

**🚀 Ready to start your fitness journey — one booking at a time!**

