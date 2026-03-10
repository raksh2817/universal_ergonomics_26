"""
Authentication and password utilities.

Provides three concerns:
  1. Password hashing/verification via bcrypt (through passlib)
  2. JWT access-token creation (signed with HS256 + SECRET_KEY)
  3. JWT access-token decoding (returns payload dict or None on failure)

These functions are used by:
  - auth.py endpoint  → register (hash), login (verify + create token)
  - Future middleware → decode token to identify the current user
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# ---------------------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------------------
# CryptContext with bcrypt automatically handles work-factor tuning.
# `deprecated="auto"` will flag any old scheme so hashes can be upgraded.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Return True if `plain_password` matches the stored bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a plain-text password with bcrypt and return the digest string."""
    return pwd_context.hash(password)


# ---------------------------------------------------------------------------
# JWT tokens
# ---------------------------------------------------------------------------

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Encode a JWT access token.

    Args:
        data:          Payload dict (typically {"sub": user_id, "email": email}).
        expires_delta: Custom TTL; falls back to ACCESS_TOKEN_EXPIRE_MINUTES from settings.

    Returns:
        A signed JWT string to be returned to the client as a Bearer token.
    """
    to_encode = data.copy()
    # Calculate the absolute expiry timestamp and embed it as the "exp" claim
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and verify a JWT access token.

    Returns the payload dict on success, or None if the token is invalid,
    expired, or tampered with. Callers should treat None as unauthenticated.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        # Covers expired tokens, bad signatures, malformed tokens, etc.
        return None
