# Data Flow Diagrams (DFD) & Individual Use Cases

## 1. DFD Level 0 (Context Diagram)
This shows the entire system as a single process interacting with external entities (Traveler, Guide, Admin, and External APIs).

```mermaid
flowchart TD
    Traveler(["Traveler"])
    Guide(["Guide"])
    Admin(["Admin"])
    ExternalAPI(["Open-Meteo & Cloudinary APIs"])

    System(("TravelGuide\nPlatform"))

    Traveler --"Requests Booking / Reviews"--> System
    System --"Shows Destinations / Guides"--> Traveler

    Guide --"Submits Profile / Accepts Bookings"--> System
    System --"Assigns Bookings / Notifications"--> Guide

    Admin --"Verification / Moderation Data"--> System
    System --"Stats & User Insights"--> Admin

    System --"Requests Weather & Images"--> ExternalAPI
    ExternalAPI --"Returns Data & CDN Links"--> System
```

## 2. DFD Level 1 (Main Processes Diagram)
This breaks down the system into its primary processes (User Auth, Booking Processing, Review System) and shows how data flows into the Databases.

```mermaid
flowchart LR
    Traveler(["Traveler"])
    Guide(["Guide"])
    Admin(["Admin"])
    
    DB_Users[("D1: Users DB")]
    DB_Bookings[("D2: Bookings DB")]
    DB_Reviews[("D3: Reviews DB")]

    P1(("1. User\nAuth & Profile"))
    P2(("2. Booking\nProcessing"))
    P3(("3. Review &\nRating System"))

    Traveler --"Signup/Login Info"--> P1
    Guide --"Registration Docs"--> P1
    P1 --"Store User Data"--> DB_Users
    DB_Users --"Auth Result"--> P1
    Admin --"Verify Guides"--> P1

    Traveler --"Booking Request"--> P2
    P2 --"Store Booking"--> DB_Bookings
    DB_Bookings --"Fetch Bookings"--> P2
    P2 --"Notify Request"--> Guide
    Guide --"Accept/Decline"--> P2

    Traveler --"Submit Rating/Comment"--> P3
    P3 --"Save Review"--> DB_Reviews
    DB_Reviews --"Fetch Guide Reviews"--> P3
    P3 --"Show Feedback"--> Guide
    Admin --"Moderate Reviews"--> P3
```

---

## 3. Traveler Use Case Diagram
This isolates the functionalities specifically available to the Traveler.

```mermaid
flowchart LR
    Traveler(("Traveler"))

    subgraph System["TravelGuide System"]
        T1("Signup & Login")
        T2("Browse Destinations")
        T3("Check Weather")
        T4("Search Guides by City/Specialization")
        T5("Book a Guide")
        T6("View Booking History")
        T7("Submit Reviews to Completed Bookings")
        T8("Contact Admin Support")
    end

    Traveler --> T1
    Traveler --> T2
    Traveler --> T3
    Traveler --> T4
    Traveler --> T5
    Traveler --> T6
    Traveler --> T7
    Traveler --> T8
```

## 4. Guide Use Case Diagram
This focuses strictly on what the Guide can accomplish in the system.

```mermaid
flowchart LR
    Guide(("Guide"))

    subgraph System["TravelGuide System"]
        G1("Register with CNIC & Photo")
        G2("Login via JWT")
        G3("Manage Own Profile & Specializations")
        G4("View Pending Booking Requests")
        G5("Accept/Decline Bookings")
        G6("View Total Earnings/Bookings Stats")
        G7("Read & Reply to Traveler Reviews")
        G8("Message Admin Support")
    end

    Guide --> G1
    Guide --> G2
    Guide --> G3
    Guide --> G4
    Guide --> G5
    Guide --> G6
    Guide --> G7
    Guide --> G8
```

## 5. Admin Use Case Diagram
This demonstrates the administrative capabilities and moderation tools.

```mermaid
flowchart LR
    Admin(("Admin"))

    subgraph System["TravelGuide System"]
        A1("Admin Login")
        A2("View Platform Statistics")
        A3("Review Guide Registrations")
        A4("Approve or Reject Unverified Guides")
        A5("Manage Traveler Accounts")
        A6("Monitor All Platform Bookings")
        A7("Moderate Platform Reviews")
        A8("Reply to Support Tickets/Messages")
    end

    Admin --> A1
    Admin --> A2
    Admin --> A3
    Admin --> A4
    Admin --> A5
    Admin --> A6
    Admin --> A7
    Admin --> A8
```
