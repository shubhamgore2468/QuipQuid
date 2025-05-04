from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings
#motor connects on demand
class MongoDB:
    client: AsyncIOMotorClient = None
    @classmethod
    async def connect_to_mongo(cls):
        cls.client = AsyncIOMotorClient(settings.MONGODB_URL)

    @classmethod
    async def close_mongo_connection(cls):
        cls.client.close()

    @classmethod
    def get_database(cls):
        return cls.client.budget_tracker

    @classmethod
    def get_chat_collections(cls):
        return cls.get_database().chat_history