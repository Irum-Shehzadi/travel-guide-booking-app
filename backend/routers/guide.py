from fastapi import APIRouter, HTTPException, status
from models import GuideRegistration, GuideLogin
from database import get_database
from typing import List
from utils import get_password_hash, verify_password, create_access_token
from datetime import timedelta
import os

router = APIRouter(prefix="/api/guide", tags=["Guide"])

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def guide_registration(guide: GuideRegistration):
    """Register a new guide"""
    db = await get_database()
    
   
    existing_guide = await db.guides.find_one({"email": guide.email})
    if existing_guide:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    
    hashed_password = get_password_hash(guide.password)
    
   
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
        "profile_photo": guide.profile_photo,
        "is_verified": False,  # Admin needs to verify
        "is_active": True,
        "rating": 0.0,
        "total_bookings": 0,
        "hashed_password": hashed_password
    }
    
  
    result = await db.guides.insert_one(guide_doc)
    
    
    access_token = create_access_token(
        data={"sub": guide.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "message": "Guide registration submitted successfully.",
        "guide": {
            "id": str(result.inserted_id),
            "fullName": guide.fullName,
            "email": guide.email,
            "city": guide.city,
            "is_verified": False
        },
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/login")
async def guide_login(guide: GuideLogin):
    """Login a guide"""
    db = await get_database()
    
   
    guide_doc = await db.guides.find_one({"email": guide.email})
    
    if not guide_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
  
    if not verify_password(guide.password, guide_doc.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not guide_doc.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    
    access_token = create_access_token(
        data={"sub": guide.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "message": "Login successful",
        "user": {
            "id": str(guide_doc["_id"]),
            "name": guide_doc["fullName"],
            "email": guide_doc["email"],
            "is_guide": True
        },
        "access_token": access_token,
        "token_type": "bearer"
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
            "total_bookings": guide.get("total_bookings", 0),
            "profile_photo": guide.get("profile_photo"),
            "is_verified": guide.get("is_verified", False)
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

@router.get("/email/{email}")
async def get_guide_by_email(email: str):
    """Get guide details by email"""
    db = await get_database()
    
    guide = await db.guides.find_one({"email": email})
    
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guide not found"
        )
    
    return {
        "guide": {
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
            "profile_photo": guide.get("profile_photo"),
            "rating": guide.get("rating", 0.0),
            "total_bookings": guide.get("total_bookings", 0),
            "is_verified": guide.get("is_verified", False)
        }
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