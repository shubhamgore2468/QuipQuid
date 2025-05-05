from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from enum import Enum
from expense import ExpenseCategory

# Budget models
class BudgetBase(BaseModel):
    expense_category: ExpenseCategory
    percentage: Optional[float] = None
    amount: float
    start_date: date
    end_date: date

class BudgetCreate(BudgetBase):
    pass

class Budget(BudgetBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True