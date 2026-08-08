const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log('Starting to fetch messages...');

    try {
        await fetchAllMessages();
        console.log('Message fetching complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error fetching messages:', error);
        process.exit(1);
    }
});

async function fetchAllMessages() {
    const guilds = client.guilds.cache;
    console.log(`Found ${guilds.size} server(s)`);

    for (const [guildId, guild] of guilds) {
        console.log(`\nProcessing server: ${guild.name}`);

        const guildData = {
            id: guild.id,
            name: guild.name,
            channels: []
        };

        const channels = guild.channels.cache.filter(ch => ch.isTextBased());
        console.log(`Found ${channels.size} text channels`);

        for (const [channelId, channel] of channels) {
            console.log(`  Fetching from #${channel.name}...`);

            const channelData = {
                id: channel.id,
                name: channel.name,
                category: channel.parent ? channel.parent.name : null,
                messages: []
            };

            try {
                let lastId;
                let fetchedCount = 0;

                while (true) {
                    const options = { limit: 100 };
                    if (lastId) {
                        options.before = lastId;
                    }

                    const messages = await channel.messages.fetch(options);
                    if (messages.size === 0) break;

                    messages.forEach(msg => {
                        channelData.messages.push({
                            id: msg.id,
                            content: msg.content,
                            author: {
                                id: msg.author.id,
                                username: msg.author.username,
                                bot: msg.author.bot
                            },
                            timestamp: msg.createdTimestamp,
                            attachments: msg.attachments.map(att => ({
                                url: att.url,
                                name: att.name,
                                contentType: att.contentType
                            })),
                            embeds: msg.embeds.length > 0,
                            reactions: msg.reactions.cache.map(r => ({
                                emoji: r.emoji.name,
                                count: r.count
                            }))
                        });
                    });

                    fetchedCount += messages.size;
                    lastId = messages.last().id;

                    // Rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                console.log(`    Fetched ${fetchedCount} messages from #${channel.name}`);
                guildData.channels.push(channelData);
            } catch (error) {
                console.error(`    Error fetching from #${channel.name}:`, error.message);
            }
        }

        // Save guild data
        const filename = path.join(DATA_DIR, `${guild.name.replace(/[^a-z0-9]/gi, '_')}.json`);
        fs.writeFileSync(filename, JSON.stringify(guildData, null, 2));
        console.log(`\nSaved data to ${filename}`);
    }
}

client.login(process.env.DISCORD_BOT_TOKEN);
