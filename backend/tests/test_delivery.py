"""Tests for delivery zone utilities."""

from app.utils.delivery import haversine_km, is_free_delivery, get_delivery_estimate


def test_haversine_same_point():
    assert haversine_km(12.97, 77.59, 12.97, 77.59) == 0.0


def test_haversine_bangalore_to_whitefield():
    # Bangalore center to Whitefield ~16km
    distance = haversine_km(12.9716, 77.5946, 12.9698, 77.7500)
    assert 15 < distance < 20


def test_free_delivery_in_bangalore():
    # Koramangala coordinates
    assert is_free_delivery(12.9352, 77.6245) is True


def test_no_free_delivery_outside():
    # Chennai coordinates
    assert is_free_delivery(13.0827, 80.2707) is False


def test_delivery_estimate_bangalore():
    estimate = get_delivery_estimate(12.9352, 77.6245)
    assert estimate["delivery_charge"] == 0
    assert estimate["includes_assembly"] is True
    assert estimate["zone"] == "bangalore_metro"


def test_delivery_estimate_outstation():
    estimate = get_delivery_estimate(13.0827, 80.2707)
    assert estimate["delivery_charge"] > 0
    assert estimate["includes_assembly"] is False
    assert estimate["zone"] == "outstation"
