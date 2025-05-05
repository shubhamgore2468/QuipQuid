# backend/app/init_db.py

import sys
import os

# Add the parent directory to Python path to make imports work
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from app.db.postgresql import Base, engine
from app.models.user import User
from app.models.expense import Expense
from app.models.transactions import Transaction
from app.models.budget import Budget
from app.models.goal import Goal

def init_db():
    """Initialize the database by creating all tables."""
    print("Creating database tables...")
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
        
        # Show created tables
        print("\nCreated tables:")
        for table in Base.metadata.tables:
            print(f"  - {table}")
            
    except Exception as e:
        print(f"Error creating tables: {str(e)}")
        raise

if __name__ == "__main__":
    init_db()