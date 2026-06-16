from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_to_mongo, close_mongo_connection
from routers import traveler, guide, booking, review, contact, upload, weather, places, admin, notification, chat, complaint

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
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        
    ],
    allow_origin_regex="https?://.*",  # Allow all origins matching http/https for local dev flexibilty
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
app.include_router(complaint.router)

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
    import os
    import sys
    import asyncio

    # Fix: Suppress harmless WinError 10054 (connection reset) spam on Windows
    if sys.platform == "win32":
        import asyncio.proactor_events as _pe
        _orig_call_connection_lost = _pe._ProactorBasePipeTransport._call_connection_lost

        def _patched_call_connection_lost(self, exc):
            try:
                _orig_call_connection_lost(self, exc)
            except ConnectionResetError:
                pass  # Suppress WinError 10054 — remote host closed connection

        _pe._ProactorBasePipeTransport._call_connection_lost = _patched_call_connection_lost

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
