"""MongoDB database connection and initialization."""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .config import settings
import logging

logger = logging.getLogger(__name__)


class Database:
    """MongoDB database connection manager."""
    
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None


# Global database instance
database = Database()


async def connect_to_mongo():
    """Establish connection to MongoDB and create indexes."""
    logger.info(f"Connecting to MongoDB at {settings.MONGODB_URL}")
    database.client = AsyncIOMotorClient(settings.MONGODB_URL)
    database.db = database.client[settings.DATABASE_NAME]
    
    # Create indexes for better query performance
    try:
        # Users collection indexes
        await database.db.users.create_index("username", unique=True)
        await database.db.users.create_index("email", unique=True)
        
        # Hobbies collection indexes
        await database.db.hobbies.create_index([("user_id", 1), ("name", 1)])
        await database.db.hobbies.create_index("user_id")
        
        logger.info("Database indexes created successfully")
    except Exception as e:
        logger.warning(f"Error creating indexes: {e}")
    
    logger.info("Connected to MongoDB successfully")


async def close_mongo_connection():
    """Close MongoDB connection."""
    logger.info("Closing MongoDB connection")
    if database.client:
        database.client.close()
    logger.info("MongoDB connection closed")


def get_database() -> AsyncIOMotorDatabase:
    """Get database instance."""
    return database.db
