import asyncio
import os
import re
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "travel_booking")

async def check_guides():
    client = AsyncIOMotorClient(MONGODB_URL, tlsAllowInvalidCertificates=True)
    db = client[DATABASE_NAME]
    
    with open('e:/fyp-1/frontend/src/data/destinations.js', 'r', encoding='utf-8') as f:
        content = f.read()
        
    cities = re.findall(r"name:\s*['\"]([^'\"]+)['\"]", content)
    # The regex might catch province names and attraction names too, let's filter based on known cities or just check them all.
    # Actually, let's just do a distinct on 'city' in guides collection to see what cities are there
    guide_cities = await db.guides.distinct("city")
    
    print(f"Total distinct cities in guides: {len(guide_cities)}")
    print(guide_cities)
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_guides())
