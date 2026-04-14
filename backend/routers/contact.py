from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from database import get_database
from datetime import datetime
from bson import ObjectId
from models import NotificationType
from routers.notification import create_and_send_notification

router = APIRouter(prefix="/api/contact", tags=["Contact"])

# Contact Message Model
class ContactMessage(BaseModel):
    name: str
    email: str
    message: str
    role: str = "guest"  # Added role to distinguish sender

class ReplyMessage(BaseModel):
    reply: str

@router.post("/submit", status_code=status.HTTP_201_CREATED)
async def submit_contact(contact: ContactMessage):
    """Submit a contact message"""
    db = await get_database()
    
    contact_doc = {
        "name": contact.name,
        "email": contact.email,
        "message": contact.message,
        "role": contact.role,
        "is_read": False,
        "reply": None,
        "replied_at": None,
        "created_at": datetime.utcnow()
    }
    
    result = await db.contacts.insert_one(contact_doc)
    
    # Send notification to admin
    await create_and_send_notification(
        recipient_email="admin@travelguide.com",
        recipient_type="admin",
        notif_type=NotificationType.SUPPORT_MESSAGE,
        title=f"New Message from {contact.role.capitalize()}",
        message=f"{contact.name} sent a support inquiry.",
        link="/admin-dashboard"
    )
    
    return {
        "message": "Message sent successfully! We'll get back to you soon.",
        "id": str(result.inserted_id)
    }

@router.get("/all")
async def get_all_messages():
    """Get all contact messages (admin only)"""
    db = await get_database()
    
    messages = await db.contacts.find().sort("created_at", -1).to_list(length=200)
    
    messages_list = []
    for msg in messages:
        messages_list.append({
            "id": str(msg["_id"]),
            "name": msg["name"],
            "email": msg["email"],
            "message": msg["message"],
            "role": msg.get("role", "guest"),
            "is_read": msg.get("is_read", False),
            "reply": msg.get("reply"),
            "replied_at": msg["replied_at"].isoformat() if msg.get("replied_at") else None,
            "created_at": msg["created_at"].isoformat() if msg.get("created_at") else None
        })
    
    unread_count = len([m for m in messages_list if not m["is_read"]])
    
    return {
        "messages": messages_list,
        "total": len(messages_list),
        "unread": unread_count
    }

@router.put("/{message_id}/reply")
async def reply_to_message(message_id: str, reply_data: ReplyMessage):
    """Add a reply to a contact message"""
    db = await get_database()
    
    try:
        result = await db.contacts.update_one(
            {"_id": ObjectId(message_id)},
            {
                "$set": {
                    "reply": reply_data.reply,
                    "replied_at": datetime.utcnow(),
                    "is_read": True
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Message not found")
            
        # Notify the user that admin has replied
        original_msg = await db.contacts.find_one({"_id": ObjectId(message_id)})
        if original_msg:
            await create_and_send_notification(
                recipient_email=original_msg["email"],
                recipient_type=original_msg.get("role", "traveler"),
                notif_type=NotificationType.SUPPORT_MESSAGE,
                title="Admin Response Received",
                message=f"Admin has replied to your inquiry.",
                link=f"/{original_msg.get('role', 'traveler')}-dashboard"
            )
            
        return {"message": "Reply saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{message_id}/read")
async def mark_as_read(message_id: str):
    """Mark a message as read"""
    db = await get_database()
    
    try:
        result = await db.contacts.update_one(
            {"_id": ObjectId(message_id)},
            {"$set": {"is_read": True}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message not found"
            )
        
        return {"message": "Marked as read"}
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID"
        )

@router.delete("/{message_id}")
async def delete_message(message_id: str):
    """Delete a contact message"""
    db = await get_database()
    
    try:
        result = await db.contacts.delete_one({"_id": ObjectId(message_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message not found"
            )
        
        return {"message": "Message deleted"}
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid message ID"
        )

@router.get("/user/{email}")
async def get_user_messages(email: str):
    """Get support messages sent by a specific user"""
    db = await get_database()
    
    messages = await db.contacts.find({"email": email}).sort("created_at", -1).to_list(length=50)
    
    messages_list = []
    for msg in messages:
        messages_list.append({
            "id": str(msg["_id"]),
            "message": msg["message"],
            "reply": msg.get("reply"),
            "replied_at": msg["replied_at"].isoformat() if msg.get("replied_at") else None,
            "created_at": msg["created_at"].isoformat() if msg.get("created_at") else None,
            "is_read": msg.get("is_read", False)
        })
    
    return {"messages": messages_list}
