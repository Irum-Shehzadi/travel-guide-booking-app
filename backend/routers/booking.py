from fastapi import APIRouter, HTTPException, status
from models import BookingCreate, BookingUpdate, BookingStatus, NotificationType
from database import get_database
from datetime import datetime
from bson import ObjectId
from routers.notification import create_and_send_notification

router = APIRouter(prefix="/api/booking", tags=["Booking"])

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_booking(booking: BookingCreate):
    """Create a new booking"""
    db = await get_database()
    
    # Verify guide exists
    try:
        guide = await db.guides.find_one({"_id": ObjectId(booking.guide_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid guide ID"
        )
    
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guide not found"
        )
    
    if not guide.get("is_verified", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Guide is not verified yet"
        )

    # Check for date clash (Already Confirmed)
    existing_clash = await db.bookings.find_one({
        "guide_id": booking.guide_id,
        "booking_date": booking.booking_date,
        "status": BookingStatus.CONFIRMED.value
    })

    if existing_clash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Guide is already booked and confirmed for {booking.booking_date}. Please choose another date."
        )
    
    # Create booking document
    booking_doc = {
        "guide_id": booking.guide_id,
        "guide_name": guide["fullName"],
        "traveler_email": booking.traveler_email,
        "traveler_name": booking.traveler_name,
        "booking_date": booking.booking_date,
        "duration_days": booking.duration_days,
        "destination": booking.destination,
        "special_requests": booking.special_requests,
        "contact_phone": booking.contact_phone,
        "status": BookingStatus.PENDING.value,
        "created_at": datetime.utcnow(),
        "updated_at": None
    }
    
    # Insert into database
    result = await db.bookings.insert_one(booking_doc)
    
    # Update guide's total bookings count
    await db.guides.update_one(
        {"_id": ObjectId(booking.guide_id)},
        {"$inc": {"total_bookings": 1}}
    )

    # Send real-time notification to guide
    await create_and_send_notification(
        recipient_email=guide["email"],
        recipient_type="guide",
        notif_type=NotificationType.BOOKING_NEW,
        title="New Booking Request!",
        message=f"{booking.traveler_name} wants to book you for {booking.destination} on {booking.booking_date}.",
        link="/guide-dashboard",
        metadata={"booking_id": str(result.inserted_id), "traveler_name": booking.traveler_name, "destination": booking.destination}
    )
    
    # Send notification to admin
    await create_and_send_notification(
        recipient_email="admin",
        recipient_type="admin",
        notif_type=NotificationType.BOOKING_NEW,
        title="New Booking Created",
        message=f"{booking.traveler_name} booked guide {guide['fullName']} for {booking.destination}.",
        link="/admin/bookings",
        metadata={"booking_id": str(result.inserted_id)}
    )
    
    return {
        "message": "Booking created successfully",
        "booking": {
            "id": str(result.inserted_id),
            "guide_name": guide["fullName"],
            "booking_date": booking.booking_date,
            "destination": booking.destination,
            "status": BookingStatus.PENDING.value
        }
    }

@router.get("/traveler/{email}")
async def get_traveler_bookings(email: str):
    """Get all bookings for a traveler"""
    db = await get_database()
    
    bookings = await db.bookings.find({"traveler_email": email}).sort("created_at", -1).to_list(length=100)
    
    bookings_list = []
    for booking in bookings:
        # Count how many times this traveler has booked THIS specific guide
        repeat_count = await db.bookings.count_documents({
            "traveler_email": email,
            "guide_id": booking["guide_id"]
        })

        bookings_list.append({
            "id": str(booking["_id"]),
            "guide_id": booking["guide_id"],
            "guide_name": booking["guide_name"],
            "booking_date": booking["booking_date"],
            "duration_days": booking.get("duration_days", 1),
            "destination": booking["destination"],
            "special_requests": booking.get("special_requests", ""),
            "contact_phone": booking.get("contact_phone", ""),
            "status": booking["status"],
            "created_at": booking["created_at"].isoformat() if booking.get("created_at") else None,
            "traveler_booking_count": repeat_count # Important logic here
        })
    
    return {"bookings": bookings_list, "total": len(bookings_list)}

@router.get("/guide/{guide_id}")
async def get_guide_bookings(guide_id: str):
    """Get all bookings for a guide"""
    db = await get_database()
    
    try:
        # Verify guide exists
        guide = await db.guides.find_one({"_id": ObjectId(guide_id)})
        if not guide:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Guide not found"
            )
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid guide ID"
        )
    
    bookings = await db.bookings.find({"guide_id": guide_id}).sort("created_at", -1).to_list(length=100)
    
    bookings_list = []
    for booking in bookings:
        # Count how many times this specific traveler has booked this guide
        traveler_repeat_count = await db.bookings.count_documents({
            "guide_id": guide_id,
            "traveler_email": booking["traveler_email"]
        })

        bookings_list.append({
            "id": str(booking["_id"]),
            "traveler_name": booking["traveler_name"],
            "traveler_email": booking["traveler_email"],
            "booking_date": booking["booking_date"],
            "duration_days": booking.get("duration_days", 1),
            "destination": booking["destination"],
            "special_requests": booking.get("special_requests", ""),
            "contact_phone": booking.get("contact_phone", ""),
            "status": booking["status"],
            "created_at": booking["created_at"].isoformat() if booking.get("created_at") else None,
            "traveler_booking_count_for_guide": traveler_repeat_count # Feature requirement
        })
    
    return {"bookings": bookings_list, "total": len(bookings_list)}

@router.get("/guide-email/{email}")
async def get_guide_bookings_by_email(email: str):
    """Get all bookings for a guide by email"""
    db = await get_database()
    
    # Find guide by email first
    guide = await db.guides.find_one({"email": email})
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guide user not found"
        )
    
    guide_id = str(guide["_id"])
    
    bookings = await db.bookings.find({"guide_id": guide_id}).sort("created_at", -1).to_list(length=100)
    
    bookings_list = []
    for booking in bookings:
        # Count how many times this specific traveler has booked this guide
        traveler_repeat_count = await db.bookings.count_documents({
            "guide_id": guide_id,
            "traveler_email": booking["traveler_email"]
        })

        bookings_list.append({
            "id": str(booking["_id"]),
            "traveler_name": booking["traveler_name"],
            "traveler_email": booking["traveler_email"],
            "booking_date": booking["booking_date"],
            "duration_days": booking.get("duration_days", 1),
            "destination": booking["destination"],
            "special_requests": booking.get("special_requests", ""),
            "contact_phone": booking.get("contact_phone", ""),
            "status": booking["status"],
            "created_at": booking["created_at"].isoformat() if booking.get("created_at") else None,
            "traveler_booking_count_for_guide": traveler_repeat_count
        })
    
    return {"bookings": bookings_list, "total": len(bookings_list)}

@router.put("/{booking_id}/status")
async def update_booking_status(booking_id: str, update: BookingUpdate):
    """Update booking status (confirm, cancel, complete)"""
    db = await get_database()
    
    try:
        booking = await db.bookings.find_one({"_id": ObjectId(booking_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID"
        )
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # If updating to CONFIRMED, check if another booking is already confirmed for that date
    if update.status == BookingStatus.CONFIRMED:
        clash = await db.bookings.find_one({
            "_id": {"$ne": ObjectId(booking_id)}, # Don't check current booking
            "guide_id": booking["guide_id"],
            "booking_date": booking["booking_date"],
            "status": BookingStatus.CONFIRMED.value
        })

        if clash:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot confirm. Guide already has another confirmed booking on {booking['booking_date']}."
            )
    
    # Update the booking status
    result = await db.bookings.update_one(
        {"_id": ObjectId(booking_id)},
        {
            "$set": {
                "status": update.status.value,
                "updated_at": datetime.utcnow()
            }
        }
    )

    # Send real-time notification to the traveler
    status_messages = {
        BookingStatus.CONFIRMED: ("Booking Confirmed! ✅", f"Your booking for {booking['destination']} with {booking['guide_name']} has been confirmed!"),
        BookingStatus.CANCELLED: ("Booking Cancelled ❌", f"Your booking for {booking['destination']} with {booking['guide_name']} has been cancelled."),
        BookingStatus.COMPLETED: ("Trip Completed! 🎉", f"Your trip to {booking['destination']} with {booking['guide_name']} is marked as completed. Leave a review!"),
    }

    if update.status in status_messages:
        title, message = status_messages[update.status]
        notif_type_map = {
            BookingStatus.CONFIRMED: NotificationType.BOOKING_CONFIRMED,
            BookingStatus.CANCELLED: NotificationType.BOOKING_CANCELLED,
            BookingStatus.COMPLETED: NotificationType.BOOKING_COMPLETED,
        }
        await create_and_send_notification(
            recipient_email=booking["traveler_email"],
            recipient_type="traveler",
            notif_type=notif_type_map[update.status],
            title=title,
            message=message,
            link="/traveler-dashboard",
            metadata={"booking_id": booking_id, "guide_name": booking["guide_name"], "destination": booking["destination"]}
        )
        
        # Also notify the admin
        admin_message = f"Booking for {booking['destination']} by {booking['traveler_name']} with {booking['guide_name']} is now {update.status.value}."
        await create_and_send_notification(
            recipient_email="admin",
            recipient_type="admin",
            notif_type=notif_type_map[update.status],
            title=f"Booking {update.status.value.capitalize()}",
            message=admin_message,
            link="/admin/bookings",
            metadata={"booking_id": booking_id}
        )
    
    return {
        "message": f"Booking status updated to {update.status.value}",
        "booking_id": booking_id,
        "new_status": update.status.value
    }

@router.get("/{booking_id}")
async def get_booking_details(booking_id: str):
    """Get booking details by ID"""
    db = await get_database()
    
    try:
        booking = await db.bookings.find_one({"_id": ObjectId(booking_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID"
        )
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    return {
        "id": str(booking["_id"]),
        "guide_id": booking["guide_id"],
        "guide_name": booking["guide_name"],
        "traveler_name": booking["traveler_name"],
        "traveler_email": booking["traveler_email"],
        "booking_date": booking["booking_date"],
        "duration_days": booking.get("duration_days", 1),
        "destination": booking["destination"],
        "special_requests": booking.get("special_requests", ""),
        "contact_phone": booking.get("contact_phone", ""),
        "status": booking["status"],
        "created_at": booking["created_at"].isoformat() if booking.get("created_at") else None,
        "updated_at": booking["updated_at"].isoformat() if booking.get("updated_at") else None
    }

@router.delete("/{booking_id}")
async def cancel_booking(booking_id: str):
    """Cancel/delete a booking"""
    db = await get_database()
    
    try:
        booking = await db.bookings.find_one({"_id": ObjectId(booking_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID"
        )
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Update status to cancelled instead of deleting
    await db.bookings.update_one(
        {"_id": ObjectId(booking_id)},
        {
            "$set": {
                "status": BookingStatus.CANCELLED.value,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Booking cancelled successfully", "booking_id": booking_id}
