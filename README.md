# Pakistan Travel Guide Booking Platform

A full-stack web application for booking local travel guides across Pakistan. Travelers can explore destinations, book guides, and leave reviews.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Database Schema](#database-schema)

---

## Features

### For Travelers
- Sign up / Login with JWT authentication
- Browse 50+ Pakistan destinations with detailed info
- View real-time weather for any destination
- Search and filter travel guides
- Book guides for trips
- Leave reviews and ratings for guides
- Personal dashboard to manage bookings

### For Guides
- Register with profile photo upload
- Set availability and pricing
- Receive and manage booking requests
- View earnings and reviews
- Personal dashboard

### General
- Contact form for inquiries
- Admin message management
- Protected routes (authentication required)
- Responsive design

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | Python web framework |
| **MongoDB** | Database (NoSQL) |
| **Motor** | Async MongoDB driver |
| **JWT** | Authentication tokens |
| **Pydantic** | Data validation |
| **Cloudinary** | Image uploads |
| **Open-Meteo API** | Weather data |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool |
| **React Router** | Navigation |
| **Tailwind CSS** | Styling |
| **Lucide Icons** | Icon library |
| **Context API** | State management |

---

## Project Structure

```
fyp-1/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # MongoDB connection
│   ├── models.py            # Pydantic models
│   ├── utils.py             # Helper functions (JWT, hashing)
│   ├── routers/
│   │   ├── traveler.py      # Traveler auth & profile
│   │   ├── guide.py         # Guide registration & listing
│   │   ├── booking.py       # Booking management
│   │   ├── review.py        # Reviews & ratings
│   │   ├── contact.py       # Contact form
│   │   ├── upload.py        # Image uploads
│   │   └── weather.py       # Weather API integration
│   └── venv/                # Python virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main app with routes
│   │   ├── main.jsx         # React entry point
│   │   ├── Components/
│   │   │   ├── Pages/
│   │   │   │   ├── TravelerSign.jsx      # Traveler login/signup
│   │   │   │   ├── TravelerDashboard.jsx # Traveler dashboard
│   │   │   │   ├── GuideLogin.jsx        # Guide login
│   │   │   │   ├── GuideRegistration.jsx # Guide signup
│   │   │   │   ├── GuideDashboard.jsx    # Guide dashboard
│   │   │   │   ├── GuideBooking.jsx      # Book a guide
│   │   │   │   ├── PakistanDestination.jsx # Destinations listing
│   │   │   │   ├── Review.jsx            # Review system
│   │   │   │   ├── About.jsx             # About page
│   │   │   │   └── AdminMessages.jsx     # Admin panel
│   │   │   ├── common/
│   │   │   │   └── WeatherWidget.jsx     # Weather display
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   ├── ReviewForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication state
│   │   └── data/
│   │       └── destinations.js  # Pakistan destinations data
│   └── package.json
│
└── README.md
```

---

## Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB (running on localhost:27017)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn motor pydantic python-jose passlib bcrypt python-multipart cloudinary httpx

# Run server
python main.py
```

Backend runs on: **http://localhost:8000**

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## API Endpoints

### Traveler Routes (`/api/traveler`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new traveler |
| POST | `/login` | Login traveler |
| GET | `/profile/{email}` | Get traveler profile |

### Guide Routes (`/api/guide`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new guide |
| POST | `/login` | Login guide |
| GET | `/list` | Get all guides |
| GET | `/{guide_id}` | Get guide details |

### Booking Routes (`/api/booking`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create new booking |
| GET | `/traveler/{email}` | Get traveler's bookings |
| GET | `/guide/{email}` | Get guide's bookings |
| PUT | `/{booking_id}/status` | Update booking status |

### Review Routes (`/api/review`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create review |
| GET | `/guide/{guide_id}` | Get guide reviews |

### Weather Routes (`/api/weather`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{city}` | Get weather for city |
| GET | `/` | List available cities |

### Other Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |
| POST | `/api/upload/image` | Upload image |
| GET | `/docs` | API documentation (Swagger) |

---

## Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero section |
| About | `/about` | About the platform |
| Destinations | `/destinations` | Browse Pakistan destinations |
| Traveler Login | `/traveler-login` | Traveler auth page |
| Traveler Dashboard | `/traveler-dashboard` | Manage bookings |
| Guide Login | `/guide-login` | Guide auth page |
| Guide Register | `/guide-register` | Guide registration |
| Guide Dashboard | `/guide-dashboard` | Manage guide profile |
| Book Guide | `/book-guide/:id` | Book a specific guide |
| Contact | `/contact` | Contact form |

---

## Database Schema

### Collections

**travelers**
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "hashed_password": "string",
  "is_active": "boolean",
  "created_at": "datetime"
}
```

**guides**
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "phone": "string",
  "city": "string",
  "languages": ["string"],
  "experience_years": "number",
  "price_per_day": "number",
  "profile_photo": "string (URL)",
  "bio": "string",
  "specializations": ["string"],
  "is_verified": "boolean"
}
```

**bookings**
```json
{
  "_id": "ObjectId",
  "traveler_email": "string",
  "guide_id": "string",
  "start_date": "date",
  "end_date": "date",
  "status": "pending | confirmed | completed | cancelled",
  "total_price": "number",
  "created_at": "datetime"
}
```

**reviews**
```json
{
  "_id": "ObjectId",
  "guide_id": "string",
  "traveler_email": "string",
  "rating": "number (1-5)",
  "comment": "string",
  "created_at": "datetime"
}
```

---

## Weather Feature

Real-time weather for 40+ Pakistani cities using Open-Meteo API:

**Supported Cities:**
- Punjab: Lahore, Islamabad, Rawalpindi, Multan, Faisalabad...
- Sindh: Karachi, Hyderabad, Sukkur...
- KPK: Peshawar, Swat Valley, Chitral, Naran Kaghan...
- Balochistan: Quetta, Gwadar, Ziarat...
- Gilgit-Baltistan: Hunza Valley, Skardu, Fairy Meadows...
- Azad Kashmir: Muzaffarabad, Neelum Valley...

---

## Development

```bash
# Run backend (from backend folder)
.\venv\Scripts\python main.py

# Run frontend (from frontend folder)  
npm run dev

# View API docs
http://localhost:8000/docs
```

---

## Environment Variables (Optional)

Create `.env` file in backend folder:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=travel_booking
SECRET_KEY=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## License

This project is part of FYP (Final Year Project).

---

**Made for Pakistan Tourism**
