# backend/app/init_db.py

import sys
sys.path.append(".")

from db.postgresql import Base, engine
from models.user import User
from models.expense import Expense
from models.transactions import Transaction

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