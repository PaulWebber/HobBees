"""Authentication API routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from ..schemas.auth import UserRegister, UserLogin, Token, UserResponse
from ..models.user import User
from ..services.auth_service import AuthService
from ..repositories.user_repository import UserRepository
from ..database import get_database
from ..middleware.auth_middleware import get_current_active_user

router = APIRouter(prefix="/auth", tags=["auth"])


def get_auth_service():
    """Dependency to get auth service."""
    db = get_database()
    user_repo = UserRepository(db)
    return AuthService(user_repo)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Register a new user."""
    user = await auth_service.register_user(user_data)
    return UserResponse(
        id=str(user.id),
        username=user.username,
        email=user.email,
        is_active=user.is_active
    )


@router.post("/login", response_model=Token)
async def login(
    login_data: UserLogin,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Login and get access token."""
    user = await auth_service.authenticate_user(login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return auth_service.create_token_for_user(user)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user information."""
    return UserResponse(
        id=str(current_user.id),
        username=current_user.username,
        email=current_user.email,
        is_active=current_user.is_active
    )
