"""Pytest configuration and fixtures."""
import pytest
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the event loop for the session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def test_db():
    """Create a test database."""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[f"{settings.DATABASE_NAME}_test"]
    
    yield db
    
    # Cleanup
    await client.drop_database(f"{settings.DATABASE_NAME}_test")
    client.close()


@pytest.fixture
def test_user_data():
    """Sample user data for testing."""
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "TestPassword123!"
    }


@pytest.fixture
def test_hobby_data():
    """Sample hobby data for testing."""
    return {
        "name": "Test Hobby",
        "description": "A test hobby for unit testing"
    }
