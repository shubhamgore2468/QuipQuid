import sys
sys.path.append("..")  # Adjust the path to your project structure
import pytest
import asyncio
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from motor.motor_asyncio import AsyncIOMotorClient
from db.postgresql import engine, SessionLocal
from db.mongodb import MongoDB
from core.config import settings


class TestDatabaseConnections:
    """Test the database connections."""

    def test_postgresql_connection(self):
        """Test the PostgreSQL connection."""
        try:
            with engine.connect() as connection:
                result = connection.execute(text("SELECT 1"))
                assert result.scalar() == 1
            db = SessionLocal()
            try:
                result = db.execute(text("Select current_database()"))
                db_name = result.scalar()
                assert db_name is not None
                print(f"✓ PostgreSQL connection successful. Connected to database: {db_name}")
            finally:
                db.close()
                
        except OperationalError as e:
            pytest.fail(f"PostgreSQL connection failed: {str(e)}")
            db.close()

    @pytest.mark.asyncio
    async def test_monogodb_connection(self):
        """Test the MongoDB connection."""
        try:
            #create temp clioent for testing
            client = AsyncIOMotorClient(settings.MONGODB_URL)
            server_info = await client.server_info()
            assert server_info is not None

            db = client.budget_tracker
            collections = await db.list_collection_names()
            
            # Test write operation
            test_collection = db.test_collection
            result = await test_collection.insert_one({"test": "data"})
            assert result.inserted_id is not None
            
            # Clean up test data
            await test_collection.delete_one({"_id": result.inserted_id})
            
            client.close()
            print(f"✓ MongoDB connection successful. Server version: {server_info['version']}")
            
        except Exception as e:
            pytest.fail(f"MongoDB connection failed: {str(e)}")

# Run the tests
if __name__ == "__main__":
    test_instance = TestDatabaseConnections()

    # Run PostgreSQL test
    print("Testing PostgreSQL connection...")
    test_instance.test_postgresql_connection()

    # Run MongoDB test (async)
    print("Testing MongoDB connection...")
    asyncio.run(test_instance.test_mongodb_connection())