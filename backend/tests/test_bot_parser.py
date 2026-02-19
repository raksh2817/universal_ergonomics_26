"""Tests for Telegram/WhatsApp bot message parsing."""

from app.services.bot.telegram_bot import parse_message


def test_parse_add():
    result = parse_message("ADD UE-EXEC-001 10")
    assert result == {"action": "add", "sku": "UE-EXEC-001", "quantity": 10}


def test_parse_add_lowercase():
    result = parse_message("add ue-mid-001 5")
    assert result == {"action": "add", "sku": "ue-mid-001", "quantity": 5}


def test_parse_remove():
    result = parse_message("REMOVE UE-TASK-001 3")
    assert result == {"action": "remove", "sku": "UE-TASK-001", "quantity": 3}


def test_parse_check():
    result = parse_message("CHECK UE-EXEC-001")
    assert result == {"action": "check", "sku": "UE-EXEC-001"}


def test_parse_low_stock():
    result = parse_message("LOW STOCK")
    assert result == {"action": "low_stock"}


def test_parse_low_stock_no_space():
    result = parse_message("LOWSTOCK")
    assert result == {"action": "low_stock"}


def test_parse_unknown():
    result = parse_message("hello there")
    assert result["action"] == "unknown"


def test_parse_whitespace():
    result = parse_message("  ADD UE-EXEC-001 10  ")
    assert result == {"action": "add", "sku": "UE-EXEC-001", "quantity": 10}
