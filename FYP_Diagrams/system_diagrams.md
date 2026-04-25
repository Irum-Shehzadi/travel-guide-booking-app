# TravelGuide Pakistan - System Diagrams

Here are the standard UML and System Design diagrams for your FYP report based on the TravelGuide Pakistan system architecture. These use standard Mermaid.js syntax.

## 1. System Architecture Diagram
This diagram shows how different components of your stack (Frontend, Backend, Database, and 3rd party APIs) communicate with each other.

```mermaid
flowchart TB
    Client["Client / User\n(Traveler, Guide, Admin)"]

    subgraph Frontend["Frontend Application - React & Vite"]
        ReactUI["React Components / UI"]
        Context["Context API\n(Auth & Notifications)"]
        ThreeJS["Three.js / R3F\n(Interactive Globe)"]
        Axios["API Client\n(Fetch / Axios)"]
    end

    subgraph Backend["Backend API - FastAPI"]
        Router["API Routers\n(traveler, guide, booking, etc.)"]
        Auth["JWT Security Middleware"]
        Controllers["Business Logic / Services"]
        DBDriver["Motor Async DB Driver"]
    end

    subgraph Storage["Databases & Storage"]
        MongoDB[("MongoDB\ntravel_booking Db")]
        Cloudinary[("Cloudinary CDN\nImage Storage")]
    end

    subgraph External["External APIs"]
        OpenMeteo["Open-Meteo\nWeather API"]
    end

    Client -->|HTTP/HTTPS| ReactUI
    ReactUI --- Context
    ReactUI --- ThreeJS
    ReactUI --> Axios
    
    Axios -->|REST API Requests| Router
    Router --> Auth
    Auth --> Controllers
    Controllers --> DBDriver
    DBDriver --> MongoDB
    
    Controllers -.->|"Upload Images"| Cloudinary
    Controllers -.->|"Fetch Weather"| OpenMeteo
```

---

## 2. Entity Relationship Diagram (ERD)
This represents the underlying MongoDB NoSQL schema of your application and references between collections.

```mermaid
erDiagram
    TRAVELER {
        ObjectId _id PK
        string name
        string email
        string hashed_password
        boolean is_active
        datetime created_at
    }

    GUIDE {
        ObjectId _id PK
        string fullName
        string email
        string phone
        string city
        integer experience
        array languages
        array specializations
        boolean is_verified
        boolean is_active
        float rating
        integer total_bookings
    }

    BOOKING {
        ObjectId _id PK
        ObjectId guide_id FK
        string traveler_email FK
        date booking_date
        integer duration_days
        string destination
        string status
        datetime created_at
    }

    GUIDE_REVIEW {
        ObjectId _id PK
        ObjectId guide_id FK
        string traveler_email FK
        integer rating
        string comment
        string guide_reply
    }

    NOTIFICATION {
        ObjectId _id PK
        string recipient_email FK
        string recipient_type
        string type
        string title
        boolean is_read
    }

    CHAT {
        ObjectId _id PK
        string sender_email FK
        string receiver_email FK
        string sender_role
        string message
        boolean is_read
    }

    TRAVELER ||--o{ BOOKING : requests
    GUIDE ||--o{ BOOKING : receives
    TRAVELER ||--o{ GUIDE_REVIEW : writes
    GUIDE ||--o{ GUIDE_REVIEW : receives
    TRAVELER ||--o{ NOTIFICATION : gets
    GUIDE ||--o{ NOTIFICATION : gets
    TRAVELER ||--o{ CHAT : sends_and_receives
    GUIDE ||--o{ CHAT : sends_and_receives
```

---

## 3. Use Case Diagram
This identifies the actors and the specific functionalities they have access to within the system.

```mermaid
flowchart LR
    Traveler(("Traveler"))
    Guide(("Guide"))
    Admin(("Admin"))

    subgraph System["TravelGuide Platform"]
        UC1("Signup & Login via JWT")
        UC2("Search Guides & Destinations")
        UC3("Book a Guide")
        UC4("Manage Bookings")
        UC5("View & Reply to Reviews")
        UC6("Write Reviews")
        UC7("Chat / Support Box")

        UC8("Submit Guide Registration")
        UC9("Manage Guide Profile")
        
        UC10("Verify/Reject Guides")
        UC11("View System Stats & Users")
        UC12("Manage Platform Support")
    end

    Traveler --> UC1
    Traveler --> UC2
    Traveler --> UC3
    Traveler --> UC4
    Traveler --> UC6
    Traveler --> UC7

    Guide --> UC8
    Guide --> UC1
    Guide --> UC9
    Guide --> UC4
    Guide --> UC5
    Guide --> UC7

    Admin --> UC1
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
```

---

## 4. Sequence Diagram: Booking Process
This illustrates the step-by-step process of how a Traveler books a verified Guide.

```mermaid
sequenceDiagram
    actor Traveler
    participant Frontend as React Frontend
    participant Backend as FastAPI App
    participant DB as MongoDB
    actor Guide

    Traveler->>Frontend: Select Guide, Date, Destination & Submits Booking
    Frontend->>Backend: POST /api/booking/create (with JWT Token)
    Backend->>Backend: Validate JWT & User Data
    
    Backend->>DB: Insert into bookings (Status: pending)
    DB-->>Backend: Booking Created Document
    
    Backend->>DB: Insert Notification for Guide
    DB-->>Backend: Notification Created
    
    Backend-->>Frontend: 201 Success Response (Booking Details)
    Frontend-->>Traveler: Show Confirmation UI
    
    Backend--)Guide: Real-time In-App Notification appears
    Guide->>Frontend: Views Pending Booking Requests
    Frontend->>Backend: GET /api/booking/guide-email/email
    Backend->>DB: Fetch bookings
    DB-->>Backend: Return list
    Backend-->>Frontend: 200 OK
    
    Guide->>Frontend: Clicks Accept Booking
    Frontend->>Backend: PUT /api/booking/booking_id/status
    Backend->>DB: Update status to confirmed
    Backend->>DB: Insert Notification for Traveler
    Backend-->>Frontend: 200 OK Updated
    Frontend-->>Guide: Updated status shown on dashboard
```

---

## 5. Activity Diagram / User Authentication Flow
This captures the primary flow and decision points when users enter the application.

```mermaid
flowchart TD
    Start(["User Visits Application"]) --> Choice{"Action?"}
    
    Choice -->|"Login"| LoginF["Enter Credentials"]
    LoginF --> LoginSub["Submit to Login API"]
    LoginSub --> AuthCheck{"Valid Email & Pass?"}
    AuthCheck -->|"No"| Reject["Show Validation Error"]
    Reject --> LoginF
    AuthCheck -->|"Yes"| Valid["Generate JWT Token"]
    Valid --> SaveToken["Save to LocalStorage/Context"]
    SaveToken --> RoleCheck{"Check JWT Payload Role"}
    
    RoleCheck -->|"Traveler"| TDash["Redirect to Traveler Dashboard"]
    RoleCheck -->|"Guide"| Gash["Redirect to Guide Dashboard"]
    RoleCheck -->|"Admin"| Adash["Redirect to Admin Dashboard"]
    
    Choice -->|"Traveler Signup"| TReg["Submit Name, Email, Password"]
    TReg --> TSave["Save Traveler DB"]
    TSave --> LoginF
    
    Choice -->|"Guide Registration"| GReg["Fill Profile Details"]
    GReg --> GFiles["Upload Photo & CNIC to Cloudinary"]
    GFiles --> GSave["Save Guide DB as Unverified"]
    GSave --> GWait["Wait for Admin Approval"]
    
    GWait -.-> AdminVerifies["Admin Verifies Account"]
    AdminVerifies -.-> LoginF
```
