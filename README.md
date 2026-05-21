# 🏔️ TravelGuide Pakistan

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WebSockets](https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

> **Final Year Project (FYP)**  
> A complete, fully-functional web platform connecting travelers with verified local tour guides across Pakistan.

</div>

---

## 📖 What is TravelGuide Pakistan?

**TravelGuide Pakistan** is a modern Web Application that makes traveling in Pakistan easier and safer. 
Instead of searching for guides randomly, travelers can use this platform to explore beautiful destinations, check live weather, and book trusted, verified local guides. 

**Main Purpose:** To provide a secure ecosystem where Guides can earn money professionally and Travelers can enjoy their trips without worries.

---

## ✨ Core Features (Easily Explained)

### 1. 🧍 For Travelers (Tourists)
- **Explore Pakistan:** View 50+ beautiful destinations with high-quality images and details.
- **Live Weather Updates:** Check the real-time weather of any city before booking using our live API widget.
- **Find & Book a Guide:** Search guides by city or skills (e.g., Hiking, History) and send a booking request.
- **Leave Reviews:** Rate guides and destinations out of 5 stars after a trip.
- **Report & Complain:** If a guide misbehaves, submit an official complaint directly to the Admin.
- **Real-Time Live Chat:** Chat instantly with the platform Admin for help (no page refresh needed!).

### 2. 🧭 For Tour Guides
- **Professional Dashboard:** A dedicated screen showing total earnings, pending bookings, and ratings.
- **Secure Registration:** Guides must upload their **CNIC** (ID Card) for security. They cannot get bookings until the Admin manually verifies them.
- **Manage Trips:** Easily Accept, Decline, or Complete booking requests.
- **Reply to Reviews:** Professionally respond to feedback left by travelers.

### 3. 🛡️ For the Admin (Management)
- **Master Dashboard:** See total registered users, guides, and platform bookings at a glance.
- **Guide Verification:** View uploaded CNICs and click "Approve" or "Reject" to keep the platform safe.
- **Complaint & Blocking System:** Admins can take action on complaints by sending a **Warning**, **Blocking a guide for 7 days**, or **Permanently Banning** them.
- **Live Support Hub:** Chat live with multiple travelers and guides simultaneously to resolve their issues.

---

## 💻 Tech Stack (What we used & Why)

| Technology | Why we used it |
|------------|----------------|
| **FastAPI (Python)** | Used for the Backend. It handles all logic and API requests super fast. |
| **MongoDB** | Our NoSQL Database. Stores all users, bookings, complaints, and chat history safely. |
| **React + Vite** | Used for the Frontend UI. Vite makes the website load instantly. |
| **Tailwind CSS** | Gives our website its beautiful, modern "Obsidian Dark" theme and styling. |
| **WebSockets** | Enables the "Live Chat" feature so messages appear instantly in real-time. |
| **Cloudinary** | Cloud storage used to safely save all uploaded Profile Photos and CNIC images. |
| **Three.js** | Used to build the interactive 3D rotating Globe on the home page. |

---

## 🚀 How to Run the Project (Step-by-Step)

Follow these exact steps to run the application on your local machine.

### Step 1: Start the Backend (API)
1. Open your terminal and go into the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python Virtual Environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate      # For Windows
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file inside the `backend` folder and add your secure keys:
   ```env
   MONGODB_URL=mongodb://localhost:27017
   DATABASE_NAME=travel_booking
   SECRET_KEY=my_super_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```
5. Run the server:
   ```bash
   python main.py
   ```
   *Your backend is now live at `http://localhost:8000`*

### Step 2: Start the Frontend (Website)
1. Open a **new** terminal and go into the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the React packages:
   ```bash
   npm install
   ```
3. Start the website:
   ```bash
   npm run dev
   ```
   *Your frontend is now live at `http://localhost:5173`*

---

## 🗄️ Database Structure

We use **MongoDB**. Here are the main tables (collections) we created:
- `travelers` - Stores tourist accounts and secure passwords.
- `guides` - Stores guide profiles, verification status, and block/warning flags.
- `bookings` - Stores all trip requests and their status (Pending/Confirmed).
- `complaints` - Stores reports submitted by travelers against guides.
- `chat_messages` - Stores all Live Chat conversations.
- `guide_reviews` & `destination_reviews` - Stores star ratings and comments.

---

## 🌐 API Endpoints Reference

If you want to view all the APIs directly, open your browser and go to:
👉 **http://localhost:8000/docs** (Swagger UI)

Some major APIs include:
- `POST /api/traveler/signup`
- `POST /api/booking/create`
- `POST /api/complaints/`
- `WS /api/chat/ws/{email}` (WebSocket for Live Chat)

---
<div align="center">
  <b>Built for FYP Thesis Defense</b><br>
  <b>Made with ❤️ for Pakistan Tourism 🇵🇰</b>
</div>
