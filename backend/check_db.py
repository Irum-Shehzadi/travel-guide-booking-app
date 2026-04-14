import asyncio
import motor.motor_asyncio

async def check_contacts():
    client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.travel_booking
    contacts = await db.contacts.find().sort("created_at", -1).to_list(10)
    print(f"Total contacts found: {len(contacts)}")
    for c in contacts:
        print(f"Name: {c.get('name')}, Email: {c.get('email')}, Message: {c.get('message')}")

if __name__ == "__main__":
    asyncio.run(check_contacts())
