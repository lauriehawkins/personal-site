const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

function analyzeMessages() {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

    if (files.length === 0) {
        console.log('No data files found. Run laurie-bot.js first!');
        return;
    }

    const allData = files.map(f =>
        JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'))
    );

    const stats = {
        totalMessages: 0,
        totalChannels: 0,
        channelBreakdown: [],
        gamesResults: [],
        topEmojis: {},
        messagesByMonth: {},
        attachmentCount: 0
    };

    allData.forEach(guild => {
        guild.channels.forEach(channel => {
            stats.totalChannels++;
            const channelStats = {
                name: channel.name,
                category: channel.category,
                messageCount: channel.messages.length
            };

            stats.channelBreakdown.push(channelStats);
            stats.totalMessages += channel.messages.length;

            // Special handling for Games & Results section
            if (channel.category && channel.category.toLowerCase().includes('games')) {
                channel.messages.forEach(msg => {
                    stats.gamesResults.push({
                        channel: channel.name,
                        author: msg.author.username,
                        content: msg.content,
                        timestamp: new Date(msg.timestamp).toISOString(),
                        reactions: msg.reactions
                    });
                });
            }

            // Analyze all messages
            channel.messages.forEach(msg => {
                // Count attachments
                if (msg.attachments.length > 0) {
                    stats.attachmentCount += msg.attachments.length;
                }

                // Track reactions/emojis
                msg.reactions.forEach(r => {
                    stats.topEmojis[r.emoji] = (stats.topEmojis[r.emoji] || 0) + r.count;
                });

                // Messages by month
                const date = new Date(msg.timestamp);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                stats.messagesByMonth[monthKey] = (stats.messagesByMonth[monthKey] || 0) + 1;
            });
        });
    });

    // Sort and format
    stats.channelBreakdown.sort((a, b) => b.messageCount - a.messageCount);
    stats.topEmojis = Object.entries(stats.topEmojis)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

    // Save analysis
    fs.writeFileSync(
        path.join(DATA_DIR, 'analysis.json'),
        JSON.stringify(stats, null, 2)
    );

    console.log('\n=== Discord Server Analysis ===');
    console.log(`Total Messages: ${stats.totalMessages}`);
    console.log(`Total Channels: ${stats.totalChannels}`);
    console.log(`Games & Results Messages: ${stats.gamesResults.length}`);
    console.log(`Total Attachments: ${stats.attachmentCount}`);
    console.log('\nTop 10 Most Active Channels:');
    stats.channelBreakdown.slice(0, 10).forEach(ch => {
        console.log(`  #${ch.name}: ${ch.messageCount} messages`);
    });
    console.log('\nTop 10 Reactions:');
    Object.entries(stats.topEmojis).forEach(([emoji, count]) => {
        console.log(`  ${emoji}: ${count}`);
    });

    console.log('\nAnalysis saved to bot/data/analysis.json');
}

analyzeMessages();
