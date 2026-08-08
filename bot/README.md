# Laurie Bot

Discord bot to fetch and analyze messages from your personal server.

## Setup

1. **Create a Discord Bot:**
   - Go to https://discord.com/developers/applications
   - Click "New Application" and name it "laurie-bot"
   - Go to the "Bot" tab and click "Add Bot"
   - Under "Privileged Gateway Intents", enable:
     - Message Content Intent
     - Server Members Intent (optional)
   - Click "Reset Token" and copy the token

2. **Invite Bot to Server:**
   - Go to the "OAuth2" > "URL Generator" tab
   - Select scopes: `bot`
   - Select bot permissions: `Read Messages/View Channels`, `Read Message History`
   - Copy the generated URL and open it in your browser
   - Select your personal server and authorize

3. **Configure Environment:**
   - Copy `.env.example` to `.env`
   - Paste your bot token into `.env`:
     ```
     DISCORD_BOT_TOKEN=your_actual_token_here
     ```

4. **Run the Bot:**
   ```bash
   cd ~/personal/personal-site
   node bot/laurie-bot.js
   ```

   This will fetch all messages from all channels and save them to `bot/data/`

5. **Analyze the Data:**
   ```bash
   node bot/analyze-messages.js
   ```

   This generates stats and highlights, especially for Games & Results channels.

## Output

- Raw data: `bot/data/*.json` (one file per server)
- Analysis: `bot/data/analysis.json`
- Games & Results content will be specially extracted for the nerd page

## Next Steps

Once you've run the bot, we'll use the data to build an awesome nerd page showcasing your gaming highlights, top moments, and server activity!
