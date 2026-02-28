"""Hobby API routes."""
from fastapi import APIRouter, Depends, status
from typing import List
from ..schemas.hobby import (
    HobbyCreate, HobbyUpdate, HobbyResponse,
    CategoryCreate, CategoryUpdate,
    SubCategoryItemCreate, SubCategoryItemUpdate
)
from ..models.user import User
from ..models.hobby import Hobby
from ..services.hobby_service import HobbyService
from ..repositories.hobby_repository import HobbyRepository
from ..database import get_database
from ..middleware.auth_middleware import get_current_active_user

router = APIRouter(prefix="/hobbies", tags=["hobbies"])


def get_hobby_service():
    """Dependency to get hobby service."""
    db = get_database()
    hobby_repo = HobbyRepository(db)
    return HobbyService(hobby_repo)


def hobby_to_response(hobby: Hobby) -> HobbyResponse:
    """Convert Hobby model to response schema."""
    hobby_dict = hobby.model_dump(by_alias=True)
    hobby_dict["id"] = str(hobby_dict.pop("_id"))
    return HobbyResponse(**hobby_dict)


@router.post("", response_model=HobbyResponse, status_code=status.HTTP_201_CREATED)
async def create_hobby(
    hobby_data: HobbyCreate,
    current_user: User = Depends(get_current_active_user),
    hobby_service: HobbyService = Depends(get_hobby_service)
):
    """Create a new hobby."""
    hobby = await hobby_service.create_hobby(hobby_data, current_user)
    return hobby_to_response(hobby)


@router.get("", response_model=List[HobbyResponse])
async def get_user_hobbies(
    current_user: User = Depends(get_current_active_user),
    hobby_service: HobbyService = Depends(get_hobby_service)
):
    """Get all hobbies for the current user."""
    hobbies = await hobby_service.get_user_hobbies(current_user)
    return [hobby_to_response(hobby) for hobby in hobbies]


@router.get("/{hobby_id}", response_model=HobbyResponse)
async def get_hobby(
    hobby_id: str,
    current_user: User = Depends(get_current_active_user),
    hobby_service: HobbyService = Depends(get_hobby_service)
):
    """Get a specific hobby."""
    hobby = await hobby_service.get_hobby(hobby_id, current_user)
    return hobby_to_response(hobby)


@router.put("/{hobby_id}", response_model=HobbyResponse)
async def update_hobby(
    hobby_id: str,
    hobby_data: HobbyUpdate,
    current_user: User = Depends(get_current_active_user),
    hobby_service: HobbyService = Depends(get_hobby_service)
):
    """Update a hobby."""
    hobby = await hobby_service.update_hobby(hobby_id, hobby_data, current_user)
    return hobby_to_response(hobby)


@router.delete("/{hobby_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_hobby(
    hobby_id: str,
    current_user: User = Depends(get_current_active_user),
    hobby_service: HobbyService = Depends(get_hobby_service)
):
    """Delete a hobby."""
    await hobby_service.delete_hobby(hobby_id, current_user)


@router.post("/{hobby_id}/categories", response_model=HobbyResponse, status_code=status.HTTP_201_CREATED)
async def add_category(
    hobby_id: str,
    category_data: CategoryCreate,
    current_user: User = Depends(get_current_active_user),
    hobby_service: HobbyService = Depends(get_hobby_service)
):
    """Add a category to a hobby."""
    hobby = await hobby_service.add_category(hobby_id, category_data, current_user)
    return hobby_to_response(hobby)


@router.put("/{hobby_id}/categories/{category_name}", response_model=HobbyResponse)
async def update_category(
    hobby_id: str,
    category_name: str,
    category_data: CategoryUpdate,
    current_user: User = Depends(get_current_active_user),
    hobby_service: HobbyService = Depends(get_hobby_service)
):
    """Update a category in a hobby."""
    hobby = await hobby_service.update_category(hobby_id, category_name, category_data, current_user)
    return hobby_to_response(hobby)


@router.delete("/{hobby_id}/categories/{category_name}", response_model=HobbyResponse)
async def delete_category(
    hobby_id: str,
    category_name: str,
    current_user: User = Depends(get_current_active_user),
    hobby_service: HobbyService = Depends(get_hobby_service)
):
    """Delete a category from a hobby."""
    hobby = await hobby_service.delete_category(hobby_id, category_name, current_user)
    return hobby_to_response(hobby)


@router.post("/{hobby_id}/categories/{category_name}/items", response_model=HobbyResponse, status_code=status.HTTP_201_CREATED)
async def add_item_to_category(
    hobby_id: str,
    category_name: str,
    item_data: SubCategoryItemCreate,
    current_user: User = Depends(get_current_active_user),
    hobby_service: HobbyService = Depends(get_hobby_service)
):
    """Add an item to a category."""
    hobby = await hobby_service.add_item_to_category(hobby_id, category_name, item_data, current_user)
    return hobby_to_response(hobby)


@router.put("/{hobby_id}/categories/{category_name}/items/{item_id}", response_model=HobbyResponse)
async def update_item_in_category(
    hobby_id: str,
    category_name: str,
    item_id: str,
    item_data: SubCategoryItemUpdate,
    current_user: User = Depends(get_current_active_user),
    hobby_service: HobbyService = Depends(get_hobby_service)
):
    """Update an item in a category."""
    hobby = await hobby_service.update_item_in_category(hobby_id, category_name, item_id, item_data, current_user)
    return hobby_to_response(hobby)


@router.delete("/{hobby_id}/categories/{category_name}/items/{item_id}", response_model=HobbyResponse)
async def delete_item_from_category(
    hobby_id: str,
    category_name: str,
    item_id: str,
    current_user: User = Depends(get_current_active_user),
    hobby_service: HobbyService = Depends(get_hobby_service)
):
    """Delete an item from a category."""
    hobby = await hobby_service.delete_item_from_category(hobby_id, category_name, item_id, current_user)
    return hobby_to_response(hobby)
