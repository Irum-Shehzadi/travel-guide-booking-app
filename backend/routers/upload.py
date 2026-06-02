from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
import os
import cloudinary
import cloudinary.uploader

router = APIRouter(prefix="/api/upload", tags=["Upload"])

from dotenv import load_dotenv

load_dotenv()

# Configure Cloudinary using environment variables
cloudinary.config( 
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME", "demo"), 
    api_key = os.getenv("CLOUDINARY_API_KEY", "123"), 
    api_secret = os.getenv("CLOUDINARY_API_SECRET", "abc") 
)

# Allowed file extensions
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def validate_image(file: UploadFile):
    """Validate image file extension"""
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    return ext

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image directly to Cloudinary and return its secure URL"""
    
    # 1. Validate file extension
    validate_image(file)
    
    # 2. Read file content to check size
    content = await file.read()
    
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 5MB"
        )
    
    try:
        # 3. Upload to Cloudinary using the file content bytes
        # We specify the folder in Cloudinary as 'travel_booking'
        upload_result = cloudinary.uploader.upload(
            content,
            folder="travel_booking",
            resource_type="image"
        )
        
        # 4. Get the secure URL from Cloudinary's response
        secure_url = upload_result.get("secure_url")
        
        return {
            "message": "File uploaded successfully to Cloud",
            "filename": file.filename,
            "url": secure_url  # Now returning the Cloudinary URL!
        }
        
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error uploading image to Cloud Storage. Check your Cloudinary keys."
        )

# NOTE: The GET and DELETE endpoints are no longer needed locally because 
# Cloudinary handles image serving and we manage deletions from their dashboard.
