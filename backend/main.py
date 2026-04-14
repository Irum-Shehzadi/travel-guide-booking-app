from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_to_mongo, close_mongo_connection
from routers import traveler, guide, booking, review, contact, upload, weather, places, admin, notification, chat

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event logic
    await connect_to_mongo()
    print("Application started successfully!")
    yield
    # Shutdown event logic
    await close_mongo_connection()
    print("Application shut down")

app = FastAPI(
    title="Travel Booking API",
    description="Backend API for Travel Booking Guide Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for local dev stability
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Validation Error Handler - Show detailed 422 errors
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    import json
    error_log = {
        "url": str(request.url),
        "errors": exc.errors(),
        "body": str(exc.body) if hasattr(exc, 'body') else None
    }
    with open("validation_error.json", "w") as f:
        json.dump(error_log, f, indent=4)
        
    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.errors(),
            "message": "Validation failed - check the fields below",
            "body_received": str(exc.body) if hasattr(exc, 'body') else None
        }
    )

# Include routers
app.include_router(traveler.router)
app.include_router(guide.router)
app.include_router(booking.router)
app.include_router(review.router)
app.include_router(contact.router)
app.include_router(upload.router)
app.include_router(weather.router)
app.include_router(places.router)
app.include_router(admin.router)
app.include_router(notification.router)
app.include_router(chat.router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Travel Booking API",
        "version": "1.0.0",
        "endpoints": {
            "travelers": "/api/traveler",
            "guides": "/api/guide",
            "docs": "/docs"
        }
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)