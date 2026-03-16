"""Authentication endpoint tests."""
import pytest
from fastapi import HTTPException
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.schemas.auth import UserRegister


@pytest.mark.asyncio
async def test_user_registration(test_db, test_user_data):
    """Test user registration."""
    user_repo = UserRepository(test_db)
    auth_service = AuthService(user_repo)
    
    user_data = UserRegister(**test_user_data)
    user = await auth_service.register_user(user_data)
    
    assert user.username == test_user_data["username"]
    assert user.email == test_user_data["email"]
    assert user.is_active is True
    assert user.hashed_password != test_user_data["password"]  # Password should be hashed


@pytest.mark.asyncio
async def test_duplicate_username_registration(test_db, test_user_data):
    """Test registration with duplicate username."""
    user_repo = UserRepository(test_db)
    auth_service = AuthService(user_repo)
    
    user_data = UserRegister(**test_user_data)
    await auth_service.register_user(user_data)
    
    # Try to register again with same username
    with pytest.raises(HTTPException) as exc_info:
        await auth_service.register_user(user_data)
    
    assert exc_info.value.status_code == 400
    assert "already registered" in exc_info.value.detail.lower()


@pytest.mark.asyncio
async def test_duplicate_email_registration(test_db, test_user_data):
    """Test registration with duplicate email."""
    user_repo = UserRepository(test_db)
    auth_service = AuthService(user_repo)
    
    user_data = UserRegister(**test_user_data)
    await auth_service.register_user(user_data)
    
    # Try to register with same email but different username
    duplicate_email_data = test_user_data.copy()
    duplicate_email_data["username"] = "different_user"
    user_data2 = UserRegister(**duplicate_email_data)
    
    with pytest.raises(HTTPException) as exc_info:
        await auth_service.register_user(user_data2)
    
    assert exc_info.value.status_code == 400
    assert "already registered" in exc_info.value.detail.lower()


@pytest.mark.asyncio
async def test_user_authentication(test_db, test_user_data):
    """Test user authentication."""
    user_repo = UserRepository(test_db)
    auth_service = AuthService(user_repo)
    
    # Register user first
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
    user_data = UserRegister(**test_user_data)
    await auth_service.register_user(user_data)
    
    # Try to authenticate with wrong password
    authenticated_user = await auth_service.authenticate_user(
        test_user_data["username"],
        "WrongPassword123!"
    )
    
    assert authenticated_user is None


@pytest.mark.asyncio
async def test_user_authentication_nonexistent_user(test_db):
    """Test authentication with nonexistent user."""
    user_repo = UserRepository(test_db)
    auth_service = AuthService(user_repo)
    
    authenticated_user = await auth_service.authenticate_user(
        "nonexistent_user",
        "SomePassword123!"
    )
    
    assert authenticated_user is None


@pytest.mark.asyncio
async def test_create_token_for_user(test_db, test_user_data):
    """Test JWT token creation."""
    user_repo = UserRepository(test_db)
    auth_service = AuthService(user_repo)
    
    # Register and authenticate user
    user_data = UserRegister(**test_user_data)
    user = await auth_service.register_user(user_data)
    
    # Create token
    token = auth_service.create_token_for_user(user)
    
    assert token.access_token is not None
    assert token.token_type == "bearer"
    assert len(token.access_token) > 0


@pytest.mark.asyncio
async def test_password_validation_too_short(test_db):
    """Test password validation - too short."""
    from pydantic import ValidationError
    
    with pytest.raises(ValidationError) as exc_info:
        UserRegister(
            username="testuser",
            email="test@example.com",
            password="short"  # Too short
        )
    
    assert "at least 8 characters" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_password_validation_too_long(test_db):
    """Test password validation - exceeds byte limit."""
    from pydantic import ValidationError
    
    # Create a password that exceeds 72 bytes
    long_password = "x" * 73
    
    with pytest.raises(ValidationError) as exc_info:
        UserRegister(
            username="testuser",
            email="test@example.com",
            password=long_password
        )
    
    assert "72 bytes" in str(exc_info.value).lower()
