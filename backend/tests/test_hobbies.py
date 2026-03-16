"""Hobby CRUD operation tests."""
import pytest
from bson import ObjectId
from app.services.hobby_service import HobbyService
from app.services.auth_service import AuthService
from app.repositories.hobby_repository import HobbyRepository
from app.repositories.user_repository import UserRepository
from app.models.hobby import Hobby, Category, FieldDefinition
from app.schemas.auth import UserRegister
from app.schemas.hobby import HobbyCreate, CategoryCreate, ItemCreate


@pytest.fixture
async def test_user(test_db, test_user_data):
    """Create a test user and return it."""
    user_repo = UserRepository(test_db)
    auth_service = AuthService(user_repo)
    user_data = UserRegister(**test_user_data)
    return await auth_service.register_user(user_data)


@pytest.fixture
def hobby_service(test_db):
    """Create hobby service instance."""
    hobby_repo = HobbyRepository(test_db)
    return HobbyService(hobby_repo)


@pytest.mark.asyncio
async def test_create_hobby(hobby_service, test_user, test_hobby_data):
    """Test hobby creation."""
    hobby_create = HobbyCreate(**test_hobby_data)
    hobby = await hobby_service.create_hobby(hobby_create, test_user.id)
    
    assert hobby.name == test_hobby_data["name"]
    assert hobby.description == test_hobby_data["description"]
    assert hobby.user_id == test_user.id
    assert hobby.categories == []


@pytest.mark.asyncio
async def test_get_hobby_by_id(hobby_service, test_user, test_hobby_data):
    """Test retrieving hobby by ID."""
    hobby_create = HobbyCreate(**test_hobby_data)
    created_hobby = await hobby_service.create_hobby(hobby_create, test_user.id)
    
    retrieved_hobby = await hobby_service.get_hobby(created_hobby.id, test_user.id)
    
    assert retrieved_hobby is not None
    assert retrieved_hobby.id == created_hobby.id
    assert retrieved_hobby.name == test_hobby_data["name"]


@pytest.mark.asyncio
async def test_get_hobby_unauthorized(hobby_service, test_user, test_hobby_data):
    """Test retrieving hobby by wrong user."""
    hobby_create = HobbyCreate(**test_hobby_data)
    created_hobby = await hobby_service.create_hobby(hobby_create, test_user.id)
    
    # Try to retrieve with different user ID
    wrong_user_id = ObjectId()
    retrieved_hobby = await hobby_service.get_hobby(created_hobby.id, wrong_user_id)
    
    assert retrieved_hobby is None


@pytest.mark.asyncio
async def test_list_user_hobbies(hobby_service, test_user, test_hobby_data):
    """Test listing all hobbies for a user."""
    # Create multiple hobbies
    hobby1 = HobbyCreate(name="Hobby 1", description="First hobby")
    hobby2 = HobbyCreate(name="Hobby 2", description="Second hobby")
    
    await hobby_service.create_hobby(hobby1, test_user.id)
    await hobby_service.create_hobby(hobby2, test_user.id)
    
    hobbies = await hobby_service.get_user_hobbies(test_user.id)
    
    assert len(hobbies) == 2
    assert any(h.name == "Hobby 1" for h in hobbies)
    assert any(h.name == "Hobby 2" for h in hobbies)


@pytest.mark.asyncio
async def test_update_hobby(hobby_service, test_user, test_hobby_data):
    """Test updating a hobby."""
    hobby_create = HobbyCreate(**test_hobby_data)
    created_hobby = await hobby_service.create_hobby(hobby_create, test_user.id)
    
    # Update hobby
    updated_data = HobbyCreate(
        name="Updated Name",
        description="Updated description"
    )
    updated_hobby = await hobby_service.update_hobby(
        created_hobby.id,
        updated_data,
        test_user.id
    )
    
    assert updated_hobby is not None
    assert updated_hobby.name == "Updated Name"
    assert updated_hobby.description == "Updated description"


@pytest.mark.asyncio
async def test_delete_hobby(hobby_service, test_user, test_hobby_data):
    """Test deleting a hobby."""
    hobby_create = HobbyCreate(**test_hobby_data)
    created_hobby = await hobby_service.create_hobby(hobby_create, test_user.id)
    
    # Delete hobby
    result = await hobby_service.delete_hobby(created_hobby.id, test_user.id)
    
    assert result is True
    
    # Verify it's deleted
    retrieved_hobby = await hobby_service.get_hobby(created_hobby.id, test_user.id)
    assert retrieved_hobby is None


@pytest.mark.asyncio
async def test_add_category_to_hobby(hobby_service, test_user, test_hobby_data):
    """Test adding a category to a hobby."""
    hobby_create = HobbyCreate(**test_hobby_data)
    hobby = await hobby_service.create_hobby(hobby_create, test_user.id)
    
    # Create category with schema
    category_data = CategoryCreate(
        name="Test Category",
        schema=[
            FieldDefinition(name="field1", type="text", required=True),
            FieldDefinition(name="field2", type="number", required=False)
        ]
    )
    
    updated_hobby = await hobby_service.add_category(
        hobby.id,
        category_data,
        test_user.id
    )
    
    assert updated_hobby is not None
    assert len(updated_hobby.categories) == 1
    assert updated_hobby.categories[0].name == "Test Category"
    assert len(updated_hobby.categories[0].schema) == 2


@pytest.mark.asyncio
async def test_duplicate_category_name(hobby_service, test_user, test_hobby_data):
    """Test adding a category with duplicate name."""
    from fastapi import HTTPException
    
    hobby_create = HobbyCreate(**test_hobby_data)
    hobby = await hobby_service.create_hobby(hobby_create, test_user.id)
    
    category_data = CategoryCreate(
        name="Duplicate Category",
        schema=[FieldDefinition(name="field1", type="text", required=True)]
    )
    
    # Add first category
    await hobby_service.add_category(hobby.id, category_data, test_user.id)
    
    # Try to add category with same name
    with pytest.raises(HTTPException) as exc_info:
        await hobby_service.add_category(hobby.id, category_data, test_user.id)
    
    assert exc_info.value.status_code == 400
    assert "already exists" in exc_info.value.detail.lower()


@pytest.mark.asyncio
async def test_update_category(hobby_service, test_user, test_hobby_data):
    """Test updating a category."""
    hobby_create = HobbyCreate(**test_hobby_data)
    hobby = await hobby_service.create_hobby(hobby_create, test_user.id)
    
    # Add category
    category_data = CategoryCreate(
        name="Original Category",
        schema=[FieldDefinition(name="field1", type="text", required=True)]
    )
    hobby = await hobby_service.add_category(hobby.id, category_data, test_user.id)
    
    # Update category
    updated_category = CategoryCreate(
        name="Updated Category",
        schema=[
            FieldDefinition(name="field1", type="text", required=True),
            FieldDefinition(name="field2", type="date", required=False)
        ]
    )
    
    updated_hobby = await hobby_service.update_category(
        hobby.id,
        "Original Category",
        updated_category,
        test_user.id
    )
    
    assert updated_hobby is not None
    assert len(updated_hobby.categories) == 1
    assert updated_hobby.categories[0].name == "Updated Category"
    assert len(updated_hobby.categories[0].schema) == 2


@pytest.mark.asyncio
async def test_delete_category(hobby_service, test_user, test_hobby_data):
    """Test deleting a category."""
    hobby_create = HobbyCreate(**test_hobby_data)
    hobby = await hobby_service.create_hobby(hobby_create, test_user.id)
    
    # Add category
    category_data = CategoryCreate(
        name="Category to Delete",
        schema=[FieldDefinition(name="field1", type="text", required=True)]
    )
    hobby = await hobby_service.add_category(hobby.id, category_data, test_user.id)
    
    # Delete category
    updated_hobby = await hobby_service.delete_category(
        hobby.id,
        "Category to Delete",
        test_user.id
    )
    
    assert updated_hobby is not None
    assert len(updated_hobby.categories) == 0


@pytest.mark.asyncio
async def test_add_item_to_category(hobby_service, test_user, test_hobby_data):
    """Test adding an item to a category."""
    hobby_create = HobbyCreate(**test_hobby_data)
    hobby = await hobby_service.create_hobby(hobby_create, test_user.id)
    
    # Add category with schema
    category_data = CategoryCreate(
        name="Test Category",
        schema=[
            FieldDefinition(name="name", type="text", required=True),
            FieldDefinition(name="count", type="number", required=False)
        ]
    )
    hobby = await hobby_service.add_category(hobby.id, category_data, test_user.id)
    
    # Add item
    item_data = ItemCreate(
        data={"name": "Test Item", "count": 5}
    )
    
    updated_hobby = await hobby_service.add_item(
        hobby.id,
        "Test Category",
        item_data,
        test_user.id
    )
    
    assert updated_hobby is not None
    assert len(updated_hobby.categories[0].items) == 1
    assert updated_hobby.categories[0].items[0].data["name"] == "Test Item"
    assert updated_hobby.categories[0].items[0].data["count"] == 5


@pytest.mark.asyncio
async def test_item_validation_required_field(hobby_service, test_user, test_hobby_data):
    """Test item validation for required fields."""
    from fastapi import HTTPException
    
    hobby_create = HobbyCreate(**test_hobby_data)
    hobby = await hobby_service.create_hobby(hobby_create, test_user.id)
    
    # Add category with required field
    category_data = CategoryCreate(
        name="Test Category",
        schema=[FieldDefinition(name="required_field", type="text", required=True)]
    )
    hobby = await hobby_service.add_category(hobby.id, category_data, test_user.id)
    
    # Try to add item without required field
    item_data = ItemCreate(data={})
    
    with pytest.raises(HTTPException) as exc_info:
        await hobby_service.add_item(
            hobby.id,
            "Test Category",
            item_data,
            test_user.id
        )
    
    assert exc_info.value.status_code == 400
    assert "required" in exc_info.value.detail.lower()


@pytest.mark.asyncio
async def test_update_item(hobby_service, test_user, test_hobby_data):
    """Test updating an item."""
    hobby_create = HobbyCreate(**test_hobby_data)
    hobby = await hobby_service.create_hobby(hobby_create, test_user.id)
    
    # Add category and item
    category_data = CategoryCreate(
        name="Test Category",
        schema=[FieldDefinition(name="name", type="text", required=True)]
    )
    hobby = await hobby_service.add_category(hobby.id, category_data, test_user.id)
    
    item_data = ItemCreate(data={"name": "Original Name"})
    hobby = await hobby_service.add_item(
        hobby.id,
        "Test Category",
        item_data,
        test_user.id
    )
    
    # Update item
    item_id = hobby.categories[0].items[0].id
    updated_item_data = ItemCreate(data={"name": "Updated Name"})
    
    updated_hobby = await hobby_service.update_item(
        hobby.id,
        "Test Category",
        str(item_id),
        updated_item_data,
        test_user.id
    )
    
    assert updated_hobby is not None
    assert updated_hobby.categories[0].items[0].data["name"] == "Updated Name"


@pytest.mark.asyncio
async def test_delete_item(hobby_service, test_user, test_hobby_data):
    """Test deleting an item."""
    hobby_create = HobbyCreate(**test_hobby_data)
    hobby = await hobby_service.create_hobby(hobby_create, test_user.id)
    
    # Add category and item
    category_data = CategoryCreate(
        name="Test Category",
        schema=[FieldDefinition(name="name", type="text", required=True)]
    )
    hobby = await hobby_service.add_category(hobby.id, category_data, test_user.id)
    
    item_data = ItemCreate(data={"name": "Item to Delete"})
    hobby = await hobby_service.add_item(
        hobby.id,
        "Test Category",
        item_data,
        test_user.id
    )
    
    # Delete item
    item_id = hobby.categories[0].items[0].id
    updated_hobby = await hobby_service.delete_item(
        hobby.id,
        "Test Category",
        str(item_id),
        test_user.id
    )
    
    assert updated_hobby is not None
    assert len(updated_hobby.categories[0].items) == 0
