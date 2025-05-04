from datetime import datetime, date
from pydantic import BaseModel, Field
from typing import List, Optional

class BillItem(BaseModel):
    name: str
    price: float
    quantity: int = Field(default=1, ge=1)

class Bill(BaseModel):
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
    item: BillItem
    users: List[str]  # Users to split this item between