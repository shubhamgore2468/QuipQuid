from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.postgresql import Base
import enum

class ExpenseType(str, enum.Enum):
    TEXT = "text"
    AUDIO = "audio"
    IMAGE = "image"
    PLAID = "plaid"

class ExpenseCategory(str, Enum):
    ''' can be added moerw acc. to the user preferences'''
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

class Expense(Base):
    __tablename__ = 'expenses'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=False)
    category = Column(Enum(ExpenseCategory), nullable=False)
    input_type = Column(Enum(ExpenseType), nullable=False)
    merchant = Column(String, nullable=True)
    date = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    raw_data = Column(String, nullable=True)  # For storing image/audio files
    processed_text = Column(String, nullable=True)  # For storing extracted text
    
    user = relationship("User", backref="expenses") 