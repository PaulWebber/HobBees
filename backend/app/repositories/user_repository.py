"""User repository for database operations."""
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from ..models.user import User
from bson import ObjectId


class UserRepository:
    """Repository for user database operations."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.users
    
    async def create_user(self, user: User) -> User:
        """Create a new user in the database."""
        user_dict = user.model_dump(by_alias=True, exclude={"id"})
        result = await self.collection.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        return User(**user_dict)
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        if not ObjectId.is_valid(user_id):
            return None
        
        user_dict = await self.collection.find_one({"_id": ObjectId(user_id)})
        if user_dict:
            return User(**user_dict)
        return None
    
    async def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        user_dict = await self.collection.find_one({"username": username})
        if user_dict:
            return User(**user_dict)
        return None
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        user_dict = await self.collection.find_one({"email": email})
        if user_dict:
            return User(**user_dict)
        return None
    
    async def update_user(self, user_id: str, update_data: dict) -> Optional[User]:
        """Update user information."""
        if not ObjectId.is_valid(user_id):
            return None
        
        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {"$set": update_data},
            return_document=True
        )
        if result:
            return User(**result)
        return None
    
    async def delete_user(self, user_id: str) -> bool:
        """Delete a user."""
        if not ObjectId.is_valid(user_id):
            return False
        
        result = await self.collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0
