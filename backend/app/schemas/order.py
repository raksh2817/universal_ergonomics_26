"""Pydantic schemas for order endpoints."""

from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class OrderItemCreate(BaseModel):
    product_id: UUID
    variant_id: Optional[UUID] = None
    quantity: int


class OrderCreate(BaseModel):
    items: list[OrderItemCreate]
    shipping_address_id: UUID
    customer_notes: Optional[str] = None
    order_type: str = "b2c"


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    product_id: UUID
    product_name: str
    product_sku: str
    quantity: int
    unit_price: Decimal
    total_price: Decimal


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    order_number: str
    order_type: str
    subtotal: Decimal
    gst_amount: Decimal
    delivery_charge: Decimal
    discount_amount: Decimal
    total: Decimal
    status: str
    payment_status: str
    assembly_required: bool
    estimated_delivery_at: Optional[datetime] = None
    items: list[OrderItemOut] = []
    created_at: datetime


class PaymentInitiate(BaseModel):
    order_id: UUID


class PaymentVerify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
