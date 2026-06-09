# Brainhack

This is a code bundle for Brainhack.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Telegram bot
To run the bot:

1. Install Python dependencies with `pip install -r apps/telegram-bot/requirements.txt`.
2. Set `TELEGRAM_API_ID`, `TELEGRAM_API_HASH`, `TELEGRAM_BOT_TOKEN`, and optionally `BACKEND_URL`.
3. Start the bot with `python apps/telegram-bot/bot.py`.

The Telegram linking flow is:

1. Sign in to the ShieldVerse web app.
2. Open the Telegram page and generate a link code.
3. Send `/link <code>` to the Telegram bot.
4. Forward suspicious messages to the bot so scans and XP are saved to your profile.

The bot responds to `/start`, `/link`, `/help`, `/stats`, `/missions`, and any forwarded or pasted suspicious message.
