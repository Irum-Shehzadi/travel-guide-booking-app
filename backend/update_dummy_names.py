import asyncio
import os
import random
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "travel_booking")

NAMES = [
    "Ali Raza", "Usman Khan", "Muhammad Bilal", "Ahmed Tariq", "Saad Mahmood", 
    "Zainab Ali", "Fatima Noor", "Hamza Shafiq", "Shahzaib Hassan", "Fahad Mustafa", 
    "Imran Nazir", "Kashif Saeed", "Hassan Qureshi", "Ayesha Malik", "Sana Javed", 
    "Noman Ijaz", "Waqar Younis", "Kamran Akmal", "Shoaib Malik", "Babar Azam", 
    "Shaheen Afridi", "Haris Rauf", "Shadab Khan", "Naseem Shah", "Mohammad Rizwan", 
    "Fakhar Zaman", "Imam-ul-Haq", "Sarfaraz Ahmed", "Asif Ali", "Iftikhar Ahmed", 
    "Salman Ali Agha", "Mohammad Nawaz", "Abrar Ahmed", "Saud Shakeel", "Zahid Mahmood"
]

CITIES = [
    "Lahore", "Islamabad", "Rawalpindi", "Multan", "Bahawalpur", "Faisalabad", "Sialkot", "Gujranwala",
    "Karachi", "Hyderabad", "Larkana", "Thatta", "Sukkur", "Mirpur Khas",
    "Peshawar", "Swat Valley", "Chitral", "Abbottabad", "Naran Kaghan", "Dir & Kumrat",
    "Quetta", "Gwadar", "Ziarat", "Hingol National Park",
    "Gilgit", "Hunza Valley", "Skardu", "Deosai National Park", "Fairy Meadows", "Khaplu",
    "Muzaffarabad", "Neelum Valley", "Rawalakot"
]

async def update_guides():
    print(f"Connecting to MongoDB at {MONGODB_URL}...")
    client = AsyncIOMotorClient(MONGODB_URL, tlsAllowInvalidCertificates=True)
    db = client[DATABASE_NAME]
    
    collection = db.guides
    
    # Shuffle names so we get random names for each run
    random.shuffle(NAMES)
    
    updated_count = 0
    for idx, city in enumerate(CITIES):
        email = f"guide_{city.lower().replace(' ', '_').replace('&', 'and')}@example.com"
        random_name = NAMES[idx % len(NAMES)]
        
        result = await collection.update_one(
            {"email": email},
            {"$set": {"fullName": random_name}}
        )
        
        if result.modified_count > 0:
            print(f"Updated {email} -> {random_name}")
            updated_count += 1
            
    print(f"Successfully updated {updated_count} dummy guides with real names.")
    client.close()

if __name__ == "__main__":
    asyncio.run(update_guides())
