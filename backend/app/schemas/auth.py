"""Authentication request/response schemas."""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional


class UserRegister(BaseModel):
    """User registration request schema."""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    
    @field_validator('password')
    @classmethod
    def validate_password_bytes(cls, v: str) -> str:
        """Validate password doesn't exceed bcrypt's 72-byte limit."""
        if len(v.encode('utf-8')) > 72:
            raise ValueError(
                'Password is too long. Maximum is 72 bytes. '
                'Your password uses multibyte characters and exceeds this limit. '
                'Please use a shorter password.'
            )
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "john_doe",
                "email": "john@example.com",
                "password": "SecurePassword123!"
            }
        }


class UserLogin(BaseModel):
    """User login request schema."""
    username: str
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "john_doe",
                "password": "SecurePassword123!"
            }
        }


class Token(BaseModel):
    """JWT token response schema."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token payload data."""
    username: Optional[str] = None
    user_id: Optional[str] = None


class UserResponse(BaseModel):
    """User response schema (without sensitive data)."""
    id: str
    username: str
    email: str
    is_active: bool
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "username": "john_doe",
                "email": "john@example.com",
                "is_active": True
            }
        }
