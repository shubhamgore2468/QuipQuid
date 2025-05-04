from pydantic import BaseModel, Field, EmailStr, HttpUrl, condecimal
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum
from decimal import Decimal

class ExpenseCategory(str, Enum):
    FOOD = "food"
    TRANSPORTATION = "transportation"
    HOUSING = "housing"
    UTILITIES = "utilities"
    ENTERTAINMENT = "entertainment"
    HEALTHCARE = "healthcare"
    SHOPPING = "shopping"
    EDUCATION = "education"
    PERSONAL = "personal"
    SAVINGS = "savings"
    INVESTMENTS = "investments"
    OTHER = "other"

class InputType(str, Enum):
    TEXT = "text"
    AUDIO = "audio"
    IMAGE = "image"

class ExpenseBase(BaseModel):
    amount: float = Field(..., description="Expense amount")
    category: ExpenseCategory
    description: Optional[str] = None
    merchant: Optional[str] = None
    date: datetime = Field(default_factory=datetime.utcnow)
    tags: List[str] = Field(default_factory=list)
    
class ExpenseCreate(ExpenseBase):
    input_type: InputType
    raw_input: str  # Store original text, audio file path, or image path
    processed_data: Optional[Dict[str, Any]] = None  # RAG processed data
    
class Expense(ExpenseBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    input_type: InputType
    embedding_id: Optional[str] = None  # Reference to Neo4j embedding
    
    class Config:
        from_attributes = True