import sys
sys.path.append("..")

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.postgresql import Base
import enum

class ExpenseType(str, enum.Enum):
    TEXT = "text"
    AUDIO = "audio"
    IMAGE = "image"
    PLAID = "plaid"

class ExpenseCategory(str, enum.Enum):
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
    
    # Use the values of the Enum, not the Enum class itself
    category = Column(Enum(ExpenseCategory, values_callable=lambda x: [e.value for e in x]), nullable=False)
    input_type = Column(Enum(ExpenseType, values_callable=lambda x: [e.value for e in x]), nullable=False)
    
    merchant = Column(String, nullable=True)
    date = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    raw_data = Column(String, nullable=True)  # For storing image/audio files
    processed_text = Column(String, nullable=True)  # For storing extracted text
    
    # Relationship with User model
    user = relationship("User", back_populates="expenses")