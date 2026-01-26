from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from database import get_database
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api/contact", tags=["Contact"])

# Contact Message Model
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str

@router.post("/submit", status_code=status.HTTP_201_CREATED)
async def submit_contact(contact: ContactMessage):
    """Submit a contact message"""
    db = await get_database()
    
    contact_doc = {
        "name": contact.name,
        "email": contact.email,
        "message": contact.message,
        "is_read": False,
        "created_at": datetime.utcnow()
    }
    
    result = await db.contacts.insert_one(contact_doc)
    
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
            "is_read": msg.get("is_read", False),
            "created_at": msg["created_at"].isoformat() if msg.get("created_at") else None
        })
    
    unread_count = len([m for m in messages_list if not m["is_read"]])
    
    return {
        "messages": messages_list,
        "total": len(messages_list),
        "unread": unread_count
    }

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
