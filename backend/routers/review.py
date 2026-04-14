from fastapi import APIRouter, HTTPException, status
from models import ReviewCreate, DestinationReviewCreate, ReviewReply, NotificationType
from database import get_database
from datetime import datetime
from bson import ObjectId
from routers.notification import create_and_send_notification

router = APIRouter(prefix="/api/review", tags=["Review"])

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_review(review: ReviewCreate):
    """Create a new review for a guide"""
    db = await get_database()
    
    # Verify guide exists
    try:
        guide = await db.guides.find_one({"_id": ObjectId(review.guide_id)})
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
    
    # Check if booking exists (optional - only allow reviews for completed bookings)
    if review.booking_id:
        try:
            booking = await db.bookings.find_one({"_id": ObjectId(review.booking_id)})
            if not booking:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Booking not found"
                )
        except:
            pass  # Allow review even without valid booking ID
    
    # Check if user already reviewed this booking
    if review.booking_id:
        existing_review = await db.guide_reviews.find_one({
            "booking_id": review.booking_id,
            "traveler_email": review.traveler_email
        })
        
        if existing_review:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already reviewed this booking"
            )
    
    # Create review document
    review_doc = {
        "guide_id": review.guide_id,
        "guide_name": guide["fullName"],
        "traveler_email": review.traveler_email,
        "traveler_name": review.traveler_name,
        "rating": review.rating,
        "comment": review.comment,
        "booking_id": review.booking_id,
        "created_at": datetime.utcnow()
    }
    
    # Insert into database
    result = await db.guide_reviews.insert_one(review_doc)
    
    # Update guide's average rating
    all_reviews = await db.guide_reviews.find({"guide_id": review.guide_id}).to_list(length=1000)
    if all_reviews:
        avg_rating = sum(r["rating"] for r in all_reviews) / len(all_reviews)
        await db.guides.update_one(
            {"_id": ObjectId(review.guide_id)},
            {"$set": {"rating": round(avg_rating, 1)}}
        )

    # Notify the guide about new review
    star_text = "⭐" * review.rating
    await create_and_send_notification(
        recipient_email=guide["email"],
        recipient_type="guide",
        notif_type=NotificationType.REVIEW_RECEIVED,
        title=f"New Review {star_text}",
        message=f"{review.traveler_name} left a {review.rating}-star review: \"{review.comment[:60]}...\"",
        link="/guide-dashboard",
        metadata={"review_id": str(result.inserted_id), "rating": review.rating}
    )
    
    return {
        "message": "Review submitted successfully",
        "review": {
            "id": str(result.inserted_id),
            "guide_name": guide["fullName"],
            "rating": review.rating,
            "comment": review.comment
        }
    }

@router.get("/guide/{guide_id}")
async def get_guide_reviews(guide_id: str):
    """Get all reviews for a specific guide"""
    db = await get_database()
    
    reviews = await db.guide_reviews.find({"guide_id": guide_id}).sort("created_at", -1).to_list(length=100)
    
    reviews_list = []
    for review in reviews:
        reviews_list.append({
            "id": str(review["_id"]),
            "traveler_name": review["traveler_name"],
            "rating": review["rating"],
            "comment": review["comment"],
            "guide_reply": review.get("guide_reply"),
            "replied_at": review.get("replied_at").isoformat() if review.get("replied_at") else None,
            "created_at": review["created_at"].isoformat() if review.get("created_at") else None
        })
    
    # Calculate average rating
    avg_rating = 0
    if reviews_list:
        avg_rating = sum(r["rating"] for r in reviews_list) / len(reviews_list)
    
    return {
        "reviews": reviews_list,
        "total": len(reviews_list),
        "average_rating": round(avg_rating, 1)
    }

@router.get("/all")
async def get_all_reviews():
    """Get all reviews (for the reviews page)"""
    db = await get_database()
    
    reviews = await db.guide_reviews.find().sort("created_at", -1).to_list(length=100)
    
    reviews_list = []
    for review in reviews:
        reviews_list.append({
            "id": str(review["_id"]),
            "guide_id": review["guide_id"],
            "guide_name": review.get("guide_name", "Unknown Guide"),
            "traveler_name": review["traveler_name"],
            "rating": review["rating"],
            "comment": review["comment"],
            "created_at": review["created_at"].isoformat() if review.get("created_at") else None
        })
    
    return {"reviews": reviews_list, "total": len(reviews_list)}

@router.get("/traveler/{email}")
async def get_traveler_reviews(email: str):
    """Get all reviews by a specific traveler"""
    db = await get_database()
    
    reviews = await db.guide_reviews.find({"traveler_email": email}).sort("created_at", -1).to_list(length=100)
    
    reviews_list = []
    for review in reviews:
        reviews_list.append({
            "id": str(review["_id"]),
            "guide_id": review["guide_id"],
            "guide_name": review.get("guide_name", "Unknown Guide"),
            "rating": review["rating"],
            "comment": review["comment"],
            "booking_id": review.get("booking_id"),
            "guide_reply": review.get("guide_reply"),
            "replied_at": review.get("replied_at").isoformat() if review.get("replied_at") else None,
            "created_at": review["created_at"].isoformat() if review.get("created_at") else None
        })
    
    return {"reviews": reviews_list, "total": len(reviews_list)}

@router.get("/guide-email/{email}")
async def get_guide_reviews_by_email(email: str):
    """Get all reviews for a guide by their email"""
    db = await get_database()
    
    # First, find the guide by email
    guide = await db.guides.find_one({"email": email})
    
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guide not found"
        )
    
    guide_id = str(guide["_id"])
    
    # Get all reviews for this guide
    reviews = await db.guide_reviews.find({"guide_id": guide_id}).sort("created_at", -1).to_list(length=100)
    
    reviews_list = []
    for review in reviews:
        reviews_list.append({
            "id": str(review["_id"]),
            "guide_id": review["guide_id"],
            "guide_name": review.get("guide_name", guide["fullName"]),
            "traveler_name": review["traveler_name"],
            "rating": review["rating"],
            "comment": review["comment"],
            "booking_id": review.get("booking_id"),
            "created_at": review["created_at"].isoformat() if review.get("created_at") else None
        })
    
    return {"reviews": reviews_list, "total": len(reviews_list)}

@router.delete("/{review_id}")
async def delete_review(review_id: str, email: str):
    """Delete a review (only by the reviewer)"""
    db = await get_database()
    
    try:
        review = await db.guide_reviews.find_one({"_id": ObjectId(review_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid review ID"
        )
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    if review["traveler_email"] != email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own reviews"
        )
    
    await db.guide_reviews.delete_one({"_id": ObjectId(review_id)})
    
    # Update guide's average rating
    guide_id = review["guide_id"]
    all_reviews = await db.guide_reviews.find({"guide_id": guide_id}).to_list(length=1000)
    if all_reviews:
        avg_rating = sum(r["rating"] for r in all_reviews) / len(all_reviews)
        await db.guides.update_one(
            {"_id": ObjectId(guide_id)},
            {"$set": {"rating": round(avg_rating, 1)}}
        )
    else:
        await db.guides.update_one(
            {"_id": ObjectId(guide_id)},
            {"$set": {"rating": 0.0}}
        )
    
    return {"message": "Review deleted successfully"}

@router.post("/destination/create", status_code=status.HTTP_201_CREATED)
async def create_destination_review(review: DestinationReviewCreate):
    """Create a new review for a destination"""
    db = await get_database()
    
    review_doc = {
        "destination_name": review.destination_name,
        "traveler_email": review.traveler_email,
        "traveler_name": review.traveler_name,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": datetime.utcnow()
    }
    
    result = await db.destination_reviews.insert_one(review_doc)
    return {"message": "Destination review submitted", "id": str(result.inserted_id)}

@router.get("/destination/{name}")
async def get_destination_reviews(name: str):
    """Get all reviews for a specific destination"""
    db = await get_database()
    reviews = await db.destination_reviews.find({"destination_name": name}).sort("created_at", -1).to_list(length=100)
    
    result = []
    for r in reviews:
        result.append({
            "id": str(r["_id"]),
            "traveler_name": r["traveler_name"],
            "rating": r["rating"],
            "comment": r["comment"],
            "created_at": r["created_at"].isoformat() if r.get("created_at") else None
        })
    return {"reviews": result, "total": len(result)}

@router.get("/destination-all/list")
async def get_all_destination_reviews():
    """Get all destination reviews (for admin)"""
    db = await get_database()
    
    reviews = await db.destination_reviews.find().sort("created_at", -1).to_list(length=500)
    
    reviews_list = []
    for review in reviews:
        reviews_list.append({
            "id": str(review["_id"]),
            "destination_name": review.get("destination_name", "Unknown"),
            "traveler_name": review.get("traveler_name"),
            "rating": review.get("rating"),
            "comment": review.get("comment"),
            "created_at": review["created_at"].isoformat() if review.get("created_at") else None
        })
    
    return {"reviews": reviews_list, "total": len(reviews_list)}
@router.put("/{review_id}/reply")
async def reply_to_review(review_id: str, reply_data: ReviewReply):
    """Allow a guide to reply to a review"""
    db = await get_database()
    
    try:
        result = await db.guide_reviews.update_one(
            {"_id": ObjectId(review_id)},
            {
                "$set": {
                    "guide_reply": reply_data.reply,
                    "replied_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            return {"message": "No changes made or review not found"}
            
        return {"message": "Reply saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
