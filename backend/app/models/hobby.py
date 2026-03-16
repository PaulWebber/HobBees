"""Hobby, Category, and SubCategory data models."""
from pydantic import BaseModel, Field
from pydantic_core import core_schema
from typing import Optional, Dict, Any, List
from datetime import datetime
from bson import ObjectId
from enum import Enum


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic."""
    
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler):
        return core_schema.union_schema([
            core_schema.is_instance_schema(ObjectId),
            core_schema.chain_schema([
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate),
            ])
        ], serialization=core_schema.plain_serializer_function_ser_schema(str))

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str) and ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")


class FieldType(str, Enum):
    """Enum for supported field types in sub-category schemas."""
    TEXT = "text"
    NUMBER = "number"
    DATE = "date"
    BOOLEAN = "boolean"


class FieldDefinition(BaseModel):
    """Definition of a custom field in a sub-category schema."""
    name: str = Field(..., min_length=1, max_length=100)
    field_type: FieldType
    required: bool = False
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Brand",
                "field_type": "text",
                "required": True
            }
        }


class CategorySchema(BaseModel):
    """Schema definition for a category's sub-category items."""
    category_name: str
    fields: List[FieldDefinition]
    
    class Config:
        json_schema_extra = {
            "example": {
                "category_name": "Latex",
                "fields": [
                    {"name": "Brand", "field_type": "text", "required": True},
                    {"name": "Thickness", "field_type": "number", "required": True},
                    {"name": "Quantity", "field_type": "number", "required": False}
                ]
            }
        }


class SubCategoryItem(BaseModel):
    """An item within a category with custom fields."""
    id: str = Field(default_factory=lambda: str(ObjectId()))
    data: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "data": {
                    "Brand": "Snipersling",
                    "Colour": "Yellow",
                    "Thickness": 0.4,
                    "Quantity": 4
                }
            }
        }


class Category(BaseModel):
    """Category within a hobby."""
    name: str = Field(..., min_length=1, max_length=100)
    schema: CategorySchema
    items: List[SubCategoryItem] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Latex",
                "schema": {
                    "category_name": "Latex",
                    "fields": [
                        {"name": "Brand", "field_type": "text", "required": True},
                        {"name": "Thickness", "field_type": "number", "required": True}
                    ]
                },
                "items": []
            }
        }


class Hobby(BaseModel):
    """Main hobby model containing categories."""
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str = Field(..., description="User ID that owns this hobby")
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    categories: List[Category] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "user_id": "507f1f77bcf86cd799439011",
                "name": "Slingshot",
                "description": "Slingshot hobby tracking",
                "categories": []
            }
        }
