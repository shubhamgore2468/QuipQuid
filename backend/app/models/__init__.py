# Import all models here to ensure they are registered with SQLAlchemy
# This helps avoid circular import issues and ensures all models are available
# when SQLAlchemy tries to resolve relationships

from app.db.postgresql import Base
from app.models.user import User
from app.models.expense import Expense, ExpenseCategory, ExpenseType
from app.models.transactions import Transaction

# Make sure all models are available for import
__all__ = [
    'Base',
    'User', 
    'Expense', 
    'Transaction',
    'ExpenseCategory',
    'ExpenseType'
]