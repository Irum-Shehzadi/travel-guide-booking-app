from fastapi import APIRouter, HTTPException, status
from models import GuideRegistration
from database import get_database
from typing import List

router = APIRouter(prefix="/api/guide", tags=["Guide"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def guide_registration(guide: GuideRegistration):
    """Register a new guide"""
    db = await get_database()
    
    # Check if email already exists
    existing_guide = await db.guides.find_one({"email": guide.email})
    if existing_guide:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create guide document
    guide_doc = {
        "fullName": guide.fullName,
        "email": guide.email,
        "phone": guide.phone,
        "city": guide.city,
        "experience": guide.experience,
        "about": guide.about,
        "languages": guide.languages,
        "specializations": guide.specializations,
        "certifications": guide.certifications,
        "is_verified": False,  # Admin needs to verify
        "is_active": True,
        "rating": 0.0,
        "total_bookings": 0
    }
    
    # Insert into database
    result = await db.guides.insert_one(guide_doc)
    
    return {
        "message": "Guide registration submitted successfully. We will review your application soon.",
        "guide": {
            "id": str(result.inserted_id),
            "fullName": guide.fullName,
            "email": guide.email,
            "city": guide.city,
            "is_verified": False
        }
    }

@router.get("/all")
async def get_all_guides():
    """Get all verified guides"""
    db = await get_database()
    
    guides = await db.guides.find({"is_verified": True, "is_active": True}).to_list(length=100)
    
    guides_list = []
    for guide in guides:
        guides_list.append({
            "id": str(guide["_id"]),
            "fullName": guide["fullName"],
            "email": guide["email"],
            "phone": guide["phone"],
            "city": guide["city"],
            "experience": guide["experience"],
            "about": guide["about"],
            "languages": guide["languages"],
            "specializations": guide["specializations"],
            "rating": guide.get("rating", 0.0),
            "total_bookings": guide.get("total_bookings", 0)
        })
    
    return {"guides": guides_list, "total": len(guides_list)}

@router.get("/{guide_id}")
async def get_guide_by_id(guide_id: str):
    """Get guide details by ID"""
    from bson import ObjectId
    db = await get_database()
    
    try:
        guide = await db.guides.find_one({"_id": ObjectId(guide_id)})
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
    
    return {
        "id": str(guide["_id"]),
        "fullName": guide["fullName"],
        "email": guide["email"],
        "phone": guide["phone"],
        "city": guide["city"],
        "experience": guide["experience"],
        "about": guide["about"],
        "languages": guide["languages"],
        "specializations": guide["specializations"],
        "certifications": guide.get("certifications", ""),
        "rating": guide.get("rating", 0.0),
        "total_bookings": guide.get("total_bookings", 0),
        "is_verified": guide.get("is_verified", False)
    }

@router.get("/search/city/{city}")
async def search_guides_by_city(city: str):
    """Search guides by city"""
    db = await get_database()
    
    guides = await db.guides.find({
        "city": {"$regex": city, "$options": "i"},
        "is_verified": True,
        "is_active": True
    }).to_list(length=100)
    
    guides_list = []
    for guide in guides:
        guides_list.append({
            "id": str(guide["_id"]),
            "fullName": guide["fullName"],
            "city": guide["city"],
            "experience": guide["experience"],
            "languages": guide["languages"],
            "specializations": guide["specializations"],
            "rating": guide.get("rating", 0.0)
        })
    
    return {"guides": guides_list, "total": len(guides_list)}