"""Delivery zone and logistics utilities for Bangalore operations."""

import math
from app.core.config import settings


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in km between two coordinates."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def is_free_delivery(pincode_lat: float, pincode_lng: float) -> bool:
    """Check if a delivery address qualifies for free 48-hour delivery."""
    distance = haversine_km(
        settings.BANGALORE_CENTER_LAT,
        settings.BANGALORE_CENTER_LNG,
        pincode_lat,
        pincode_lng,
    )
    return distance <= settings.FREE_DELIVERY_RADIUS_KM


def get_delivery_estimate(pincode_lat: float, pincode_lng: float) -> dict:
    """Return delivery cost and time estimate."""
    distance = haversine_km(
        settings.BANGALORE_CENTER_LAT,
        settings.BANGALORE_CENTER_LNG,
        pincode_lat,
        pincode_lng,
    )

    if distance <= settings.FREE_DELIVERY_RADIUS_KM:
        return {
            "delivery_charge": 0,
            "estimated_hours": settings.DELIVERY_PROMISE_HOURS,
            "includes_assembly": True,
            "zone": "bangalore_metro",
        }
    else:
        # Outside Bangalore — use logistics partner
        return {
            "delivery_charge": 500 + (distance - settings.FREE_DELIVERY_RADIUS_KM) * 10,
            "estimated_hours": 120,  # 5 days
            "includes_assembly": False,
            "zone": "outstation",
        }
