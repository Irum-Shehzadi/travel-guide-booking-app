from fastapi import APIRouter, HTTPException, status, Depends
from models import ComplaintCreate, ComplaintInDB, ComplaintStatus, NotificationType
from database import get_database
from datetime import datetime, timezone
from bson import ObjectId
from routers.notification import create_and_send_notification

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])

@router.post("/", status_code=status.HTTP_201_CREATED)
async def submit_complaint(complaint: ComplaintCreate):
    """Traveler submits a complaint against a guide"""
    db = await get_database()
    
    # Verify guide exists
    guide = await db.guides.find_one({"_id": ObjectId(complaint.guide_id)})
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    complaint_doc = {
        "guide_id": complaint.guide_id,
        "guide_name": complaint.guide_name,
        "traveler_email": complaint.traveler_email,
        "traveler_name": complaint.traveler_name,
        "destination": complaint.destination,
        "reason": complaint.reason,
        "description": complaint.description,
        "status": ComplaintStatus.PENDING,
        "created_at": datetime.now(timezone.utc)
    }
    
    result = await db.complaints.insert_one(complaint_doc)
    
    # Notify admin
    await create_and_send_notification(
        recipient_email="admin",
        recipient_type="admin",
        notif_type=NotificationType.SUPPORT_MESSAGE,
        title="New Guide Complaint!",
        message=f"Traveler reported guide {complaint.guide_name} for {complaint.reason}.",
        link="/admin/complaints",
        metadata={"complaint_id": str(result.inserted_id)}
    )
    
    return {"message": "Complaint submitted successfully", "complaint_id": str(result.inserted_id)}

@router.get("/my-complaints/{email}")
async def get_traveler_complaints(email: str):
    """Get all complaints submitted by a traveler"""
    db = await get_database()
    complaints = await db.complaints.find({"traveler_email": email}).sort("created_at", -1).to_list(length=100)
    
    for c in complaints:
        c["id"] = str(c["_id"])
        del c["_id"]
        
    return {"complaints": complaints}
