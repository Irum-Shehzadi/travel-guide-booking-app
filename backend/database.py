from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "travel_booking")

class Database:
    client: Optional[AsyncIOMotorClient] = None
    
database = Database()

async def get_database():
    return database.client[DATABASE_NAME]

async def connect_to_mongo():
    database.client = AsyncIOMotorClient(MONGODB_URL)
    print(f"Connected to MongoDB at {MONGODB_URL}")

async def close_mongo_connection():
    if database.client:
        database.client.close()
        print("Closed MongoDB connection")