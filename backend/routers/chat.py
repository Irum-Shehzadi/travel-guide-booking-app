from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from database import get_database
from models import ChatMessage
from datetime import datetime
from typing import Dict, List
from routers.notification import create_and_send_notification, NotificationType
import json

router = APIRouter(prefix="/api/chat", tags=["Chat"])

# Connection Manager for Live Chat
class ChatManager:
    def __init__(self):
        # email -> list of websockets (user can have multiple tabs open)
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, email: str):
        await websocket.accept()
        if email not in self.active_connections:
            self.active_connections[email] = []
        self.active_connections[email].append(websocket)
        print(f"[Chat] {email} connected.")

    def disconnect(self, websocket: WebSocket, email: str):
        if email in self.active_connections:
            self.active_connections[email] = [
                ws for ws in self.active_connections[email] if ws != websocket
            ]
            if not self.active_connections[email]:
                del self.active_connections[email]
        print(f"[Chat] {email} disconnected.")

    async def send_message(self, message: dict, recipient_email: str):
        if recipient_email in self.active_connections:
            for ws in self.active_connections[recipient_email]:
                try:
                    await ws.send_json(message)
                except:
                    pass

    async def broadcast_to_admins(self, message: dict):
        for email, connections in self.active_connections.items():
            if email.startswith("admin"):
                for ws in connections:
                    try:
                        await ws.send_json(message)
                    except:
                        pass

manager = ChatManager()

@router.websocket("/ws/{email}")
async def chat_websocket(websocket: WebSocket, email: str):
    await manager.connect(websocket, email)
    db = await get_database()
    
    try:
        while True:
            data = await websocket.receive_text()
            msg_data = json.loads(data)
            
            # Create message object
            message = {
                "sender_email": email,
                "receiver_email": msg_data["receiver_email"],
                "message": msg_data["message"],
                "sender_name": msg_data["sender_name"],
                "sender_role": msg_data["sender_role"],
                "created_at": datetime.utcnow(),
                "is_read": False
            }
            
            # Save to DB
            await db.chat_messages.insert_one(message)
            
            # Format according to JSON
            message_dict = message.copy()
            message_dict["created_at"] = message_dict["created_at"].isoformat()
            if "_id" in message_dict:
                message_dict["id"] = str(message_dict.pop("_id"))
            
            print(f"[Chat DEBUG] Message from {email} to {message['receiver_email']}: {message['message']}")
            
            # Send to recipient
            if message["receiver_email"] == "admin":
                await manager.broadcast_to_admins(message_dict)
                # Send a system notification so admin sees it even if not on chat tab
                await create_and_send_notification(
                    recipient_email="admin",
                    recipient_type="admin",
                    notif_type=NotificationType.SUPPORT_MESSAGE,
                    title=f"Chat: {message['sender_name']}",
                    message=message["message"][:40],
                    link="/admin-dashboard"
                )
            else:
                await manager.send_message(message_dict, message["receiver_email"])
                
            # Echo back to sender (all tabs)
            await manager.send_message(message_dict, email)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, email)
    except Exception as e:
        print(f"Chat error: {e}")
        manager.disconnect(websocket, email)

@router.get("/history/{user_email}")
async def get_chat_history(user_email: str, other_email: str = "admin"):
    """Get chat history between two users"""
    db = await get_database()
    
    # Query for messages between these two
    query = {
        "$or": [
            {"sender_email": user_email, "receiver_email": other_email},
            {"sender_email": other_email, "receiver_email": user_email}
        ]
    }
    
    messages = await db.chat_messages.find(query).sort("created_at", 1).to_list(length=100)
    
    result = []
    for m in messages:
        result.append({
            "sender_email": m["sender_email"],
            "receiver_email": m["receiver_email"],
            "message": m["message"],
            "sender_name": m["sender_name"],
            "sender_role": m["sender_role"],
            "created_at": m["created_at"].isoformat() if isinstance(m["created_at"], datetime) else m["created_at"],
            "is_read": m.get("is_read", False)
        })
    
    return {"messages": result}

@router.get("/conversations")
async def get_active_conversations():
    """Admin tool to see who has messaged (unique users)"""
    db = await get_database()
    
    # Simple aggregation to find unique sender emails who aren't admin
    pipeline = [
        {"$match": {"sender_email": {"$ne": "admin"}}},
        {"$sort": {"created_at": -1}},
        {"$group": {
            "_id": "$sender_email",
            "last_message": {"$first": "$message"},
            "sender_name": {"$first": "$sender_name"},
            "sender_role": {"$first": "$sender_role"},
            "created_at": {"$first": "$created_at"}
        }},
        {"$sort": {"created_at": -1}}
    ]
    
    convs = await db.chat_messages.aggregate(pipeline).to_list(length=50)
    
    result = []
    for c in convs:
        result.append({
            "email": c["_id"],
            "last_message": c["last_message"],
            "sender_name": c["sender_name"],
            "sender_role": c["sender_role"],
            "created_at": c["created_at"].isoformat() if isinstance(c["created_at"], datetime) else c["created_at"]
        })
        
    return {"conversations": result}
