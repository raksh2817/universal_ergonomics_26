"""
WhatsApp webhook handler for inventory sync.

Uses the same message parsing as the Telegram bot.
This handler is designed to work with the Meta WhatsApp Business API
or Twilio WhatsApp API.
"""

import logging

import httpx
from fastapi import APIRouter, Request, Response

from app.core.config import settings
from app.services.bot.telegram_bot import parse_message, handle_inventory_command

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/webhook/whatsapp")
async def verify_webhook(request: Request):
    """WhatsApp webhook verification (Meta Business API)."""
    params = request.query_params
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")

    if mode == "subscribe" and token == settings.WHATSAPP_API_TOKEN:
        return Response(content=challenge, media_type="text/plain")
    return Response(status_code=403)


@router.post("/webhook/whatsapp")
async def handle_whatsapp_message(request: Request):
    """
    Receive incoming WhatsApp messages, parse inventory commands,
    and send back responses.
    """
    body = await request.json()

    # Extract message text (Meta Business API format)
    try:
        entry = body["entry"][0]
        changes = entry["changes"][0]
        messages = changes["value"].get("messages", [])
    except (KeyError, IndexError):
        return {"status": "no_messages"}

    for msg in messages:
        if msg.get("type") != "text":
            continue

        text = msg["text"]["body"]
        from_number = msg["from"]

        command = parse_message(text)
        reply_text = await handle_inventory_command(command)

        # Send reply via WhatsApp API
        await _send_whatsapp_reply(from_number, reply_text)

    return {"status": "ok"}


async def _send_whatsapp_reply(to_number: str, text: str):
    """Send a reply message via Meta WhatsApp Business API."""
    if not settings.WHATSAPP_API_TOKEN or not settings.WHATSAPP_PHONE_NUMBER_ID:
        logger.warning("WhatsApp credentials not configured")
        return

    url = f"https://graph.facebook.com/v18.0/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {"Authorization": f"Bearer {settings.WHATSAPP_API_TOKEN}"}
    payload = {
        "messaging_product": "whatsapp",
        "to": to_number,
        "type": "text",
        "text": {"body": text},
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        if response.status_code != 200:
            logger.error(f"WhatsApp send failed: {response.text}")
