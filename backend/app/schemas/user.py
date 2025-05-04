from pydantic import BaseModel, Field, EmailStr, HttpUrl, condecimal
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum
from decimal import Decimal

# Base Models
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    
class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool = True
    
    class Config:
        from_attributes = True