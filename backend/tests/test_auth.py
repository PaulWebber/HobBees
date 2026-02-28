"""Basic test for authentication endpoints."""
import pytest
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.models.user import User


@pytest.mark.asyncio
async def test_user_registration(test_db, test_user_data):
    """Test user registration."""
    user_repo = UserRepository(test_db)
    auth_service = AuthService(user_repo)
    
    from app.schemas.auth import UserRegister
    user_data = UserRegister(**test_user_data)
    
    user = await auth_service.register_user(user_data)
    
    assert user.username == test_user_data["username"]
    assert user.email == test_user_data["email"]
    assert user.is_active is True


@pytest.mark.asyncio
async def test_user_authentication(test_db, test_user_data):
    """Test user authentication."""
    user_repo = UserRepository(test_db)
    auth_service = AuthService(user_repo)
    
    # Register user first
    from app.schemas.auth import UserRegister
    user_data = UserRegister(**test_user_data)
    await auth_service.register_user(user_data)
    
    # Authenticate
    authenticated_user = await auth_service.authenticate_user(
        test_user_data["username"],
        test_user_data["password"]
    )
    
    assert authenticated_user is not None
    assert authenticated_user.username == test_user_data["username"]


@pytest.mark.asyncio
async def test_user_authentication_wrong_password(test_db, test_user_data):
    """Test authentication with wrong password."""
    user_repo = UserRepository(test_db)
    auth_service = AuthService(user_repo)
    
    # Register user first
    from app.schemas.auth import UserRegister
    user_data = UserRegister(**test_user_data)
    await auth_service.register_user(user_data)
    
    # Try to authenticate with wrong password
    authenticated_user = await auth_service.authenticate_user(
        test_user_data["username"],
        "WrongPassword123!"
    )
    
    assert authenticated_user is None
