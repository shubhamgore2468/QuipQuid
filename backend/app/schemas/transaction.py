from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID
from app.schemas.expense import ExpenseCategory


# Base schema with common fields
class TransactionBase(BaseModel):
    item_name: str
    unit_price: float = Field(gt=0, description="Price per unit")
    quantity: int = Field(gt=0, description="Quantity of items")
    amount: float = Field(gt=0, description="Amount this user owes for this item")
    merchant_name: str
    category: ExpenseCategory
    transaction_date: datetime


# Schema for creating a new transaction
class TransactionCreate(TransactionBase):
    bill_id: UUID
    user_id: int


# Schema for updating a transaction
class TransactionUpdate(BaseModel):
    item_name: Optional[str] = None
    unit_price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, gt=0)
    amount: Optional[float] = Field(None, gt=0)
    merchant_name: Optional[str] = None
    category: Optional[ExpenseCategory] = None
    transaction_date: Optional[datetime] = None


# Schema for transaction response
class Transaction(TransactionBase):
    id: int
    bill_id: UUID
    user_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# Schema for transaction with user details (if needed)
class TransactionWithUser(Transaction):
    user: Optional[dict] = None  # You can replace this with a UserSchema if you have one


# Schema for listing transactions with filters
class TransactionFilter(BaseModel):
    bill_id: Optional[UUID] = None
    user_id: Optional[int] = None
    category: Optional[ExpenseCategory] = None
    merchant_name: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None


class UserTransactionSummary(BaseModel):
    user_id: int
    bill_id: UUID
    total_amount: float
    transaction_count: int
    transactions: List[Transaction]

    model_config = ConfigDict(from_attributes=True)