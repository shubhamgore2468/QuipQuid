from pydantic import BaseModel, Field, EmailStr, HttpUrl, condecimal
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum
from decimal import Decimal

class ChatRole(str, Enum):
    USER = "user"

class ChatMessage(BaseModel):
    role: ChatRole
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None

class ChatSession(BaseModel):
    session_id: str
    user_id: int
    messages: List[ChatMessage]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    context: Optional[Dict[str, Any]] = None