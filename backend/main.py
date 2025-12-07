from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_to_mongo, close_mongo_connection
from routers import traveler, guide

app = FastAPI(
    title="Travel Booking API",
    description="Backend API for Travel Booking Guide Platform",
    version="1.0.0"
)

# CORS Middleware - Frontend se connect karne ke liye
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React app URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event - MongoDB connection
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()
    print("✅ Application started successfully!")

# Shutdown event - Close MongoDB connection
@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()
    print("❌ Application shut down")

# Include routers
app.include_router(traveler.router)
app.include_router(guide.router)

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

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)