from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List, Annotated
from datetime import datetime
from bson import ObjectId
from enum import Enum

# Pydantic
class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        from pydantic_core import core_schema
        
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )
    
    @classmethod
    def validate(cls, value):
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")
        return ObjectId(value)

# Traveler Models
class TravelerSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class TravelerLogin(BaseModel):
    email: EmailStr
    password: str

class TravelerInDB(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True, populate_by_name=True)
    
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: str
    email: EmailStr
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

# Guide Models
class GuideRegistration(BaseModel):
    fullName: str
    email: EmailStr
    phone: str
    city: str
    experience: int
    about: str
    languages: List[str]
    specializations: List[str]
    certifications: Optional[str] = ""
    profile_photo: str  # Required - URL/path to uploaded photo
    cnic_number: str  # New field
    cnic_photo: str   # New field (URL to uploaded image)
    password: str

class GuideLogin(BaseModel):
    email: EmailStr
    password: str

class GuideInDB(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True, populate_by_name=True)
    
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    fullName: str
    email: EmailStr
    hashed_password: str
    phone: str
    city: str
    experience: int
    about: str
    languages: List[str]
    specializations: List[str]
    certifications: Optional[str] = ""
    cnic_number: Optional[str] = None
    cnic_photo: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_verified: bool = False
    is_active: bool = True
    rating: float = 0.0
    total_bookings: int = 0

# Booking Status 
class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

# Booking Models
class BookingCreate(BaseModel):
    guide_id: str
    traveler_email: str
    traveler_name: str
    booking_date: str  # Format: YYYY-MM-DD
    duration_days: int = 1
    destination: str
    special_requests: Optional[str] = ""
    contact_phone: str

class BookingUpdate(BaseModel):
    status: BookingStatus

class BookingInDB(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True, populate_by_name=True)
    
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    guide_id: str
    guide_name: str
    traveler_email: str
    traveler_name: str
    booking_date: str
    duration_days: int = 1
    destination: str
    special_requests: Optional[str] = ""
    contact_phone: str
    status: BookingStatus = BookingStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Review Models
class ReviewCreate(BaseModel):
    guide_id: str
    traveler_email: str
    traveler_name: str
    rating: int = Field(ge=1, le=5)  # 1-5 stars
    comment: str
    booking_id: Optional[str] = None

class ReviewReply(BaseModel):
    reply: str

class ReviewInDB(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True, populate_by_name=True)
    
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    guide_id: str
    traveler_email: str
    traveler_name: str
    rating: int
    comment: str
    guide_reply: Optional[str] = None
    replied_at: Optional[datetime] = None
    booking_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Destination Review Models
class DestinationReviewCreate(BaseModel):
    destination_name: str
    traveler_email: str
    traveler_name: str
    rating: int = Field(ge=1, le=5)
    comment: str

class DestinationReviewInDB(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True, populate_by_name=True)
    
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    destination_name: str
    traveler_email: str
    traveler_name: str
    rating: int
    comment: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Places API Models
class PlaceSearchRequest(BaseModel):
    query: str
    location: str = "Pakistan"
    gl: str = "pk"
    num: int = Field(default=10, le=20)

class PlaceResult(BaseModel):
    position: int
    title: str
    address: str
    latitude: float
    longitude: float
    phone_number: Optional[str] = None
    website: Optional[str] = None
    cid: Optional[str] = None
    thumbnail: Optional[str] = None
    rating: Optional[float] = None
    ratingCount: Optional[int] = None
    category: Optional[str] = None

class PlacesSearchResponse(BaseModel):
    places: List[PlaceResult]
    search_params: dict
    credits: Optional[int] = None

# Notification Models
class NotificationType(str, Enum):
    BOOKING_NEW = "booking_new"
    BOOKING_CONFIRMED = "booking_confirmed"
    BOOKING_CANCELLED = "booking_cancelled"
    BOOKING_COMPLETED = "booking_completed"
    REVIEW_RECEIVED = "review_received"
    GUIDE_VERIFIED = "guide_verified"
    SUPPORT_MESSAGE = "support_message"
    SYSTEM = "system"
    NEW_TRAVELER = "new_traveler"
    NEW_GUIDE = "new_guide"

class NotificationCreate(BaseModel):
    recipient_email: str
    recipient_type: str  # "traveler", "guide", "admin"
    type: NotificationType
    title: str
    message: str
    link: Optional[str] = None
    metadata: Optional[dict] = None

# Chat Models
class ChatMessage(BaseModel):
    sender_email: str
    receiver_email: str
    message: str
    sender_name: str
    sender_role: str # "traveler", "guide", "admin"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_read: bool = False

class NotificationInDB(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True, populate_by_name=True)

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    recipient_email: str
    recipient_type: str
    type: NotificationType
    title: str
    message: str
    link: Optional[str] = None
    metadata: Optional[dict] = None
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)