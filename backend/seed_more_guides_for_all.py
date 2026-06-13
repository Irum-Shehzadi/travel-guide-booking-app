import asyncio
import os
import random
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from utils import get_password_hash

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "travel_booking")

NAMES = [
    "Aamir", "Bilal", "Daud", "Ehsan", "Fahad", "Gohar", "Hamza", "Imran", "Junaid", "Kamran",
    "Ayesha", "Bushra", "Dua", "Eshal", "Fatima", "Ghazala", "Hina", "Iqra", "Javeria", "Kiran",
    "Liaquat", "Muneeb", "Noman", "Osman", "Pervez", "Qasim", "Rizwan", "Salman", "Tariq", "Usman",
    "Laiba", "Maryam", "Nadia", "Omaima", "Parveen", "Quratulain", "Rabia", "Sana", "Tahira", "Uzma",
    "Waqar", "Yasin", "Zahid", "Adeel", "Basit", "Zoya", "Yusra", "Wajiha", "Anum", "Bisma",
    "Zeeshan", "Yousuf", "Waseem", "Umer", "Talha", "Zainab", "Yasmin", "Warda", "Urooj", "Tooba"
]

SURNAMES = ["Khan", "Ali", "Ahmed", "Shah", "Qureshi", "Malik", "Chaudhry", "Raza", "Hussain", "Tariq", "Javed", "Iqbal", "Mahmood", "Nawaz", "Dar", "Baig", "Sheikh", "Siddiqui"]

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

FEMALE_FIRST_NAMES = {
    "amina", "ayesha", "bisma", "bushra", "dua", "eshal", "fatima", "ghazala", 
    "hina", "iqra", "javeria", "kiran", "laiba", "maryam", "nadia", "omaima", 
    "parveen", "quratulain", "rabia", "sana", "tahira", "tooba", "urooj", 
    "uzma", "wajiha", "warda", "yusra", "zahra", "zainab", "zoya", "anum", "yasmin"
}

def get_gender(first_name):
    if first_name.lower() in FEMALE_FIRST_NAMES:
        return "female"
    return "male"

REVIEWS = [
    "Great experience, very knowledgeable guide!",
    "Showed us the best spots that are not usually crowded. Highly recommended.",
    "Very friendly and professional. Made our trip memorable.",
    "Excellent service, knew a lot about the local history and culture.",
    "Absolutely amazing! The guide was patient and very helpful with everything.",
    "Best tour we've ever had. Very accommodating to our needs."
]

TRAVELER_NAMES = ["Hassan", "Sara", "Ali", "Fatima", "Usman", "Sana", "Omar", "Ayesha", "Zainab", "Bilal", "Khadija", "Hamza"]

async def seed_all_cities():
    print(f"Connecting to MongoDB at {MONGODB_URL}...")
    client = AsyncIOMotorClient(MONGODB_URL, tlsAllowInvalidCertificates=True)
    db = client[DATABASE_NAME]
    
    hashed_password = get_password_hash("password123")
    
    # Get all unique cities from the guides collection just to be safe
    # But better to just get the cities list we know
    CITIES = [
        "Lahore", "Islamabad", "Rawalpindi", "Multan", "Bahawalpur", "Faisalabad", "Sialkot", "Gujranwala",
        "Karachi", "Hyderabad", "Larkana", "Thatta", "Sukkur", "Mirpur Khas",
        "Peshawar", "Swat Valley", "Chitral", "Abbottabad", "Naran Kaghan", "Dir & Kumrat",
        "Quetta", "Gwadar", "Ziarat", "Hingol National Park",
        "Gilgit", "Hunza Valley", "Skardu", "Deosai National Park", "Fairy Meadows", "Khaplu",
        "Muzaffarabad", "Neelum Valley", "Rawalakot"
    ]
    
    total_guides = 0
    total_reviews = 0
    
    for city in CITIES:
        # Check how many guides this city has
        count = await db.guides.count_documents({"city": city})
        
        needed = 4 - count
        if needed > 0:
            for i in range(needed):
                first_name = random.choice(NAMES)
                last_name = random.choice(SURNAMES)
                full_name = f"{first_name} {last_name}"
                
                email = f"guide_{city.lower().replace(' ', '_').replace('&', 'and')}_extra_{random.randint(1000,9999)}@example.com"
                
                gender = get_gender(first_name)
                photo = random.choice(FEMALE_PHOTOS) if gender == "female" else random.choice(MALE_PHOTOS)
                guide_doc = {
                    "fullName": full_name,
                    "email": email,
                    "phone": f"0300{random.randint(1000000, 9999999)}",
                    "city": city,
                    "experience": random.randint(3, 15),
                    "about": f"Hi! I am {full_name}, an expert guide in {city}. Let me show you the hidden gems of this amazing place.",
                    "languages": ["English", "Urdu", "Local Language"][:random.randint(2,3)],
                    "specializations": ["Historical Tours", "Food Tours", "Photography", "Nature Walks"][:random.randint(2,3)],
                    "certifications": "Professional Guide",
                    "profile_photo": photo,
                    "cnic_number": f"35201-9876543-{random.randint(10,99)}",
                    "cnic_photo": "",
                    "is_verified": True,
                    "is_active": True,
                    "rating": 4.5 + (random.randint(0, 5) / 10.0),
                    "total_bookings": random.randint(15, 50),
                    "hashed_password": hashed_password,
                    "created_at": datetime.now(timezone.utc),
                    "report_count": 0,
                    "is_blocked": False,
                    "blocked_until": None,
                    "is_permanently_blocked": False
                }
                
                result = await db.guides.insert_one(guide_doc)
                guide_id = str(result.inserted_id)
                total_guides += 1
                
                # Add 3 reviews
                num_reviews = random.randint(3, 5)
                for _ in range(num_reviews):
                    t_name = random.choice(TRAVELER_NAMES)
                    comment = random.choice(REVIEWS)
                    rating = random.choice([4, 5, 5, 5])
                    
                    review_doc = {
                        "guide_id": guide_id,
                        "traveler_email": f"{t_name.lower()}@traveler.com",
                        "traveler_name": t_name,
                        "rating": rating,
                        "comment": comment,
                        "guide_reply": "Thank you!" if random.random() > 0.5 else None,
                        "replied_at": datetime.now(timezone.utc) if random.random() > 0.5 else None,
                        "booking_id": None,
                        "created_at": datetime.now(timezone.utc) - timedelta(days=random.randint(1, 30))
                    }
                    
                    await db.guide_reviews.insert_one(review_doc)
                    total_reviews += 1
                    
    print(f"Done! Inserted {total_guides} new guides and {total_reviews} new reviews to ensure every city has at least 4 guides.")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_all_cities())
