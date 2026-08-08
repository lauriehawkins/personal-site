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

## Interactive Export Bot

**For live Discord integration**, use `export-bot.js` which responds to commands:

```bash
node bot/export-bot.js
```

This runs a persistent bot that listens for the command:

```
!export-nerd-content
```

When you type this command in any Discord channel, the bot will:
1. Scan all relevant channels (battle-reports, campaign-map-updates, paint-progress, etc.)
2. Generate a structured JSON export
3. Upload it as a file attachment
4. Provide a preview summary

**To update the Nerd Stuff page:**
1. Run `node bot/export-bot.js` (keep it running)
2. In Discord, type `!export-nerd-content`
3. Download the JSON file
4. Paste it into Claude Code and say "Here's this month's Nerd update"
5. Claude will integrate new content into `nerd.html`

## Next Steps

Once you've run the bot, we'll use the data to build an awesome nerd page showcasing your gaming highlights, top moments, and server activity!
