# backend/app/setup_test_environment.py

import sys
sys.path.append(".")

import asyncio
from datetime import datetime, timedelta, timezone
import random
import uuid
from sqlalchemy import inspect, text

from db.postgresql import Base, engine, SessionLocal
from db.mongodb import MongoDB
from models.user import User
from models.expense import Expense, ExpenseCategory, ExpenseType
from utils.generate_chat_history import ChatHistoryGenerator

# Test data
TEST_USERS = [
    {
        "email": "test@example.com",
        "full_name": "Test User",
        "password": "testpassword123"
    },
    {
        "email": "demo@example.com", 
        "full_name": "Demo User",
        "password": "demopassword123"
    }
]

TEST_EXPENSES = [
    {
        "amount": 45.99,
        "description": "Lunch at Chipotle",
        "category": ExpenseCategory.FOOD,
        "merchant": "Chipotle",
        "input_type": ExpenseType.TEXT
    },
    {
        "amount": 150.00,
        "description": "Monthly gym membership",
        "category": ExpenseCategory.HEALTHCARE,
        "merchant": "LA Fitness",
        "input_type": ExpenseType.PLAID
    },
    {
        "amount": 89.99,
        "description": "New headphones",
        "category": ExpenseCategory.SHOPPING,
        "merchant": "Best Buy",
        "input_type": ExpenseType.IMAGE,
        "raw_data": "receipt_image_001.jpg"
    },
    {
        "amount": 35.00,
        "description": "Uber ride to airport",
        "category": ExpenseCategory.TRANSPORTATION,
        "merchant": "Uber",
        "input_type": ExpenseType.PLAID
    },
    {
        "amount": 15.99,
        "description": "Netflix subscription",
        "category": ExpenseCategory.ENTERTAINMENT,
        "merchant": "Netflix",
        "input_type": ExpenseType.PLAID
    }
]

TEST_CHAT_SESSIONS = [
    {
        "messages": [
            {
                "role": "user",
                "content": "How much did I spend on food this month?",
                "timestamp": datetime.now(timezone.utc) - timedelta(minutes=10)
            },
            {
                "role": "assistant",
                "content": "Based on your expenses this month, you've spent $45.99 on food. This includes your lunch at Chipotle. Would you like to see a breakdown by merchant or see how this compares to previous months?",
                "timestamp": datetime.now(timezone.utc) - timedelta(minutes=9)
            },
            {
                "role": "user",
                "content": "Yes, show me how it compares to last month",
                "timestamp": datetime.now(timezone.utc) - timedelta(minutes=8)
            },
            {
                "role": "assistant",
                "content": "Comparing your food expenses:\n- This month: $45.99\n- Last month: $320.45\n\nYou've spent significantly less on food this month. Would you like me to project your monthly food spending based on current trends?",
                "timestamp": datetime.now(timezone.utc) - timedelta(minutes=7)
            }
        ],
        "context": {
            "analyzed_category": "food",
            "current_month_total": 45.99,
            "last_month_total": 320.45
        }
    }
]

def init_database():
    """Initialize the database by creating all tables."""
    print("Initializing database...")
    
    try:
        # First check connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection successful")
        
        # Check if tables exist
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        
        if 'users' not in existing_tables or 'expenses' not in existing_tables:
            print("Creating database tables...")
            Base.metadata.create_all(bind=engine)
            print("✅ Database tables created successfully!")
        else:
            print("✅ Database tables already exist")
            
        # List all tables
        print("\nExisting tables:")
        for table in inspector.get_table_names():
            print(f"  - {table}")
            
    except Exception as e:
        print(f"❌ Error initializing database: {str(e)}")
        raise

async def clear_existing_data():
    """Clear existing test data."""
    print("Clearing existing test data...")
    
    db = SessionLocal()
    try:
        # Delete expenses first (foreign key constraint)
        deleted_expenses = db.query(Expense).delete()
        # Then delete users
        deleted_users = db.query(User).delete()
        db.commit()
        print(f"Deleted {deleted_expenses} expenses and {deleted_users} users")
    except Exception as e:
        db.rollback()
        print(f"Error clearing PostgreSQL data: {str(e)}")
    finally:
        db.close()
    
    # Clear MongoDB data
    try:
        await MongoDB.connect_to_mongo()
        chat_collection = MongoDB.get_chat_collections()
        result = await chat_collection.delete_many({})
        print(f"Deleted {result.deleted_count} chat sessions from MongoDB")
    except Exception as e:
        print(f"Error clearing MongoDB data: {str(e)}")
    finally:
        await MongoDB.close_mongo_connection()

async def populate_test_data():
    """Populate databases with test data."""
    print("\nPopulating test data...")
    
    db = SessionLocal()
    created_users = []
    
    try:
        # Create test users
        for user_data in TEST_USERS:
            user = User(
                email=user_data["email"],
                full_name=user_data["full_name"],
                hashed_password=f"hashed_{user_data['password']}",
                is_active=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            db.add(user)
            db.flush()  # Get the user ID
            created_users.append(user)
            print(f"Created user: {user.email} (ID: {user.id})")
        
        db.commit()
        
        # Create test expenses for the first user
        test_user = created_users[0]
        for expense_data in TEST_EXPENSES:
            expense = Expense(
                user_id=test_user.id,
                amount=expense_data["amount"],
                description=expense_data["description"],
                category=expense_data["category"],
                merchant=expense_data["merchant"],
                input_type=expense_data["input_type"],
                date=datetime.now(timezone.utc) - timedelta(days=random.randint(0, 30)),
                created_at=datetime.now(timezone.utc),
                raw_data=expense_data.get("raw_data"),
                processed_text=f"Processed: {expense_data['description']}"
            )
            db.add(expense)
        
        db.commit()
        print(f"Created {len(TEST_EXPENSES)} expenses for {test_user.email}")
        
    except Exception as e:
        db.rollback()
        print(f"Error creating PostgreSQL data: {str(e)}")
        raise
    finally:
        db.close()
    
    # Create MongoDB data using enhanced chat generator
    try:
        # Use the enhanced chat history generator
        chat_generator = ChatHistoryGenerator()
        user_ids = [user.id for user in created_users]
        
        print("\nGenerating diverse chat histories...")
        await chat_generator.generate_chat_histories(user_ids, sessions_per_user=7)
        
    except Exception as e:
        print(f"Error creating MongoDB data: {str(e)}")
        raise

async def main():
    """Main setup function."""
    print("=== Budget Tracker Test Environment Setup ===\n")
    
    try:
        # Step 1: Initialize database
        init_database()
        
        # Step 2: Clear existing data (optional)
        clear_data = input("\nDo you want to clear existing data? (y/n): ").lower() == 'y'
        if clear_data:
            await clear_existing_data()
        
        # Step 3: Populate test data
        await populate_test_data()
        
        print("\n✅ Test environment setup completed successfully!")
        print("\nTest credentials:")
        for user in TEST_USERS:
            print(f"  - Email: {user['email']} | Password: {user['password']}")
        
    except Exception as e:
        print(f"\n❌ Setup failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())