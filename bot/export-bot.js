const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Channels to monitor for Nerd Stuff content
const MONITORED_CHANNELS = {
    'battle-reports': 'battleReports',
    'campaign-map-updates': 'campaignMaps',
    'paint-progress': 'hobbyShowcase',
    'finished-models': 'hobbyShowcase',
    'hobby-chat': 'hobbyShowcase',
    'the-kharon-reach-campaign': 'campaignNarrative'
};

client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log('Bot ready. Use !export-nerd-content in any channel to generate export.');
});

client.on('messageCreate', async (message) => {
    // Ignore bot messages
    if (message.author.bot) return;

    // Check for export command
    if (message.content.trim() === '!export-nerd-content') {
        console.log(`Export command received from ${message.author.username}`);

        try {
            await message.channel.send('🔄 Generating Nerd Stuff export...');

            const exportData = await generateExport(message.guild);

            // Convert to JSON
            const jsonString = JSON.stringify(exportData, null, 2);
            const filename = `nerd-export-${Date.now()}.json`;
            const filepath = path.join(__dirname, 'data', filename);

            fs.writeFileSync(filepath, jsonString);

            // Send as file attachment
            await message.channel.send({
                content: '✅ Export complete! Copy this JSON and provide it to Claude Code.',
                files: [{
                    attachment: filepath,
                    name: filename
                }]
            });

            // Also send a preview
            const preview = `\`\`\`json
${JSON.stringify({
    exportDate: exportData.exportDate,
    serverStats: exportData.serverStats,
    battleReports: exportData.battleReports.length + ' reports',
    campaignMaps: exportData.campaignMaps.length + ' maps',
    hobbyShowcase: exportData.hobbyShowcase.length + ' items'
}, null, 2)}
\`\`\``;

            await message.channel.send(preview);

        } catch (error) {
            console.error('Export error:', error);
            await message.channel.send('❌ Error generating export: ' + error.message);
        }
    }
});

async function generateExport(guild) {
    const exportDate = new Date().toISOString().split('T')[0];

    // Get server stats
    const members = guild.members.cache.filter(m => !m.user.bot).size;
    let totalMessages = 0;

    const exportData = {
        exportDate,
        serverStats: {
            members,
            totalMessages: 0, // Will calculate
            activeCampaigns: 1, // Kharon Reach
            completedBattles: 0 // Will count
        },
        battleReports: [],
        campaignMaps: [],
        hobbyShowcase: [],
        campaignNarrative: {
            currentPhase: 'Unknown',
            summary: ''
        }
    };

    // Process each monitored channel
    for (const [channelName, category] of Object.entries(MONITORED_CHANNELS)) {
        const channel = guild.channels.cache.find(ch => ch.name === channelName);

        if (!channel || !channel.isTextBased()) {
            console.log(`⚠️  Channel #${channelName} not found or not text-based`);
            continue;
        }

        console.log(`📖 Reading #${channelName}...`);

        try {
            // Fetch messages (last 100 for efficiency)
            const messages = await channel.messages.fetch({ limit: 100 });
            totalMessages += messages.size;

            messages.forEach(msg => {
                // Skip bot messages
                if (msg.author.bot) return;

                // Process based on channel type
                if (category === 'battleReports') {
                    exportData.battleReports.push(formatBattleReport(msg));
                    exportData.serverStats.completedBattles++;
                } else if (category === 'campaignMaps') {
                    if (msg.attachments.size > 0) {
                        exportData.campaignMaps.push(formatCampaignMap(msg));
                    }
                } else if (category === 'hobbyShowcase') {
                    if (msg.attachments.size > 0 || msg.content.length > 50) {
                        exportData.hobbyShowcase.push(formatHobbyItem(msg));
                    }
                } else if (category === 'campaignNarrative') {
                    // Extract narrative updates
                    if (msg.content.length > 100) {
                        exportData.campaignNarrative.summary = msg.content;
                        exportData.campaignNarrative.currentPhase = 'The Kharon Reach Campaign';
                    }
                }
            });

        } catch (error) {
            console.error(`Error reading #${channelName}:`, error.message);
        }
    }

    exportData.serverStats.totalMessages = totalMessages;

    return exportData;
}

function formatBattleReport(msg) {
    // Try to extract participants from content
    const content = msg.content.toLowerCase();
    const factions = [];

    const factionKeywords = {
        'imperium': ['imperium', 'space marine', 'guard', 'imperial', 'wolf', 'wolves'],
        'tyranids': ['tyranid', 'nid', 'bugs', 'hive'],
        'eldar': ['eldar', 'aeldari', 'craftworld'],
        'chaos': ['chaos', 'heretic'],
        'orks': ['ork', 'greenskin'],
        'necrons': ['necron', 'dynasty']
    };

    for (const [faction, keywords] of Object.entries(factionKeywords)) {
        if (keywords.some(kw => content.includes(kw))) {
            factions.push(faction.charAt(0).toUpperCase() + faction.slice(1));
        }
    }

    return {
        id: msg.id,
        title: msg.content.split('\n')[0].substring(0, 100) || 'Battle Report',
        date: new Date(msg.createdTimestamp).toISOString().split('T')[0],
        author: msg.author.username,
        channel: msg.channel.name,
        content: msg.content,
        participants: factions.length > 0 ? factions : ['Unknown'],
        outcome: content.includes('victory') || content.includes('won') ? 'Victory' : 'Unknown',
        images: Array.from(msg.attachments.values()).map(att => ({
            url: att.url,
            filename: att.name || `battle-${msg.id}.${att.contentType?.split('/')[1] || 'jpg'}`
        }))
    };
}

function formatCampaignMap(msg) {
    const attachment = msg.attachments.first();

    // Try to extract phase from message content
    const content = msg.content.toLowerCase();
    let phase = 'Campaign Progress';

    if (content.includes('phase 1')) phase = 'Phase 1: Initial Contact';
    else if (content.includes('phase 2')) phase = 'Phase 2: Escalation';
    else if (content.includes('phase 3')) phase = 'Phase 3: The Siege';
    else if (content.includes('phase 4')) phase = 'Phase 4: Final Assault';

    return {
        phase,
        date: new Date(msg.createdTimestamp).toISOString().split('T')[0],
        url: attachment.url,
        filename: attachment.name || `kharon-map-${msg.id}.${attachment.contentType?.split('/')[1] || 'jpg'}`,
        description: msg.content || 'Campaign map update'
    };
}

function formatHobbyItem(msg) {
    const images = Array.from(msg.attachments.values()).map(att => ({
        url: att.url,
        filename: att.name || `hobby-${msg.id}.${att.contentType?.split('/')[1] || 'jpg'}`
    }));

    return {
        title: msg.content.split('\n')[0].substring(0, 100) || 'Hobby Progress',
        date: new Date(msg.createdTimestamp).toISOString().split('T')[0],
        author: msg.author.username,
        content: msg.content,
        images
    };
}

client.login(process.env.DISCORD_BOT_TOKEN);
