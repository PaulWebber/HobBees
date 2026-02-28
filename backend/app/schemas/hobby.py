"""Hobby request/response schemas."""
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from ..models.hobby import FieldDefinition, FieldType


class HobbyCreate(BaseModel):
    """Schema for creating a new hobby."""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Slingshot",
                "description": "Tracking slingshot equipment and ammo"
            }
        }


class HobbyUpdate(BaseModel):
    """Schema for updating a hobby."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None


class CategoryCreate(BaseModel):
    """Schema for creating a new category."""
    name: str = Field(..., min_length=1, max_length=100)
    fields: List[FieldDefinition]
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Latex",
                "fields": [
                    {"name": "Brand", "field_type": "text", "required": True},
                    {"name": "Colour", "field_type": "text", "required": False},
                    {"name": "Thickness", "field_type": "number", "required": True},
                    {"name": "Quantity", "field_type": "number", "required": False}
                ]
            }
        }


class CategoryUpdate(BaseModel):
    """Schema for updating a category."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    fields: Optional[List[FieldDefinition]] = None


class SubCategoryItemCreate(BaseModel):
    """Schema for creating a new sub-category item."""
    data: Dict[str, Any]
    
    class Config:
        json_schema_extra = {
            "example": {
                "data": {
                    "Brand": "Snipersling",
                    "Colour": "Yellow",
                    "Thickness": 0.4,
                    "Quantity": 4
                }
            }
        }


class SubCategoryItemUpdate(BaseModel):
    """Schema for updating a sub-category item."""
    data: Dict[str, Any]


class SubCategoryItemResponse(BaseModel):
    """Schema for sub-category item response."""
    id: str
    data: Dict[str, Any]
    created_at: datetime
    updated_at: datetime


class CategoryResponse(BaseModel):
    """Schema for category response."""
    name: str
    schema: Dict[str, Any]
    items: List[SubCategoryItemResponse]
    created_at: datetime
    updated_at: datetime


class HobbyResponse(BaseModel):
    """Schema for hobby response."""
    id: str
    user_id: str
    name: str
    description: Optional[str]
    categories: List[CategoryResponse]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "user_id": "507f1f77bcf86cd799439012",
                "name": "Slingshot",
                "description": "Tracking slingshot equipment",
                "categories": [],
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00"
            }
        }
