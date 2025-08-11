from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from tortoise.exceptions import IntegrityError
from datetime import datetime, timedelta
import jwt

from db.models import User, Admin
from shemas.common_schemas import UserSignup, UserSignin, TokenResponse, UserResponse, MessageResponse
from config import settings
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()


class ProfileUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_photo: Optional[str] = None

# JWT Configuration
SECRET_KEY = settings.SECRET_KEY if hasattr(settings, 'SECRET_KEY') else "your-secret-key-change-this"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = await User.get_or_none(id=user_id, is_active=True)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_current_admin(current_user: User = Depends(get_current_user)) -> Admin:
    admin = await Admin.get_or_none(user=current_user).prefetch_related("user")
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return admin


@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserSignup):
    try:
        # Create new user
        user = User(
            username=user_data.username,
            email=user_data.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            last_login=datetime.utcnow()  # Set last_login on signup since user is auto-logged in
        )
        user.set_password(user_data.password)
        await user.save()
        
        # Check if user is admin (you can modify this logic)
        admin = await Admin.get_or_none(user=user).prefetch_related("user")
        is_admin = admin is not None
        
        # Create access token
        access_token = create_access_token(data={"sub": user.id})
        
        return TokenResponse(
            access_token=access_token,
            user=UserResponse(
                id=user.id,
                username=user.username,
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                profile_photo=user.profile_photo,
                is_active=user.is_active,
                is_verified=user.is_verified,
                created_at=user.created_at
            ),
            is_admin=is_admin
        )
        
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )


@router.post("/signin", response_model=TokenResponse)
async def signin(user_data: UserSignin):
    # Find user by username or email
    user = await User.get_or_none(username=user_data.username)
    if not user:
        user = await User.get_or_none(email=user_data.username)
    
    if not user or not user.verify_password(user_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    await user.save(update_fields=["last_login"])
    
    # Check if user is admin
    admin = await Admin.get_or_none(user=user).prefetch_related("user")
    is_admin = admin is not None
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            profile_photo=user.profile_photo,
            is_active=user.is_active,
            is_verified=user.is_verified,
            created_at=user.created_at
        ),
        is_admin=is_admin
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        profile_photo=current_user.profile_photo,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at
    )


@router.post("/logout", response_model=MessageResponse)
async def logout():
    # Since JWT tokens are stateless, logout is handled client-side
    # In a production system, you might want to implement token blacklisting
    return MessageResponse(
        message="Successfully logged out",
        success=True
    )


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_data: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user)
):
    """Update user profile information"""
    update_fields = []
    
    if profile_data.first_name is not None:
        current_user.first_name = profile_data.first_name
        update_fields.append("first_name")
    
    if profile_data.last_name is not None:
        current_user.last_name = profile_data.last_name
        update_fields.append("last_name")
    
    if profile_data.profile_photo is not None:
        current_user.profile_photo = profile_data.profile_photo
        update_fields.append("profile_photo")
    
    if update_fields:
        update_fields.append("updated_at")
        await current_user.save(update_fields=update_fields)
    
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        profile_photo=current_user.profile_photo,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at
    )