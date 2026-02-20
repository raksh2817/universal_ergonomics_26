"""Pydantic schemas for user and auth endpoints."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


class UserCreate(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    password: str
    full_name: str
    is_b2b: bool = False

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        if not any(c.isalpha() for c in v):
            raise ValueError("Password must contain at least one letter")
        return v


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    email: str
    phone: Optional[str] = None
    full_name: str
    is_b2b: bool
    is_active: bool
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class B2BProfileCreate(BaseModel):
    company_name: str
    gst_number: Optional[str] = None
    industry: Optional[str] = None
    employee_count: Optional[int] = None
    billing_address: Optional[str] = None
