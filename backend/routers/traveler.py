from fastapi import APIRouter, HTTPException, status, Depends
from models import TravelerSignup, TravelerLogin, Token
from database import get_database
from utils import get_password_hash, verify_password, create_access_token
from datetime import timedelta
import os

router = APIRouter(prefix="/api/traveler", tags=["Traveler"])

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def traveler_signup(traveler: TravelerSignup):
    """Register a new traveler"""
    print(f"[TRAVELER SIGNUP] Received request:")
    print(f"  - Name: {traveler.name}")
    print(f"  - Email: {traveler.email}")
    print(f"  - Password length: {len(traveler.password)}")
    
    db = await get_database()
    
   
    existing_traveler = await db.travelers.find_one({"email": traveler.email})
    if existing_traveler:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
   
    hashed_password = get_password_hash(traveler.password)
    
  
    traveler_doc = {
        "name": traveler.name,
        "email": traveler.email,
        "hashed_password": hashed_password,
        "created_at": None,  # Will be set by default in DB
        "is_active": True
    }
    
    
    result = await db.travelers.insert_one(traveler_doc)
    print(f"[TRAVELER SIGNUP] Created traveler with ID: {result.inserted_id}")
    
    
    access_token = create_access_token(
        data={"sub": traveler.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "message": "Traveler registered successfully",
        "user": {
            "id": str(result.inserted_id),
            "name": traveler.name,
            "email": traveler.email
        },
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/login")
async def traveler_login(traveler: TravelerLogin):
    """Login a traveler"""
    db = await get_database()
    
   
    traveler_doc = await db.travelers.find_one({"email": traveler.email})
    
    if not traveler_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
   
    if not verify_password(traveler.password, traveler_doc["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
   
    if not traveler_doc.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
   
    access_token = create_access_token(
        data={"sub": traveler.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "message": "Login successful",
        "user": {
            "id": str(traveler_doc["_id"]),
            "name": traveler_doc["name"],
            "email": traveler_doc["email"]
        },
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/profile/{email}")
async def get_traveler_profile(email: str):
    """Get traveler profile by email"""
    db = await get_database()
    
    traveler = await db.travelers.find_one({"email": email})
    
    if not traveler:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Traveler not found"
        )
    
    return {
        "id": str(traveler["_id"]),
        "name": traveler["name"],
        "email": traveler["email"],
        "created_at": traveler.get("created_at"),
        "is_active": traveler.get("is_active", True)
    } 