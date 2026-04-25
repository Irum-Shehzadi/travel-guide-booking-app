from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, status
from models import NotificationCreate, NotificationType
from database import get_database
from datetime import datetime
from bson import ObjectId
from typing import Dict, List
import json

router = APIRouter(prefix="/api/notification", tags=["Notifications"])

# ──────────────────────────────────────────────────────
# WebSocket Connection Manager (In-Memory, Real-Time)
# ──────────────────────────────────────────────────────
class ConnectionManager:
    """Manages active WebSocket connections per user email."""

    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, email: str):
        await websocket.accept()
        if email not in self.active_connections:
            self.active_connections[email] = []
        self.active_connections[email].append(websocket)
        print(f"[WS] {email} connected. Total connections: {len(self.active_connections[email])}")

    def disconnect(self, websocket: WebSocket, email: str):
        if email in self.active_connections:
            self.active_connections[email] = [
                ws for ws in self.active_connections[email] if ws != websocket
            ]
            if not self.active_connections[email]:
                del self.active_connections[email]
        print(f"[WS] {email} disconnected.")

    async def send_to_user(self, email: str, data: dict):
        """Send notification to a specific user if they are connected."""
        if email in self.active_connections:
            dead = []
            for ws in self.active_connections[email]:
                try:
                    await ws.send_json(data)
                except Exception:
                    dead.append(ws)
            # Cleanup dead connections
            for ws in dead:
                self.active_connections[email] = [
                    c for c in self.active_connections[email] if c != ws
                ]

    async def broadcast_to_admins(self, data: dict):
        """Send notification to all connected admin users (email starts with 'admin')."""
        for email, connections in list(self.active_connections.items()):
            if email.startswith("admin"):
                for ws in connections:
                    try:
                        await ws.send_json(data)
                    except Exception:
                        pass


manager = ConnectionManager()


# ──────────────────────────────────────────────────────
# Helper: Create & Dispatch Notification
# ──────────────────────────────────────────────────────
async def create_and_send_notification(
    recipient_email: str,
    recipient_type: str,
    notif_type: NotificationType,
    title: str,
    message: str,
    link: str = None,
    metadata: dict = None
):
    """Saves notification to DB and pushes it via WebSocket."""
    db = await get_database()

    notif_doc = {
        "recipient_email": recipient_email,
        "recipient_type": recipient_type,
        "type": notif_type.value,
        "title": title,
        "message": message,
        "link": link,
        "metadata": metadata or {},
        "is_read": False,
        "created_at": datetime.utcnow(),
    }

    result = await db.notifications.insert_one(notif_doc)

    # Prepare the data to send via WebSocket
    ws_payload = {
        "id": str(result.inserted_id),
        "type": notif_type.value,
        "title": title,
        "message": message,
        "link": link,
        "is_read": False,
        "created_at": datetime.utcnow().isoformat(),
        "metadata": metadata or {},
    }

    # Push to recipient in real-time
    if recipient_email == "admin":
        await manager.broadcast_to_admins(ws_payload)
    else:
        await manager.send_to_user(recipient_email, ws_payload)

    return str(result.inserted_id)


# ──────────────────────────────────────────────────────
# WebSocket Endpoint
# ──────────────────────────────────────────────────────
@router.websocket("/ws/{email}")
async def websocket_endpoint(websocket: WebSocket, email: str):
    await manager.connect(websocket, email)
    try:
        while True:
            # Keep connection alive; client can send pings
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket, email)


# ──────────────────────────────────────────────────────
# REST Endpoints
# ──────────────────────────────────────────────────────
@router.get("/{email}")
async def get_notifications(email: str, limit: int = 30, unread_only: bool = False):
    """Get notifications for a user by email."""
    db = await get_database()

    if email.startswith("admin"):
        query = {"recipient_email": {"$in": [email, "admin"]}}
    else:
        query = {"recipient_email": email}
        
    if unread_only:
        query["is_read"] = False

    notifications = await db.notifications.find(query).sort("created_at", -1).to_list(length=limit)

    result = []
    for n in notifications:
        result.append({
            "id": str(n["_id"]),
            "type": n["type"],
            "title": n["title"],
            "message": n["message"],
            "link": n.get("link"),
            "is_read": n.get("is_read", False),
            "created_at": n["created_at"].isoformat() if n.get("created_at") else None,
            "metadata": n.get("metadata", {}),
        })

    # Use the same query logic for unread count, but make sure to only look for unread
    count_query = query.copy()
    count_query["is_read"] = False
    unread_count = await db.notifications.count_documents(count_query)

    return {"notifications": result, "unread_count": unread_count}


@router.put("/{notification_id}/read")
async def mark_as_read(notification_id: str):
    """Mark a single notification as read."""
    db = await get_database()
    try:
        await db.notifications.update_one(
            {"_id": ObjectId(notification_id)},
            {"$set": {"is_read": True}}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid notification ID")
    return {"message": "Marked as read"}


@router.put("/{email}/read-all")
async def mark_all_as_read(email: str):
    """Mark all notifications for a user as read."""
    db = await get_database()
    
    query = {"recipient_email": email, "is_read": False}
    if email.startswith("admin"):
        query = {"recipient_email": {"$in": [email, "admin"]}, "is_read": False}
        
    result = await db.notifications.update_many(
        query,
        {"$set": {"is_read": True}}
    )
    return {"message": f"Marked {result.modified_count} notifications as read"}


@router.delete("/{notification_id}")
async def delete_notification(notification_id: str):
    """Delete a specific notification."""
    db = await get_database()
    try:
        await db.notifications.delete_one({"_id": ObjectId(notification_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid notification ID")
    return {"message": "Notification deleted"}
