"""Authentication service."""
from typing import Optional
from datetime import timedelta
from ..models.user import User
from ..repositories.user_repository import UserRepository
from ..schemas.auth import UserRegister, Token, TokenData
from ..utils.security import verify_password, get_password_hash, create_access_token, decode_access_token
from ..config import settings
from fastapi import HTTPException, status


class AuthService:
    """Service for authentication operations."""
    
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
    
    async def register_user(self, user_data: UserRegister) -> User:
        """Register a new user."""
        # Check if username already exists
        existing_user = await self.user_repository.get_user_by_username(user_data.username)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        
        # Check if email already exists
        existing_email = await self.user_repository.get_user_by_email(user_data.email)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password,
            is_active=True
        )
        
        return await self.user_repository.create_user(new_user)
    
    async def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """Authenticate a user by username and password."""
        user = await self.user_repository.get_user_by_username(username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        if not user.is_active:
            return None
        return user
    
    def create_token_for_user(self, user: User) -> Token:
        """Create an access token for a user."""
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username, "user_id": str(user.id)},
            expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")
    
    async def get_current_user(self, token: str) -> User:
        """Get current user from JWT token."""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        payload = decode_access_token(token)
        if payload is None:
            raise credentials_exception
        
        username: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        
        if username is None or user_id is None:
            raise credentials_exception
        
        user = await self.user_repository.get_user_by_username(username)
        if user is None:
            raise credentials_exception
        
        return user
