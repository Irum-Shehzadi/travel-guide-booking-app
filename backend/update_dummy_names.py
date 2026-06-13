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

FEMALE_FIRST_NAMES = {
    "amina", "ayesha", "bisma", "bushra", "dua", "eshal", "fatima", "ghazala", 
    "hina", "iqra", "javeria", "kiran", "laiba", "maryam", "nadia", "omaima", 
    "parveen", "quratulain", "rabia", "sana", "tahira", "tooba", "urooj", 
    "uzma", "wajiha", "warda", "yusra", "zahra", "zainab", "zoya", "anum", "yasmin"
}

MALE_PHOTOS = [
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400",
    "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400"
]

FEMALE_PHOTOS = [
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400"
]

def get_gender(full_name):
    parts = full_name.split()
    if not parts:
        return "male"
    first_name = parts[0].lower()
    if first_name in FEMALE_FIRST_NAMES:
        return "female"
    return "male"

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
        
        gender = get_gender(random_name)
        new_photo = random.choice(FEMALE_PHOTOS) if gender == "female" else random.choice(MALE_PHOTOS)
        
        result = await collection.update_one(
            {"email": email},
            {"$set": {
                "fullName": random_name,
                "profile_photo": new_photo
            }}
        )
        
        if result.modified_count > 0:
            print(f"Updated {email} -> {random_name} ({gender}) | photo: {new_photo}")
            updated_count += 1
            
    print(f"Successfully updated {updated_count} dummy guides with real names.")
    client.close()

if __name__ == "__main__":
    asyncio.run(update_guides())
