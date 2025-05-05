from pydantic import BaseModel, Field
from datetime import date, datetime

class GoalBase(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0
    deadline: date

class GoalCreate(GoalBase):
    pass

class Goal(GoalBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True