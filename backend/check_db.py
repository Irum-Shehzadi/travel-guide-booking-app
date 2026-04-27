import asyncio
import motor.motor_asyncio

async def check_contacts():
    # Fetching the same URL from your .env file or hardcoding it here
    client = motor.motor_asyncio.AsyncIOMotorClient('mongodb+srv://irum:Irum123@cluster0.utqrh7t.mongodb.net/?appName=Cluster0')
    db = client.travel_booking
    contacts = await db.contacts.find().sort("created_at", -1).to_list(10)
    print(f"Total contacts found: {len(contacts)}")
    for c in contacts:
        print(f"Name: {c.get('name')}, Email: {c.get('email')}, Message: {c.get('message')}")

if __name__ == "__main__":
    asyncio.run(check_contacts())
