"""
Authentication endpoints — /api/v1/auth/

Two routes are exposed:
  POST /register – Create a new user account.  Hashes the password with bcrypt
                   before persisting.  Returns the new user object (no token yet).
  POST /login    – Verify credentials and issue a JWT Bearer token.
                   The token payload embeds user ID ("sub") and email for quick
                   lookup in downstream middleware without a DB round-trip.

Security notes:
  - The same HTTP 401 is returned for "user not found" and "wrong password"
    to prevent username enumeration attacks.
  - Disabled accounts (is_active=False) receive HTTP 403, not 401, so the
    client can distinguish "wrong password" from "account suspended".
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import LoginRequest, TokenResponse, UserCreate, UserOut

router = APIRouter()


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Register a new user account.

    Steps:
      1. Check that the email is not already taken (unique constraint also
         enforced at DB level, but we give a friendlier error here).
      2. Hash the plain-text password with bcrypt before saving.
      3. Flush so PostgreSQL assigns the UUID and timestamps.
      4. Return the UserOut schema (hashed_password is excluded by the schema).
    """
    # Guard: reject duplicate email before hitting the DB unique constraint
    result = await db.execute(select(User).where(User.email == payload.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=payload.email,
        phone=payload.phone,
        hashed_password=get_password_hash(payload.password),  # Never store plaintext
        full_name=payload.full_name,
        is_b2b=payload.is_b2b,
    )
    db.add(user)
    await db.flush()        # Assigns id / created_at from DB
    await db.refresh(user)  # Reload to pick up server-side defaults
    return user


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Authenticate a user and issue a JWT Bearer token.

    The token payload contains {"sub": user_id, "email": email} and expires
    after ACCESS_TOKEN_EXPIRE_MINUTES (default 30 minutes).

    Returns HTTP 401 for both "user not found" and "wrong password" (prevents
    username enumeration).  Returns HTTP 403 for disabled accounts.
    """
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()
    # Deliberately combine "user not found" and "wrong password" into a single 401
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        # Account exists and password is correct but access is suspended
        raise HTTPException(status_code=403, detail="Account disabled")

    # Embed user ID as "sub" (standard JWT subject claim) and email for convenience
    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return TokenResponse(access_token=token)
