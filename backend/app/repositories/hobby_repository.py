"""Hobby repository for database operations."""
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from ..models.hobby import Hobby, Category, SubCategoryItem, CategorySchema
from bson import ObjectId
from datetime import datetime


class HobbyRepository:
    """Repository for hobby database operations."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.hobbies
    
    async def create_hobby(self, hobby: Hobby) -> Hobby:
        """Create a new hobby in the database."""
        hobby_dict = hobby.model_dump(by_alias=True, exclude={"id"})
        result = await self.collection.insert_one(hobby_dict)
        hobby_dict["_id"] = result.inserted_id
        return Hobby(**hobby_dict)
    
    async def get_hobby_by_id(self, hobby_id: str, user_id: str) -> Optional[Hobby]:
        """Get hobby by ID for a specific user."""
        if not ObjectId.is_valid(hobby_id):
            return None
        
        hobby_dict = await self.collection.find_one({
            "_id": ObjectId(hobby_id),
            "user_id": user_id
        })
        if hobby_dict:
            return Hobby(**hobby_dict)
        return None
    
    async def get_hobbies_by_user(self, user_id: str) -> List[Hobby]:
        """Get all hobbies for a user."""
        cursor = self.collection.find({"user_id": user_id})
        hobbies = []
        async for hobby_dict in cursor:
            hobbies.append(Hobby(**hobby_dict))
        return hobbies
    
    async def update_hobby(self, hobby_id: str, user_id: str, update_data: dict) -> Optional[Hobby]:
        """Update hobby information."""
        if not ObjectId.is_valid(hobby_id):
            return None
        
        update_data["updated_at"] = datetime.utcnow()
        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(hobby_id), "user_id": user_id},
            {"$set": update_data},
            return_document=True
        )
        if result:
            return Hobby(**result)
        return None
    
    async def delete_hobby(self, hobby_id: str, user_id: str) -> bool:
        """Delete a hobby."""
        if not ObjectId.is_valid(hobby_id):
            return False
        
        result = await self.collection.delete_one({
            "_id": ObjectId(hobby_id),
            "user_id": user_id
        })
        return result.deleted_count > 0
    
    async def add_category(self, hobby_id: str, user_id: str, category: Category) -> Optional[Hobby]:
        """Add a category to a hobby."""
        if not ObjectId.is_valid(hobby_id):
            return None
        
        category_dict = category.model_dump()
        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(hobby_id), "user_id": user_id},
            {
                "$push": {"categories": category_dict},
                "$set": {"updated_at": datetime.utcnow()}
            },
            return_document=True
        )
        if result:
            return Hobby(**result)
        return None
    
    async def update_category(self, hobby_id: str, user_id: str, category_name: str, 
                            update_data: dict) -> Optional[Hobby]:
        """Update a category in a hobby."""
        if not ObjectId.is_valid(hobby_id):
            return None
        
        update_dict = {f"categories.$.{k}": v for k, v in update_data.items()}
        update_dict["updated_at"] = datetime.utcnow()
        
        result = await self.collection.find_one_and_update(
            {
                "_id": ObjectId(hobby_id),
                "user_id": user_id,
                "categories.name": category_name
            },
            {"$set": update_dict},
            return_document=True
        )
        if result:
            return Hobby(**result)
        return None
    
    async def delete_category(self, hobby_id: str, user_id: str, category_name: str) -> Optional[Hobby]:
        """Delete a category from a hobby."""
        if not ObjectId.is_valid(hobby_id):
            return None
        
        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(hobby_id), "user_id": user_id},
            {
                "$pull": {"categories": {"name": category_name}},
                "$set": {"updated_at": datetime.utcnow()}
            },
            return_document=True
        )
        if result:
            return Hobby(**result)
        return None
    
    async def add_item_to_category(self, hobby_id: str, user_id: str, category_name: str,
                                   item: SubCategoryItem) -> Optional[Hobby]:
        """Add an item to a category."""
        if not ObjectId.is_valid(hobby_id):
            return None
        
        item_dict = item.model_dump()
        result = await self.collection.find_one_and_update(
            {
                "_id": ObjectId(hobby_id),
                "user_id": user_id,
                "categories.name": category_name
            },
            {
                "$push": {"categories.$.items": item_dict},
                "$set": {"updated_at": datetime.utcnow()}
            },
            return_document=True
        )
        if result:
            return Hobby(**result)
        return None
    
    async def update_item_in_category(self, hobby_id: str, user_id: str, category_name: str,
                                     item_id: str, update_data: dict) -> Optional[Hobby]:
        """Update an item in a category."""
        if not ObjectId.is_valid(hobby_id):
            return None
        
        update_data["updated_at"] = datetime.utcnow()
        result = await self.collection.find_one_and_update(
            {
                "_id": ObjectId(hobby_id),
                "user_id": user_id,
                "categories.name": category_name,
                "categories.items.id": item_id
            },
            {
                "$set": {
                    "categories.$[cat].items.$[item].data": update_data.get("data"),
                    "categories.$[cat].items.$[item].updated_at": update_data.get("updated_at"),
                    "updated_at": datetime.utcnow()
                }
            },
            array_filters=[
                {"cat.name": category_name},
                {"item.id": item_id}
            ],
            return_document=True
        )
        if result:
            return Hobby(**result)
        return None
    
    async def delete_item_from_category(self, hobby_id: str, user_id: str, category_name: str,
                                       item_id: str) -> Optional[Hobby]:
        """Delete an item from a category."""
        if not ObjectId.is_valid(hobby_id):
            return None
        
        result = await self.collection.find_one_and_update(
            {
                "_id": ObjectId(hobby_id),
                "user_id": user_id,
                "categories.name": category_name
            },
            {
                "$pull": {"categories.$.items": {"id": item_id}},
                "$set": {"updated_at": datetime.utcnow()}
            },
            return_document=True
        )
        if result:
            return Hobby(**result)
        return None
