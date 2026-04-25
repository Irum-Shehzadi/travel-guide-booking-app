# 🏔️ TravelGuide Pakistan
### *A Full-Stack Travel Guide Booking & Discovery Platform*

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python_3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)

> **Final Year Project** — A comprehensive digital ecosystem connecting travelers with professional local guides across Pakistan.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Frontend Pages & Routes](#-frontend-pages--routes)
- [Database Schema](#-database-schema)
- [Authentication Flow](#-authentication-flow)
- [Modules Explained](#-modules-explained)

---

## 🌍 Overview

**TravelGuide Pakistan** is a full-stack web application that bridges the gap between travelers and experienced local guides across Pakistan. The platform supports three distinct user roles — **Traveler**, **Guide**, and **Admin** — each with dedicated dashboards, features, and access levels.

The system is built with a **FastAPI** backend (Python) connected to a **MongoDB** NoSQL database, and a **React + Vite** frontend with a premium "Obsidian Aurora" dark-mode aesthetic using **Tailwind CSS** and **Framer Motion** animations.

### Key Goals:
- Allow travelers to **discover, search, and book** verified local guides.
- Provide guides with a **professional dashboard** to manage bookings and client feedback.
- Give admins **full control** over users, bookings, guide verification, and reviews.
- Integrate **real-time weather** for travel planning.
- Enable a **3D interactive globe** for immersive destination exploration.

---

## ✨ Features

### 👤 For Travelers
| Feature | Description |
|---------|-------------|
| **Signup / Login** | Email & password auth with JWT tokens |
| **Browse Destinations** | 50+ curated Pakistani destinations with photos, descriptions & tags |
| **Real-Time Weather** | Live weather data for any destination via Open-Meteo API |
| **Search Guides** | Filter guides by city, name, or specialization |
| **Book a Guide** | Request a guide with specific dates, destination & duration |
| **Booking Dashboard** | View all bookings with status (Pending / Confirmed / Completed / Cancelled) |
| **Leave Reviews** | Rate and review guides after a completed trip |
| **Contact Admin** | Submit support messages and view admin replies |
| **Real-time Notifications** | Get notified for booking status changes |

### 🧭 For Guides
| Feature | Description |
|---------|-------------|
| **Register with Verification** | Upload CNIC and profile photo for admin verification |
| **Guide Profile** | Set city, languages, specializations, experience, bio |
| **Booking Management** | Accept, decline, or complete booking requests |
| **Stats Dashboard** | See total bookings, pending/confirmed/completed counts |
| **Review System** | View traveler reviews and reply professionally |
| **Support Messages** | Send and receive messages from the admin |
| **Cloudinary Uploads** | Profile & CNIC photos stored on Cloudinary CDN |

### 🛡️ For Admins
| Feature | Description |
|---------|-------------|
| **Admin Dashboard** | Full overview of all travelers, guides, bookings, and reviews |
| **Guide Verification** | Approve or reject guide registration applications |
| **User Management** | View, activate, or deactivate any user account |
| **Review Moderation** | Browse all platform reviews |
| **Support Inbox** | Reply to contact messages from travelers and guides |
| **Statistics** | Platform-wide stats (total users, guides, bookings) |

### 🌐 General Platform
| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Secure token-based auth for all user types |
| **Protected Routes** | Route guards based on user role |
| **3D Interactive Globe** | Explore destinations visually via Three.js globe |
| **Responsive Design** | Fully mobile-responsive across all screen sizes |
| **Framer Motion** | Smooth page transitions and micro-animations |
| **Notification System** | In-app notification dropdown for all user types |
| **Chat Module** | Messaging system between users |

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | Latest | High-performance async Python web framework |
| **Uvicorn** | Latest | ASGI server for FastAPI |
| **MongoDB** | 6.x+ | Primary NoSQL document database |
| **Motor** | Latest | Async MongoDB driver for Python |
| **Pydantic v2** | 2.x | Data validation, serialization, and settings |
| **Python-Jose** | Latest | JWT (JSON Web Token) creation and verification |
| **Passlib + Bcrypt** | Latest | Password hashing and verification |
| **Cloudinary** | Latest | Cloud storage & CDN for images |
| **HTTPX** | Latest | Async HTTP client for third-party APIs |
| **Open-Meteo API** | Free | Real-time weather data (no API key needed) |
| **Python-Multipart** | Latest | Form data and file upload handling |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | Component-driven UI library |
| **Vite** | 5.x | Fast development build tool |
| **React Router DOM** | 6.x | Client-side routing and navigation |
| **Tailwind CSS** | 3.x | Utility-first CSS styling framework |
| **Framer Motion** | Latest | Animation and page transition library |
| **Three.js / R3F** | Latest | 3D rendering for the interactive globe |
| **Lucide React** | Latest | Clean, consistent icon library |
| **React Icons** | Latest | Extended icon set (IoChevronDown etc.) |
| **Context API** | Built-in | Global state for Auth and Notifications |

---

## 📂 Project Structure

```
fyp-1/
│
├── 📁 backend/                        # FastAPI Backend
│   ├── 📄 main.py                     # App entry point, routers, CORS, middleware
│   ├── 📄 database.py                 # MongoDB async connection (Motor)
│   ├── 📄 models.py                   # All Pydantic schemas & data models
│   ├── 📄 utils.py                    # JWT helpers, password hashing
│   ├── 📄 requirements.txt            # Python dependencies
│   ├── 📄 .env                        # Environment variables (secret keys, DB URL)
│   ├── 📁 routers/
│   │   ├── 📄 traveler.py             # Traveler signup, login, profile
│   │   ├── 📄 guide.py                # Guide register, login, listing, search
│   │   ├── 📄 booking.py              # Create, read, update booking status
│   │   ├── 📄 review.py               # Create reviews, replies, fetch by guide/traveler
│   │   ├── 📄 contact.py              # Contact/support form submission & replies
│   │   ├── 📄 upload.py               # Cloudinary file upload endpoint
│   │   ├── 📄 weather.py              # Weather data via Open-Meteo API
│   │   ├── 📄 places.py               # Places search API integration
│   │   ├── 📄 admin.py                # Admin-specific routes (verification, stats)
│   │   ├── 📄 notification.py         # In-app notification management
│   │   └── 📄 chat.py                 # Messaging between users
│   └── 📁 uploads/                    # Local file upload temp directory
│
└── 📁 frontend/                       # React + Vite Frontend
    ├── 📄 vite.config.js              # Vite configuration
    ├── 📄 package.json                # Node dependencies
    ├── 📄 tailwind.config.js          # Tailwind CSS configuration
    ├── 📄 index.html                  # HTML entry point
    └── 📁 src/
        ├── 📄 App.jsx                 # Main app, all routes defined here
        ├── 📄 App.css                 # Global custom CSS & design tokens
        ├── 📄 index.css               # Tailwind imports & base styles
        ├── 📄 main.jsx                # React DOM entry point
        │
        ├── 📁 context/
        │   ├── 📄 AuthContext.jsx     # Global auth state (user, login, logout)
        │   └── 📄 NotificationContext.jsx  # Notification state management
        │
        ├── 📁 api/
        │   └── 📄 places.js           # Places API helper functions
        │
        ├── 📁 data/
        │   └── 📄 destinations.js     # Static data for 50+ Pakistan destinations
        │
        ├── 📁 assets/
        │   ├── 🖼️ logo.png            # Platform logo
        │   └── 🖼️ logo_transparent.png
        │
        └── 📁 Components/
            ├── 📄 Navbar.jsx              # Top navigation bar with role-based links
            ├── 📄 Footer.jsx              # Site footer
            ├── 📄 HeroSection.jsx         # Landing page hero with 3D globe
            ├── 📄 Globe3D.jsx             # Three.js 3D interactive globe
            ├── 📄 BookingForm.jsx         # Booking modal form
            ├── 📄 ReviewForm.jsx          # Guide review submission form
            ├── 📄 DestinationReviewForm.jsx  # Destination review form
            ├── 📄 PlaceCard.jsx           # Destination card component
            ├── 📄 NotificationDropdown.jsx   # Notification bell & dropdown
            ├── 📄 ProtectedRoute.jsx         # Route guard by user role
            │
            ├── 📁 Contact/
            │   └── 📄 Contact.jsx         # Contact/support page
            │
            ├── 📁 common/
            │   ├── 📄 WeatherWidget.jsx   # Real-time weather display widget
            │   └── 📄 ChatWidget.jsx      # Chat popup widget
            │
            ├── 📁 Landing/
            │   ├── 📄 GallerySection.jsx  # Photo gallery for landing page
            │   ├── 📄 GuideTestimonials.jsx  # Testimonials section
            │   └── 📄 ReviewSection.jsx   # Reviews on landing page
            │
            └── 📁 Pages/
                ├── 📄 About.jsx              # About the platform page
                ├── 📄 PakistanDestination.jsx # All destinations with weather
                ├── 📄 Review.jsx             # Full reviews listing page
                │
                ├── 📁 Traveler/
                │   ├── 📄 TravelerSign.jsx   # Traveler login & signup combined
                │   └── 📄 TravelerDashboard.jsx  # Traveler bookings & history
                │
                ├── 📁 Guide/
                │   ├── 📄 GuideLogin.jsx      # Guide login page
                │   ├── 📄 GuideRegistration.jsx  # Full guide signup with uploads
                │   ├── 📄 GuideDashboard.jsx  # Guide booking management
                │   ├── 📄 GuideBooking.jsx    # Browse & book available guides
                │   ├── 📄 GuideDetail.jsx     # Individual guide profile view
                │   └── 📄 GuideProfile.jsx    # Guide's own profile editor
                │
                └── 📁 Admin/
                    ├── 📄 AdminLogin.jsx      # Admin login page
                    ├── 📄 AdminDashboard.jsx  # Full admin control panel
                    └── 📄 AdminMessages.jsx   # Support message management
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Python** 3.10 or higher
- **Node.js** 18 or higher
- **MongoDB** running on `localhost:27017` (or a MongoDB Atlas connection URL)
- **Git**

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/fyp-1.git
cd fyp-1
```

---

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install all required dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

✅ Backend runs at: **http://localhost:8000**
✅ API Documentation (Swagger UI): **http://localhost:8000/docs**
✅ Alternative Docs (ReDoc): **http://localhost:8000/redoc**

---

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

✅ Frontend runs at: **http://localhost:5173**

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory with the following variables:

```env
# MongoDB
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=travel_booking

# JWT Security
SECRET_KEY=your-very-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

> ⚠️ **Never commit your `.env` file to version control.** It is already in `.gitignore`.

---

## 📡 API Endpoints

### 🧍 Traveler Routes — `/api/traveler`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/signup` | Register a new traveler account | ❌ |
| `POST` | `/login` | Login and receive JWT token | ❌ |
| `GET` | `/profile/{email}` | Get traveler profile by email | ✅ |

---

### 🧭 Guide Routes — `/api/guide`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register a new guide (with CNIC & photo) | ❌ |
| `POST` | `/login` | Guide login, receive JWT token | ❌ |
| `GET` | `/all` | Get all active guides | ❌ |
| `GET` | `/{guide_id}` | Get a single guide's full details | ❌ |
| `GET` | `/email/{email}` | Get guide details by email | ❌ |
| `GET` | `/search/city/{city}` | Search guides filtered by city | ❌ |

---

### 📅 Booking Routes — `/api/booking`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/create` | Create a new booking request | ✅ |
| `GET` | `/traveler/{email}` | Get all bookings for a traveler | ✅ |
| `GET` | `/guide-email/{email}` | Get all bookings for a guide | ✅ |
| `GET` | `/{booking_id}` | Get a specific booking by ID | ✅ |
| `PUT` | `/{booking_id}/status` | Update booking status (confirm/cancel/complete) | ✅ |
| `DELETE` | `/{booking_id}` | Cancel/delete a booking | ✅ |

---

### ⭐ Review Routes — `/api/review`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/create` | Submit a review for a guide | ✅ |
| `GET` | `/guide/{guide_id}` | Get all reviews for a specific guide | ❌ |
| `GET` | `/guide-email/{email}` | Get reviews by guide email | ❌ |
| `GET` | `/traveler/{email}` | Get all reviews submitted by a traveler | ✅ |
| `GET` | `/all` | Get all platform reviews | ❌ |
| `PUT` | `/{review_id}/reply` | Guide replies to a review | ✅ |

---

### 🌤️ Weather Routes — `/api/weather`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/cities` | Get list of all supported Pakistani cities |
| `GET` | `/{city}` | Get real-time weather data for a city |

**Supported Regions:**
- **Punjab:** Lahore, Islamabad, Rawalpindi, Multan, Faisalabad, Sialkot
- **Sindh:** Karachi, Hyderabad, Sukkur, Larkana
- **KPK:** Peshawar, Swat Valley, Chitral, Naran Kaghan, Abbottabad
- **Balochistan:** Quetta, Gwadar, Ziarat, Turbat
- **Gilgit-Baltistan:** Hunza Valley, Skardu, Fairy Meadows, Khunjerab
- **Azad Kashmir:** Muzaffarabad, Neelum Valley, Rawalakot

---

### 📬 Contact Routes — `/api/contact`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/submit` | Submit a contact/support message |
| `GET` | `/all` | Get all messages (admin only) |
| `GET` | `/user/{email}` | Get messages by user email |
| `PUT` | `/{message_id}/reply` | Admin replies to a message |

---

### 🔔 Notification Routes — `/api/notification`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/create` | Create a new notification |
| `GET` | `/user/{email}` | Get all notifications for a user |
| `PUT` | `/{notification_id}/read` | Mark a notification as read |
| `DELETE` | `/{notification_id}` | Delete a notification |

---

### 🖼️ Upload Routes — `/api/upload`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/image` | Upload an image to Cloudinary |

---

### 🏢 Admin Routes — `/api/admin`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/login` | Admin login |
| `GET` | `/stats` | Get platform-wide statistics |
| `GET` | `/guides` | Get all guides (verified + unverified) |
| `PUT` | `/guides/{guide_id}/verify` | Approve a guide registration |
| `PUT` | `/guides/{guide_id}/reject` | Reject a guide registration |
| `GET` | `/travelers` | Get all registered travelers |
| `GET` | `/bookings` | Get all platform bookings |

---

## 🌐 Frontend Pages & Routes

| Page | Route | Accessible By | Description |
|------|-------|---------------|-------------|
| **Home / Landing** | `/` | Everyone | Hero section with 3D globe, featured guides, destinations |
| **About** | `/about` | Everyone | Platform story, mission, team info |
| **Destinations** | `/pakistan-destinations` | Logged in users | Full 50+ destination listing with weather |
| **Contact** | `/contact` | Everyone | Support/contact form |
| **Traveler Sign In/Up** | `/traveler-signin` | Guests | Combined login and signup for travelers |
| **Guide Login** | `/guide-login` | Guests | Login page for registered guides |
| **Guide Registration** | `/guide-registration` | Guests | Multi-step guide signup with CNIC upload |
| **Admin Login** | `/admin-login` | Admin | Dedicated admin authentication |
| **Guides Listing** | `/guide-booking` | Logged in | Browse and filter all available guides |
| **Guide Detail** | `/guide/:id` | Everyone | Full profile, reviews, and booking button for a guide |
| **Traveler Dashboard** | `/traveler-dashboard` | Travelers | Booking history, reviews, support messages |
| **Guide Dashboard** | `/guide-dashboard` | Guides | Assignment queue, review management |
| **Guide Profile** | `/guide-profile` | Guides | Edit guide's own profile details |
| **Admin Dashboard** | `/admin-dashboard` | Admin only | Full system control panel |

---

## 🗄️ Database Schema

All data is stored in **MongoDB**. The database name is `travel_booking`.

---

### Collection: `travelers`
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "hashed_password": "string (bcrypt)",
  "is_active": true,
  "created_at": "datetime"
}
```

---

### Collection: `guides`
```json
{
  "_id": "ObjectId",
  "fullName": "string",
  "email": "string (unique)",
  "phone": "string",
  "city": "string",
  "experience": "integer (years)",
  "about": "string",
  "languages": ["Urdu", "English"],
  "specializations": ["Trekking", "Mountain Tours"],
  "certifications": "string (optional)",
  "profile_photo": "string (Cloudinary URL)",
  "cnic_number": "string",
  "cnic_photo": "string (Cloudinary URL)",
  "hashed_password": "string (bcrypt)",
  "is_verified": false,
  "is_active": true,
  "rating": 0.0,
  "total_bookings": 0,
  "created_at": "datetime"
}
```

---

### Collection: `bookings`
```json
{
  "_id": "ObjectId",
  "guide_id": "string (ObjectId ref)",
  "guide_name": "string",
  "traveler_email": "string",
  "traveler_name": "string",
  "booking_date": "string (YYYY-MM-DD)",
  "duration_days": 1,
  "destination": "string",
  "special_requests": "string (optional)",
  "contact_phone": "string",
  "status": "pending | confirmed | cancelled | completed",
  "created_at": "datetime",
  "updated_at": "datetime (optional)"
}
```

---

### Collection: `guide_reviews`
```json
{
  "_id": "ObjectId",
  "guide_id": "string (ObjectId ref)",
  "traveler_email": "string",
  "traveler_name": "string",
  "rating": 4,
  "comment": "string",
  "guide_reply": "string (optional)",
  "replied_at": "datetime (optional)",
  "booking_id": "string (optional)",
  "created_at": "datetime"
}
```

---

### Collection: `contacts`
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "message": "string",
  "reply": "string (optional, admin reply)",
  "replied_at": "datetime (optional)",
  "created_at": "datetime"
}
```

---

### Collection: `notifications`
```json
{
  "_id": "ObjectId",
  "recipient_email": "string",
  "recipient_type": "traveler | guide | admin",
  "type": "booking_new | booking_confirmed | booking_cancelled | booking_completed | review_received | guide_verified | support_message | system",
  "title": "string",
  "message": "string",
  "link": "string (optional)",
  "metadata": {},
  "is_read": false,
  "created_at": "datetime"
}
```

---

### Collection: `chats`
```json
{
  "_id": "ObjectId",
  "sender_email": "string",
  "receiver_email": "string",
  "sender_name": "string",
  "sender_role": "traveler | guide | admin",
  "message": "string",
  "is_read": false,
  "created_at": "datetime"
}
```

---

## 🔑 Authentication Flow

```
1. User submits login form (email + password)
         ↓
2. Backend verifies credentials against hashed password (bcrypt)
         ↓
3. On success → JWT Access Token generated (expires in 24hrs by default)
         ↓
4. Token stored in localStorage on frontend
         ↓
5. All protected API requests include token in Authorization header:
   Authorization: Bearer <token>
         ↓
6. Backend decodes + validates token on every protected route
         ↓
7. User type (traveler / guide / admin) is embedded in token payload
         ↓
8. Frontend ProtectedRoute component checks user type for role-based access
```

---

## 🧩 Modules Explained

### `AuthContext.jsx`
Global React context that manages the authentication state across the entire app. It stores the logged-in `user` object, `isAuthenticated` flag, `login()` and `logout()` functions. On app load, it restores session from `localStorage`.

### `ProtectedRoute.jsx`
A React wrapper component that guards specific routes. If the user is not authenticated or doesn't have the required role (`allowedRoles`), it redirects them to the appropriate login page. Used in `App.jsx` for all private routes.

### `NotificationContext.jsx`
Manages the global notification state. Fetches unread notifications on login and provides real-time update utilities across the app.

### `Globe3D.jsx`
A Three.js powered 3D rotating globe on the landing page. Built using `@react-three/fiber` and `@react-three/drei`. Displays an interactive visualization of Pakistan's geographical context.

### `BookingForm.jsx`
A reusable modal component for creating bookings. Accepts guide data as props, captures booking date, destination, duration, contact phone, and special requests. Calls the `/api/booking/create` endpoint on submit.

### `GuideRegistration.jsx`
A multi-step form for new guides to register on the platform. Handles profile photo upload, CNIC photo upload via Cloudinary (through `/api/upload/image`), and submits all guide data including specializations and languages as arrays.

### `AdminDashboard.jsx`
The admin control center with tabbed sections for: Platform Stats, Guide Management (with verification controls), Traveler Management, Booking Overview, Reviews, and Support Messages.

---

## 🚀 Running in Development

```bash
# Terminal 1 — Start Backend
cd backend
.\venv\Scripts\activate     # Windows
python main.py

# Terminal 2 — Start Frontend
cd frontend
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend App | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger UI Docs | http://localhost:8000/docs |
| ReDoc API Docs | http://localhost:8000/redoc |
| Health Check | http://localhost:8000/health |

---

## 📝 License

This project was developed as a **Final Year Project (FYP)** for academic purposes.

---

<div align="center">
  <b>Made with ❤️ for Pakistan Tourism 🇵🇰</b>
</div>
