from fastapi import APIRouter, HTTPException, status
from models import GuideRegistration, GuideLogin
from database import get_database
from typing import List
from utils import get_password_hash, verify_password, create_access_token
from datetime import datetime, timedelta, timezone
import os
from models import NotificationType
from routers.notification import create_and_send_notification

router = APIRouter(prefix="/api/guide", tags=["Guide"])

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def guide_registration(guide: GuideRegistration):
    """Register a new guide"""
    db = await get_database()

    # ---- CNIC Blacklist Check ----
    # Agar is CNIC se pehle koi permanently block hua hai to registration band
    blocked_cnic = await db.guides.find_one({
        "cnic_number": guide.cnic_number,
        "is_permanently_blocked": True
    })
    if blocked_cnic:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your CNIC is blacklisted due to permanent suspension. You cannot register again."
        )

    # ---- Duplicate Email Check ----
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
        "cnic_number": guide.cnic_number,
        "cnic_photo": guide.cnic_photo,
        "is_verified": False,  # Admin needs to verify
        "is_active": True,
        "rating": 0.0,
        "total_bookings": 0,
        "hashed_password": hashed_password,
        # Reporting & Blocking
        "report_count": 0,
        "is_blocked": False,
        "blocked_until": None,
        "is_permanently_blocked": False
    }
    
  
    result = await db.guides.insert_one(guide_doc)
    
    # Notify admin
    await create_and_send_notification(
        recipient_email="admin",
        recipient_type="admin",
        notif_type=NotificationType.NEW_GUIDE,
        title="New Guide Application!",
        message=f"Guide {guide.fullName} ({guide.email}) has submitted an application for verification.",
        link="/admin/guides",
        metadata={"guide_id": str(result.inserted_id)}
    )
    
    
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
            "is_verified": False,
            "type": "guide"
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

    # ---- Permanent Block Check ----
    if guide_doc.get("is_permanently_blocked", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been permanently suspended due to multiple complaints and policy violations."
        )

    # ---- Temporary Block Check ----
    if guide_doc.get("is_blocked", False):
        blocked_until = guide_doc.get("blocked_until")
        now = datetime.now(timezone.utc)
        # Make blocked_until timezone-aware if needed
        if blocked_until and blocked_until.tzinfo is None:
            blocked_until = blocked_until.replace(tzinfo=timezone.utc)
        if blocked_until and now < blocked_until:
            remaining = blocked_until - now
            days = remaining.days
            hours = remaining.seconds // 3600
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Your account is temporarily suspended until {blocked_until.strftime('%Y-%m-%d %H:%M')}. Please try again after the suspension period."
            )
        else:
            # Block period khatam ho gaya, auto-unblock
            await db.guides.update_one(
                {"_id": guide_doc["_id"]},
                {"$set": {"is_blocked": False, "blocked_until": None}}
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
            "profile_photo": guide_doc.get("profile_photo"),
            "type": "guide"
        },
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/all")
async def get_all_guides():
    """Get all verified guides"""
    db = await get_database()
    
    guides = await db.guides.find({"is_active": True}).to_list(length=100)
    
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
            "cnic_number": guide.get("cnic_number"),
            "cnic_photo": guide.get("cnic_photo"),
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
        "profile_photo": guide.get("profile_photo"),
        "cnic_number": guide.get("cnic_number"),
        "cnic_photo": guide.get("cnic_photo"),
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
            "is_verified": guide.get("is_verified", False),
            "report_count": guide.get("report_count", 0),
            "is_blocked": guide.get("is_blocked", False)
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
            "about": guide.get("about", ""),
            "phone": guide.get("phone", ""),
            "languages": guide["languages"],
            "specializations": guide["specializations"],
            "rating": guide.get("rating", 0.0),
            "total_bookings": guide.get("total_bookings", 0),
            "profile_photo": guide.get("profile_photo")
        })
    
    return {"guides": guides_list, "total": len(guides_list)}