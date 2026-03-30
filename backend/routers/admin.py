from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from database import get_database
from datetime import datetime
from bson import ObjectId
from utils import verify_password, get_password_hash

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# ============ ADMIN CREDENTIALS ============
ADMIN_EMAIL = "admin@travelguide.com"
ADMIN_PASSWORD = "admin123"

class AdminLogin(BaseModel):
    email: str
    password: str

# ============ AUTH ============
@router.post("/login")
async def admin_login(credentials: AdminLogin):
    if credentials.email != ADMIN_EMAIL or credentials.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials")
    return {"message": "Admin login successful", "user": {"name": "Admin", "email": ADMIN_EMAIL, "type": "admin"}}

# ============ DASHBOARD STATS ============
@router.get("/stats")
async def get_dashboard_stats():
    db = await get_database()
    total_travelers = await db.travelers.count_documents({})
    total_guides = await db.guides.count_documents({})
    total_bookings = await db.bookings.count_documents({})
    total_contacts = await db.contacts.count_documents({})
    unread_contacts = await db.contacts.count_documents({"is_read": False})
    pending_bookings = await db.bookings.count_documents({"status": "pending"})
    confirmed_bookings = await db.bookings.count_documents({"status": "confirmed"})
    completed_bookings = await db.bookings.count_documents({"status": "completed"})
    cancelled_bookings = await db.bookings.count_documents({"status": "cancelled"})
    verified_guides = await db.guides.count_documents({"is_verified": True})
    unverified_guides = await db.guides.count_documents({"is_verified": False})
    
    return {
        "travelers": total_travelers, "guides": total_guides, "verified_guides": verified_guides, "unverified_guides": unverified_guides,
        "bookings": {"total": total_bookings, "pending": pending_bookings, "confirmed": confirmed_bookings, "completed": completed_bookings, "cancelled": cancelled_bookings},
        "contacts": {"total": total_contacts, "unread": unread_contacts}
    }

# ============ USERS MANAGEMENT ============
@router.get("/travelers")
async def get_all_travelers():
    db = await get_database()
    travelers = await db.travelers.find().sort("created_at", -1).to_list(length=500)
    return {"travelers": [{"id": str(t["_id"]), "name": t.get("name", "Unknown"), "email": t.get("email", ""), "is_active": t.get("is_active", True), "created_at": t["created_at"].isoformat() if t.get("created_at") else None} for t in travelers]}

@router.get("/guides")
async def get_all_guides_admin():
    db = await get_database()
    guides = await db.guides.find().sort("created_at", -1).to_list(length=500)
    guides_list = []
    for g in guides:
        guide_id = str(g["_id"])
        total_bookings = await db.bookings.count_documents({"guide_id": guide_id})
        pending_bookings = await db.bookings.count_documents({"guide_id": guide_id, "status": "pending"})
        confirmed_bookings = await db.bookings.count_documents({"guide_id": guide_id, "status": "confirmed"})
        guides_list.append({
            "id": guide_id, "fullName": g.get("fullName", "Unknown"), "email": g.get("email", ""), "phone": g.get("phone", ""), "city": g.get("city", ""), 
            "experience": g.get("experience", 0), "languages": g.get("languages", []), "specializations": g.get("specializations", []), "profile_photo": g.get("profile_photo"), 
            "cnic_number": g.get("cnic_number"), "cnic_photo": g.get("cnic_photo"),
            "rating": g.get("rating", 0.0), "total_bookings": total_bookings, "pending_bookings": pending_bookings, "confirmed_bookings": confirmed_bookings, "is_verified": g.get("is_verified", False), "is_active": g.get("is_active", True)
        })
    return {"guides": guides_list}

@router.put("/guide/{guide_id}/verify")
async def verify_guide(guide_id: str):
    db = await get_database()
    guide = await db.guides.find_one({"_id": ObjectId(guide_id)})
    if not guide: raise HTTPException(status_code=404, detail="Guide not found")
    new_status = not guide.get("is_verified", False)
    await db.guides.update_one({"_id": ObjectId(guide_id)}, {"$set": {"is_verified": new_status}})
    return {"message": "Status updated", "is_verified": new_status}

@router.delete("/traveler/{traveler_id}")
async def delete_traveler(traveler_id: str):
    db = await get_database()
    await db.travelers.delete_one({"_id": ObjectId(traveler_id)})
    return {"message": "Deleted"}

@router.delete("/guide/{guide_id}")
async def delete_guide(guide_id: str):
    db = await get_database()
    await db.guides.delete_one({"_id": ObjectId(guide_id)})
    return {"message": "Deleted"}

@router.get("/bookings")
async def get_all_bookings_admin():
    db = await get_database()
    bookings = await db.bookings.find().sort("created_at", -1).to_list(length=500)
    return {"bookings": [{"id": str(b["_id"]), "guide_name": b.get("guide_name", "Unknown"), "traveler_name": b.get("traveler_name", "Unknown"), "destination": b.get("destination", ""), "booking_date": b.get("booking_date", ""), "status": b.get("status", "pending")} for b in bookings]}

@router.delete("/booking/{booking_id}")
async def delete_booking_admin(booking_id: str):
    db = await get_database()
    await db.bookings.delete_one({"_id": ObjectId(booking_id)})
    return {"message": "Deleted"}

@router.delete("/destination_review/{review_id}")
async def delete_destination_review_admin(review_id: str):
    db = await get_database()
    result = await db.destination_reviews.delete_one({"_id": ObjectId(review_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Deleted"}
