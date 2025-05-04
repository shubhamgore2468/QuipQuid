import sys
sys.path.append("..")

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.postgresql import Base
from app.schemas.expense import ExpenseCategory

class Transaction(Base):
    __tablename__ = 'transactions'
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, index=True)
    bill_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Item details
    item_name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)  # Amount this user owes for this item
    
    # Bill details
    merchant_name = Column(String, nullable=False)
    category = Column(Enum(ExpenseCategory, values_callable=lambda x: [e.value for e in x]), nullable=False)
    transaction_date = Column(DateTime(timezone=True), nullable=False)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship with User model
    user = relationship("User", back_populates="transactions")