"""Hobby service for business logic."""
from typing import List, Optional
from fastapi import HTTPException, status
from ..models.hobby import Hobby, Category, SubCategoryItem, CategorySchema
from ..models.user import User
from ..repositories.hobby_repository import HobbyRepository
from ..schemas.hobby import (
    HobbyCreate, HobbyUpdate, CategoryCreate, CategoryUpdate,
    SubCategoryItemCreate, SubCategoryItemUpdate
)
from datetime import datetime


class HobbyService:
    """Service for hobby business logic."""
    
    def __init__(self, hobby_repository: HobbyRepository):
        self.hobby_repository = hobby_repository
    
    async def create_hobby(self, hobby_data: HobbyCreate, user: User) -> Hobby:
        """Create a new hobby for a user."""
        hobby = Hobby(
            user_id=str(user.id),
            name=hobby_data.name,
            description=hobby_data.description,
            categories=[]
        )
        return await self.hobby_repository.create_hobby(hobby)
    
    async def get_user_hobbies(self, user: User) -> List[Hobby]:
        """Get all hobbies for a user."""
        return await self.hobby_repository.get_hobbies_by_user(str(user.id))
    
    async def get_hobby(self, hobby_id: str, user: User) -> Hobby:
        """Get a specific hobby."""
        hobby = await self.hobby_repository.get_hobby_by_id(hobby_id, str(user.id))
        if not hobby:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hobby not found"
            )
        return hobby
    
    async def update_hobby(self, hobby_id: str, hobby_data: HobbyUpdate, user: User) -> Hobby:
        """Update a hobby."""
        hobby = await self.hobby_repository.get_hobby_by_id(hobby_id, str(user.id))
        if not hobby:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hobby not found"
            )
        
        update_data = hobby_data.model_dump(exclude_unset=True)
        if not update_data:
            return hobby
        
        updated_hobby = await self.hobby_repository.update_hobby(
            hobby_id, str(user.id), update_data
        )
        return updated_hobby
    
    async def delete_hobby(self, hobby_id: str, user: User) -> bool:
        """Delete a hobby."""
        hobby = await self.hobby_repository.get_hobby_by_id(hobby_id, str(user.id))
        if not hobby:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hobby not found"
            )
        
        return await self.hobby_repository.delete_hobby(hobby_id, str(user.id))
    
    async def add_category(self, hobby_id: str, category_data: CategoryCreate, user: User) -> Hobby:
        """Add a category to a hobby."""
        hobby = await self.hobby_repository.get_hobby_by_id(hobby_id, str(user.id))
        if not hobby:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hobby not found"
            )
        
        # Check if category name already exists
        for category in hobby.categories:
            if category.name == category_data.name:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Category '{category_data.name}' already exists"
                )
        
        # Create category with schema
        schema = CategorySchema(
            category_name=category_data.name,
            fields=category_data.fields
        )
        
        category = Category(
            name=category_data.name,
            schema=schema,
            items=[]
        )
        
        return await self.hobby_repository.add_category(hobby_id, str(user.id), category)
    
    async def update_category(self, hobby_id: str, category_name: str, 
                            category_data: CategoryUpdate, user: User) -> Hobby:
        """Update a category in a hobby."""
        hobby = await self.hobby_repository.get_hobby_by_id(hobby_id, str(user.id))
        if not hobby:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hobby not found"
            )
        
        # Check if category exists
        category_exists = any(cat.name == category_name for cat in hobby.categories)
        if not category_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category '{category_name}' not found"
            )
        
        update_data = category_data.model_dump(exclude_unset=True)
        if not update_data:
            return hobby
        
        # Update schema if fields are provided
        if "fields" in update_data:
            update_data["schema"] = CategorySchema(
                category_name=update_data.get("name", category_name),
                fields=update_data["fields"]
            ).model_dump()
            del update_data["fields"]
        
        update_data["updated_at"] = datetime.utcnow()
        
        return await self.hobby_repository.update_category(
            hobby_id, str(user.id), category_name, update_data
        )
    
    async def delete_category(self, hobby_id: str, category_name: str, user: User) -> Hobby:
        """Delete a category from a hobby."""
        hobby = await self.hobby_repository.get_hobby_by_id(hobby_id, str(user.id))
        if not hobby:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hobby not found"
            )
        
        # Check if category exists
        category_exists = any(cat.name == category_name for cat in hobby.categories)
        if not category_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category '{category_name}' not found"
            )
        
        return await self.hobby_repository.delete_category(hobby_id, str(user.id), category_name)
    
    async def add_item_to_category(self, hobby_id: str, category_name: str, 
                                   item_data: SubCategoryItemCreate, user: User) -> Hobby:
        """Add an item to a category."""
        hobby = await self.hobby_repository.get_hobby_by_id(hobby_id, str(user.id))
        if not hobby:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hobby not found"
            )
        
        # Find category and validate against schema
        category = None
        for cat in hobby.categories:
            if cat.name == category_name:
                category = cat
                break
        
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category '{category_name}' not found"
            )
        
        # Validate item data against schema
        self._validate_item_data(item_data.data, category.schema)
        
        item = SubCategoryItem(data=item_data.data)
        
        return await self.hobby_repository.add_item_to_category(
            hobby_id, str(user.id), category_name, item
        )
    
    async def update_item_in_category(self, hobby_id: str, category_name: str, item_id: str,
                                     item_data: SubCategoryItemUpdate, user: User) -> Hobby:
        """Update an item in a category."""
        hobby = await self.hobby_repository.get_hobby_by_id(hobby_id, str(user.id))
        if not hobby:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hobby not found"
            )
        
        # Find category
        category = None
        for cat in hobby.categories:
            if cat.name == category_name:
                category = cat
                break
        
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category '{category_name}' not found"
            )
        
        # Validate item exists
        item_exists = any(item.id == item_id for item in category.items)
        if not item_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Item not found"
            )
        
        # Validate item data against schema
        self._validate_item_data(item_data.data, category.schema)
        
        update_data = {
            "data": item_data.data,
            "updated_at": datetime.utcnow()
        }
        
        return await self.hobby_repository.update_item_in_category(
            hobby_id, str(user.id), category_name, item_id, update_data
        )
    
    async def delete_item_from_category(self, hobby_id: str, category_name: str, 
                                       item_id: str, user: User) -> Hobby:
        """Delete an item from a category."""
        hobby = await self.hobby_repository.get_hobby_by_id(hobby_id, str(user.id))
        if not hobby:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hobby not found"
            )
        
        # Find category
        category = None
        for cat in hobby.categories:
            if cat.name == category_name:
                category = cat
                break
        
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category '{category_name}' not found"
            )
        
        # Validate item exists
        item_exists = any(item.id == item_id for item in category.items)
        if not item_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Item not found"
            )
        
        return await self.hobby_repository.delete_item_from_category(
            hobby_id, str(user.id), category_name, item_id
        )
    
    def _validate_item_data(self, data: dict, schema: CategorySchema):
        """Validate item data against category schema."""
        # Check required fields
        for field_def in schema.fields:
            if field_def.required and field_def.name not in data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Required field '{field_def.name}' is missing"
                )
            
            # Validate field types
            if field_def.name in data:
                value = data[field_def.name]
                if not self._validate_field_type(value, field_def.field_type):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Field '{field_def.name}' has invalid type. Expected {field_def.field_type}"
                    )
    
    def _validate_field_type(self, value: any, field_type: str) -> bool:
        """Validate a value against a field type."""
        if value is None:
            return True
        
        if field_type == "text":
            return isinstance(value, str)
        elif field_type == "number":
            return isinstance(value, (int, float))
        elif field_type == "boolean":
            return isinstance(value, bool)
        elif field_type == "date":
            return isinstance(value, str)  # Date should be ISO string
        
        return False
