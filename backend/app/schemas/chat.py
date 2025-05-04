from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatSession(BaseModel):
    user_id: int
    session_id: str
    messages: List[ChatMessage]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    context: Optional[dict] = None  # For storing RAG context
