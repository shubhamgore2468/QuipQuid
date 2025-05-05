from sqlalchemy import Column, Integer, String, Float, DateTime, Date, Enum
from sqlalchemy.sql import func
from db.postgresql import Base

class Goal(Base):
    __tablename__ = 'goals'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, nullable=False, default=0)
    deadline = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())