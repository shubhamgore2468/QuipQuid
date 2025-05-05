from sqlalchemy import Column, Integer, String, Float, DateTime, Date, Enum, ForeignKey
from sqlalchemy.sql import func
from db.postgresql import Base
from models.expense import ExpenseCategory

class Budget(Base):
    __tablename__ = 'budgets'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    expense_category = Column(Enum(ExpenseCategory, values_callable=lambda x: [e.value for e in x]), nullable=False)
    percentage = Column(Float, nullable=True)
    amount = Column(Float, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())