"""
Delivery zone and logistics utilities for Bangalore operations.

Universal Ergonomics' key competitive advantage is free 48-hour delivery with
on-site assembly within the Bangalore metropolitan area.  This module provides
the geographic logic that underpins that promise.

Zone definitions:
  bangalore_metro  – Within FREE_DELIVERY_RADIUS_KM (~50 km) of Bangalore city
                     centre.  Delivery charge = ₹0, time = 48 hrs, assembly included.
  outstation       – Beyond the metro radius.  Delivery uses a third-party logistics
                     partner, charge scales with distance, time = 5 days, no assembly.

All distance calculations use the Haversine formula (great-circle distance on
Earth's surface).  Input coordinates come from the Address model (lat/lng
populated by geocoding at address-save time).
"""

import math
from app.core.config import settings


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance in kilometres between two GPS coordinates.

    Uses the Haversine formula which is accurate enough for distances up to a few
    hundred kilometres and avoids the complexity of ellipsoidal earth models.

    Args:
        lat1, lon1: Origin coordinates (degrees)
        lat2, lon2: Destination coordinates (degrees)

    Returns:
        Distance in kilometres (float)
    """
    R = 6371.0  # Mean radius of Earth in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    # Haversine intermediate value
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    # Central angle between the two points
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def is_free_delivery(pincode_lat: float, pincode_lng: float) -> bool:
    """
    Return True if the delivery address is within the free-delivery zone.

    Computes the haversine distance from the Bangalore city centre (configured
    in settings) to the destination and compares it against FREE_DELIVERY_RADIUS_KM.
    """
    distance = haversine_km(
        settings.BANGALORE_CENTER_LAT,
        settings.BANGALORE_CENTER_LNG,
        pincode_lat,
        pincode_lng,
    )
    return distance <= settings.FREE_DELIVERY_RADIUS_KM


def get_delivery_estimate(pincode_lat: float, pincode_lng: float) -> dict:
    """
    Return a delivery cost and time estimate for the given coordinates.

    Returns a dict with:
      delivery_charge   – INR charge (0 for metro, formula-based for outstation)
      estimated_hours   – Promised delivery window in hours
      includes_assembly – True only for metro zone (our own fleet + technicians)
      zone              – "bangalore_metro" or "outstation"

    Outstation charge formula: ₹500 base + ₹10 per km beyond the free-delivery radius.
    """
    distance = haversine_km(
        settings.BANGALORE_CENTER_LAT,
        settings.BANGALORE_CENTER_LNG,
        pincode_lat,
        pincode_lng,
    )

    if distance <= settings.FREE_DELIVERY_RADIUS_KM:
        # Within Bangalore metro: free, fast, with on-site assembly
        return {
            "delivery_charge": 0,
            "estimated_hours": settings.DELIVERY_PROMISE_HOURS,  # 48 hours
            "includes_assembly": True,
            "zone": "bangalore_metro",
        }
    else:
        # Outside Bangalore: third-party logistics, no assembly, 5-day SLA
        # Charge = ₹500 flat + ₹10 per km beyond the free radius
        return {
            "delivery_charge": 500 + (distance - settings.FREE_DELIVERY_RADIUS_KM) * 10,
            "estimated_hours": 120,   # 5 days
            "includes_assembly": False,
            "zone": "outstation",
        }
