import os
from dotenv import load_dotenv
import httpx
from telethon import TelegramClient, events


load_dotenv()

API_ID = int(os.getenv('TELEGRAM_API_ID', '0'))
API_HASH = os.getenv('TELEGRAM_API_HASH', '')
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '')
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:5000')
BOT_USERNAME = os.getenv('TELEGRAM_BOT_USERNAME', 'ShieldVerseSG_bot')


if not API_ID or not API_HASH or not BOT_TOKEN:
    raise RuntimeError('Missing TELEGRAM_API_ID, TELEGRAM_API_HASH, or TELEGRAM_BOT_TOKEN')


client = TelegramClient('shieldverse_bot', API_ID, API_HASH)


async def fetch_json(method: str, path: str, payload: dict | None = None) -> dict:
    async with httpx.AsyncClient(timeout=30.0) as http_client:
        response = await http_client.request(method, f'{BACKEND_URL}{path}', json=payload)
        response.raise_for_status()
        return response.json()


def format_stats(data: dict) -> str:
    stats = data['data']
    return (
        '📊 Telegram Stats\n\n'
        f"Messages scanned: {stats['messages_scanned']}\n"
        f"Threats blocked: {stats['threats_blocked']}\n"
        f"XP earned: +{stats['xp_earned']}"
    )


def format_link_success(data: dict) -> str:
    profile = data['data']
    telegram_name = profile['telegram_username'] or 'your Telegram account'
    return (
        '✅ Telegram account linked successfully!\n\n'
        f"Linked as: {telegram_name}\n"
        'From now on, scans and XP will be saved to your ShieldVerse profile.'
    )


def format_analysis(data: dict) -> str:
    analysis = data['data']
    mission = analysis['related_mission']
    red_flags = analysis['red_flags'][:3]
    actions = analysis['recommended_actions'][:3]

    red_flag_text = '\n'.join(f"• {item['title']}" for item in red_flags) or '• No major red flags detected'
    action_text = '\n'.join(f"• {item['action']}" for item in actions)

    return (
        f"⚠️ {analysis['classification']} ({analysis['risk_score']}/100)\n\n"
        f"Risk score: {analysis['risk_score']}/100\n"
        f"Classification: {analysis['classification']}\n\n"
        'Red flags detected:\n'
        f'{red_flag_text}\n\n'
        'Recommended actions:\n'
        f'{action_text}\n\n'
        f"Related training mission: {mission['title']}\n"
        f"Open: {mission['path']}\n"
        f"+{analysis['xp_awarded']} XP earned"
    )


@client.on(events.NewMessage(pattern=r'^/start'))
async def start_handler(event: events.NewMessage.Event) -> None:
    info = await fetch_json('GET', '/api/integrations/telegram/info')
    await event.respond(
        '👋 Welcome to ShieldVerse SG!\n\n'
        f"Forward suspicious messages to {info['data']['username']} and I will analyze them instantly.\n\n"
        'First, generate a link code from the Telegram page in ShieldVerse, then send /link <code> here.\n\n'
        'Try /help for commands, /stats for your scan stats, or just send me a suspicious message once linked.'
    )


@client.on(events.NewMessage(pattern=r'^/link'))
async def link_handler(event: events.NewMessage.Event) -> None:
    parts = event.raw_text.strip().split(maxsplit=1)
    if len(parts) < 2:
        await event.respond('Please send /link <code> using the code from the ShieldVerse Telegram page.')
        return

    code = parts[1].strip()
    sender = await event.get_sender()
    try:
        data = await fetch_json('POST', '/api/integrations/telegram/link', {
            'link_code': code,
            'telegram_user_id': str(event.sender_id),
            'telegram_username': getattr(sender, 'username', None),
        })
        await event.respond(format_link_success(data))
    except httpx.HTTPStatusError as err:
        response_text = err.response.text if err.response is not None else ''
        if 'already linked' in response_text.lower():
            await event.respond('This Telegram account is already linked to a ShieldVerse profile.')
        else:
            await event.respond('That link code is invalid or expired. Generate a fresh code on the ShieldVerse Telegram page and try again.')
    except Exception:
        await event.respond('I could not link your account right now. Please try again in a moment.')


@client.on(events.NewMessage(pattern=r'^/help'))
async def help_handler(event: events.NewMessage.Event) -> None:
    commands = await fetch_json('GET', '/api/integrations/telegram/commands')
    lines = ['🛟 Commands']
    for item in commands['data']:
        lines.append(f"{item['command']} — {item['description']}")
    await event.respond('\n'.join(lines))


@client.on(events.NewMessage(pattern=r'^/stats'))
async def stats_handler(event: events.NewMessage.Event) -> None:
    stats = await fetch_json('GET', f'/api/integrations/telegram/stats?telegram_user_id={event.sender_id}')
    await event.respond(format_stats(stats))


@client.on(events.NewMessage(pattern=r'^/missions'))
async def missions_handler(event: events.NewMessage.Event) -> None:
    info = await fetch_json('GET', '/api/integrations/telegram/info')
    await event.respond(
        '📚 Related training mission\n\n'
        f"Open the dashboard path: {info['data']['url']}\n"
        'Complete the linked mission after each scan to keep building your XP.'
    )


@client.on(events.NewMessage)
async def message_handler(event: events.NewMessage.Event) -> None:
    text = event.raw_text.strip()
    if not text or text.startswith('/'):
        return

    try:
        sender = await event.get_sender()
        analysis = await fetch_json('POST', '/api/integrations/telegram/analyze', {
            'content': text,
            'telegram_user_id': str(event.sender_id),
            'telegram_username': getattr(sender, 'username', None),
            'message_id': event.id,
            'chat_id': event.chat_id,
            'chat_title': getattr(getattr(event, 'chat', None), 'title', None),
            'source': 'bot',
        })
        await event.respond(format_analysis(analysis))
    except httpx.HTTPStatusError as err:
        if err.response is not None and err.response.status_code == 409:
            await event.respond('Please link your Telegram account first with /link <code> from the ShieldVerse page, then resend the message.')
        else:
            await event.respond('Sorry, I could not analyze that message right now. Please try again later.')
    except Exception:
        await event.respond('Sorry, I could not analyze that message right now. Please try again later.')


async def main() -> None:
    await client.start(bot_token=BOT_TOKEN)
    print(f'Bot running as @{BOT_USERNAME}')
    await client.run_until_disconnected()


if __name__ == '__main__':
    client.loop.run_until_complete(main())