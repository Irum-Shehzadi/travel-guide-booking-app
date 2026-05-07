from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from database import get_database
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from utils import verify_password, get_password_hash
from models import NotificationType
from routers.notification import create_and_send_notification

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
    
    # Run counts in parallel or via aggregation
    travelers_count = db.travelers.count_documents({})
    guides_count = db.guides.count_documents({})
    contacts_count = db.contacts.count_documents({})
    unread_contacts = db.contacts.count_documents({"is_read": False})
    
    # Booking stats via aggregation (Faster)
    booking_stats_pipeline = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    booking_counts = await db.bookings.aggregate(booking_stats_pipeline).to_list(length=100)
    
    # Guide verification stats
    guide_verify_pipeline = [
        {"$group": {"_id": "$is_verified", "count": {"$sum": 1}}}
    ]
    guide_counts = await db.guides.aggregate(guide_verify_pipeline).to_list(length=100)

    # Process results
    b_stats = {item["_id"]: item["count"] for item in booking_counts}
    g_stats = {str(item["_id"]): item["count"] for item in guide_counts}

    total_travelers = await travelers_count
    total_guides = await guides_count
    total_contacts = await contacts_count
    unread_contacts_count = await unread_contacts

    return {
        "travelers": total_travelers, 
        "guides": total_guides, 
        "verified_guides": g_stats.get("True", 0), 
        "unverified_guides": g_stats.get("False", 0),
        "bookings": {
            "total": sum(b_stats.values()), 
            "pending": b_stats.get("pending", 0), 
            "confirmed": b_stats.get("confirmed", 0), 
            "completed": b_stats.get("completed", 0), 
            "cancelled": b_stats.get("cancelled", 0)
        },
        "contacts": {"total": total_contacts, "unread": unread_contacts_count}
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

# ============ COMPLAINT MANAGEMENT ============

@router.get("/complaints")
async def get_all_complaints():
    db = await get_database()
    complaints = await db.complaints.find().sort("created_at", -1).to_list(length=500)
    for c in complaints:
        c["id"] = str(c["_id"])
        del c["_id"]
    return {"complaints": complaints}

@router.put("/complaint/{complaint_id}/action")
async def take_complaint_action(complaint_id: str, data: dict):
    """
    Action can be: 'warn', 'block_week', 'permanent_block', 'dismiss'
    """
    db = await get_database()
    action = data.get("action")
    admin_note = data.get("admin_note", "")
    
    complaint = await db.complaints.find_one({"_id": ObjectId(complaint_id)})
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    guide_id = complaint["guide_id"]
    guide = await db.guides.find_one({"_id": ObjectId(guide_id)})
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
        
    now = datetime.now(timezone.utc)
    guide_update = {"$inc": {"report_count": 1}} if action != 'dismiss' else {}
    complaint_status = "pending"
    
    if action == "warn":
        complaint_status = "warned"
        await create_and_send_notification(
            recipient_email=guide["email"],
            recipient_type="guide",
            notif_type=NotificationType.SYSTEM,
            title="Account Warning!",
            message=f"You have received a formal warning due to a traveler report: {admin_note}",
            link="/guide/profile"
        )
    
    elif action == "block_week":
        complaint_status = "blocked"
        blocked_until = now + timedelta(days=7)
        guide_update["$set"] = {
            "is_blocked": True,
            "blocked_until": blocked_until
        }
        await create_and_send_notification(
            recipient_email=guide["email"],
            recipient_type="guide",
            notif_type=NotificationType.SYSTEM,
            title="Account Blocked (1 Week)",
            message=f"Your account has been suspended for 7 days. Reason: {admin_note}",
            link="/login"
        )
        
    elif action == "permanent_block":
        complaint_status = "permanent"
        guide_update["$set"] = {
            "is_permanently_blocked": True,
            "is_active": False
        }
        await create_and_send_notification(
            recipient_email=guide["email"],
            recipient_type="guide",
            notif_type=NotificationType.SYSTEM,
            title="Account Permanently Blocked",
            message=f"Your account has been permanently deactivated due to multiple policy violations. CNIC: {guide.get('cnic_number')}",
            link="/contact"
        )
        
    elif action == "dismiss":
        complaint_status = "dismissed"
    
    # Update Guide
    if guide_update:
        await db.guides.update_one({"_id": ObjectId(guide_id)}, guide_update)
        
    # Update complaint status
    status_map = {
        "warn": "warned",
        "block_week": "blocked",
        "permanent_block": "permanent",
        "dismiss": "dismissed"
    }
    
    complaint_status = status_map.get(action, action)
    await db.complaints.update_one(
        {"_id": ObjectId(complaint_id)},
        {"$set": {
            "status": complaint_status,
            "admin_note": admin_note,
            "resolved_at": now
        }}
    )
    
    return {"message": f"Action '{action}' taken successfully", "status": complaint_status}
