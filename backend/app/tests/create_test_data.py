# backend/app/tests/create_test_data.py

import sys
sys.path.append("..")

import asyncio
from datetime import datetime, timedelta, timezone
import random
import uuid

from sqlalchemy.orm import Session
from sqlalchemy import inspect
from db.postgresql import SessionLocal, engine, Base
from db.mongodb import MongoDB
from models.user import User
from models.expense import Expense, ExpenseCategory, ExpenseType
from models.chat import ChatMessage, ChatSession

# Test user credentials for development
TEST_USERS = [
    {
        "email": "test@example.com",
        "full_name": "Test User",
        "password": "testpassword123"  # In real app, this would be hashed
    },
    {
        "email": "demo@example.com", 
        "full_name": "Demo User",
        "password": "demopassword123"
    }
]

# Quick test expenses
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

# Test chat sessions
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
                "content": "Comparing your food expenses:\n- This month: $45.99\n- Last month: $320.45\n\nYou've spent significantly less on food this month. This could be because we're only [current_date] into the month. Would you like me to project your monthly food spending based on current trends?",
                "timestamp": datetime.now(timezone.utc) - timedelta(minutes=7)
            }
        ],
        "context": {
            "analyzed_category": "food",
            "current_month_total": 45.99,
            "last_month_total": 320.45
        }
    },
    {
        "messages": [
            {
                "role": "user",
                "content": "I need help creating a budget for next month",
                "timestamp": datetime.now(timezone.utc) - timedelta(hours=2)
            },
            {
                "role": "assistant",
                "content": "I'd be happy to help you create a budget for next month. Based on your spending patterns over the last 3 months, here's what I recommend:\n\n1. Food: $350 (avg: $340)\n2. Transportation: $120 (avg: $115)\n3. Entertainment: $100 (avg: $95)\n4. Shopping: $200 (avg: $180)\n5. Healthcare: $150 (consistent monthly)\n\nTotal recommended budget: $920\n\nWould you like to adjust any of these categories?",
                "timestamp": datetime.now(timezone.utc) - timedelta(hours=2) + timedelta(minutes=1)
            }
        ],
        "context": {
            "budget_type": "monthly",
            "recommended_budget": {
                "food": 350,
                "transportation": 120,
                "entertainment": 100,
                "shopping": 200,
                "healthcare": 150
            }
        }
    }
]

def check_and_create_tables():
    """Check if tables exist and create them if they don't."""
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    if 'users' not in existing_tables or 'expenses' not in existing_tables:
        print("Database tables not found. Creating tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
    else:
        print("✅ Database tables already exist")

async def create_test_data():
    """Create test data for development and testing."""
    print("Creating test data...")
    
    # Ensure database tables exist
    check_and_create_tables()
    
    # Create PostgreSQL data
    db = SessionLocal()
    try:
        # Create test users
        users = []
        for user_data in TEST_USERS:
            # In a real app, you'd hash the password
            user = User(
                email=user_data["email"],
                full_name=user_data["full_name"],
                hashed_password=f"hashed_{user_data['password']}",  # Mock hash
                is_active=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            db.add(user)
            db.flush()
            users.append(user)
            print(f"Created user: {user.email}")
        
        db.commit()
        
        # Create test expenses for the first user
        test_user = users[0]
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
    
    # Create MongoDB data
    try:
        await MongoDB.connect_to_mongo()
        chat_collection = MongoDB.get_chat_collections()
        
        # Create test chat sessions for the first user
        test_user_id = users[0].id
        for session_data in TEST_CHAT_SESSIONS:
            chat_session = {
                "user_id": test_user_id,
                "session_id": str(uuid.uuid4()),
                "messages": session_data["messages"],
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
                "context": session_data["context"]
            }
            await chat_collection.insert_one(chat_session)
        
        print(f"Created {len(TEST_CHAT_SESSIONS)} chat sessions for user ID {test_user_id}")
        
    except Exception as e:
        print(f"Error creating MongoDB data: {str(e)}")
        raise
    finally:
        await MongoDB.close_mongo_connection()
    
    print("\n✅ Test data created successfully!")
    print("\nTest users:")
    for user in TEST_USERS:
        print(f"  - {user['email']} / {user['password']}")

if __name__ == "__main__":
    asyncio.run(create_test_data())