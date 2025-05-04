from datetime import datetime, date
from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID

class BillItem(BaseModel):
    category: str
    name: str
    price: float
    quantity: int = Field(default=1, ge=1)

class Bill(BaseModel):
    bill_id: UUID
    merchant_name: str
    date: date
    created_at: datetime
    items: List[BillItem]
    total: float
    category: str
    description: Optional[str] = None

    # For splitting functionality
class SplitBillItem(BillItem):
    split_between: List[str]  # List of user IDs or usernames
    amount_per_person: Optional[float] = None  # Calculated amount each person pays

class BillSplitModel(BaseModel):
    bill: Bill
    split_items: List[SplitBillItem]
    users: List[str]  # All users involved in the split
    
    class Config:
        from_attributes = True

# Request model for split_item endpoint
class SplitItemRequest(BaseModel):
    bill_id: UUID
    item: BillItem
    users: List[int]  # Users to split this item between
    merchant_name: str
    date: Optional[datetime] = None  # Date of the bill item

class UserBill(BaseModel):
    user_id: str
    total_split_amount: float