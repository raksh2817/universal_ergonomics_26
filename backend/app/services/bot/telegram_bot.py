"""
Telegram bot for warehouse inventory sync.

The warehouse team sends plain-text messages to a configured Telegram group.
The bot parses those messages into structured commands and calls the internal
inventory REST API, then replies with a confirmation or error.

Supported commands (case-insensitive):
  "ADD UE-EXEC-001 10"   → adds 10 units of SKU UE-EXEC-001
  "REMOVE UE-EXEC-001 3" → removes 3 units
  "CHECK UE-EXEC-001"    → returns current on-hand + reserved stock
  "LOW STOCK"            → lists all products at or below their reorder point

Design notes:
  - `parse_message` and `handle_inventory_command` are shared with the
    WhatsApp handler (whatsapp_handler.py) so both channels use identical logic.
  - The bot calls localhost:8000 (internal) to avoid going through the public
    internet — both processes run on the same Docker network.
  - `start_telegram_bot` is called as an asyncio task from main.py lifespan;
    it runs the python-telegram-bot polling loop concurrently with FastAPI.
"""

import logging
import re
from typing import Optional

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

# Internal FastAPI base URL — both bot and API run on the same Docker network
API_BASE = "http://localhost:8000/api/v1"

# Pre-compiled regex patterns for each supported command type.
# Named capture groups become the structured command dict fields.
PATTERNS = {
    "add":       re.compile(r"^ADD\s+([\w-]+)\s+(\d+)$", re.IGNORECASE),   # ADD <SKU> <QTY>
    "remove":    re.compile(r"^REMOVE\s+([\w-]+)\s+(\d+)$", re.IGNORECASE), # REMOVE <SKU> <QTY>
    "check":     re.compile(r"^CHECK\s+([\w-]+)$", re.IGNORECASE),          # CHECK <SKU>
    "low_stock": re.compile(r"^LOW\s*STOCK$", re.IGNORECASE),               # LOW STOCK (optional space)
}


def parse_message(text: str) -> dict:
    """
    Parse a warehouse message into a structured command dict.

    Returns one of:
      {"action": "add",       "sku": str, "quantity": int}
      {"action": "remove",    "sku": str, "quantity": int}
      {"action": "check",     "sku": str}
      {"action": "low_stock"}
      {"action": "unknown",   "raw": str}  ← unrecognised input

    The dict is passed directly to `handle_inventory_command`.
    """
    text = text.strip()

    for action, pattern in PATTERNS.items():
        match = pattern.match(text)
        if match:
            groups = match.groups()
            if action in ("add", "remove"):
                # groups[0] = SKU, groups[1] = quantity string
                return {"action": action, "sku": groups[0], "quantity": int(groups[1])}
            elif action == "check":
                return {"action": action, "sku": groups[0]}
            elif action == "low_stock":
                return {"action": "low_stock"}

    # No pattern matched — return unknown so the caller can send a help message
    return {"action": "unknown", "raw": text}


async def handle_inventory_command(command: dict) -> str:
    """Execute an inventory command against the API and return a response message."""
    async with httpx.AsyncClient() as client:
        if command["action"] == "add":
            response = await client.post(f"{API_BASE}/inventory/update", json={
                "product_sku": command["sku"],
                "quantity_change": command["quantity"],
                "change_type": "add",
                "source": "bot_telegram",
            })
            if response.status_code == 200:
                data = response.json()
                return f"Added {command['quantity']} units to {command['sku']}. Stock: {data['quantity_on_hand']}"
            return f"Error: {response.text}"

        elif command["action"] == "remove":
            response = await client.post(f"{API_BASE}/inventory/update", json={
                "product_sku": command["sku"],
                "quantity_change": command["quantity"],
                "change_type": "remove",
                "source": "bot_telegram",
            })
            if response.status_code == 200:
                data = response.json()
                return f"Removed {command['quantity']} units from {command['sku']}. Stock: {data['quantity_on_hand']}"
            return f"Error: {response.text}"

        elif command["action"] == "check":
            response = await client.get(f"{API_BASE}/inventory/", params={"product_sku": command["sku"]})
            if response.status_code == 200:
                data = response.json()
                return f"{command['sku']}: {data.get('quantity_on_hand', 'N/A')} on hand, {data.get('quantity_reserved', 0)} reserved"
            return f"SKU {command['sku']} not found"

        elif command["action"] == "low_stock":
            response = await client.get(f"{API_BASE}/inventory/", params={"low_stock_only": True})
            if response.status_code == 200:
                items = response.json()
                if not items:
                    return "All stock levels OK"
                lines = [f"- {item['product_id']}: {item['quantity_on_hand']} left" for item in items]
                return "LOW STOCK ALERT:\n" + "\n".join(lines)
            return "Error fetching low stock"

        return "Unknown command. Use: ADD <sku> <qty> | REMOVE <sku> <qty> | CHECK <sku> | LOW STOCK"


async def start_telegram_bot():
    """
    Start the Telegram bot using python-telegram-bot.
    Call this from main.py on startup if TELEGRAM_BOT_TOKEN is set.
    """
    if not settings.TELEGRAM_BOT_TOKEN:
        logger.warning("TELEGRAM_BOT_TOKEN not set, skipping Telegram bot startup")
        return

    from telegram import Update
    from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes

    async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
        if not update.message or not update.message.text:
            return

        # Restrict to warehouse chat if configured
        if settings.TELEGRAM_WAREHOUSE_CHAT_ID:
            if str(update.message.chat_id) != settings.TELEGRAM_WAREHOUSE_CHAT_ID:
                return

        command = parse_message(update.message.text)
        reply = await handle_inventory_command(command)
        await update.message.reply_text(reply)

    async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
        help_text = (
            "Universal Ergonomics - Warehouse Bot\n\n"
            "Commands:\n"
            "ADD <SKU> <QTY> - Add stock\n"
            "REMOVE <SKU> <QTY> - Remove stock\n"
            "CHECK <SKU> - Check stock level\n"
            "LOW STOCK - Show items below reorder point"
        )
        await update.message.reply_text(help_text)

    app = ApplicationBuilder().token(settings.TELEGRAM_BOT_TOKEN).build()
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    logger.info("Starting Telegram bot...")
    await app.run_polling()
