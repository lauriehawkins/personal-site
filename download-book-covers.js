#!/usr/bin/env node

/**
 * Book Cover Downloader
 *
 * Run with: node download-book-covers.js
 *
 * Requirements: npm install puppeteer
 */

const puppeteer = require('puppeteer');
const https = require('https');
const fs = require('fs');
const path = require('path');

const books = [
    // Dungeon Crawler Carl series
    { url: 'https://www.amazon.co.uk/Dungeon-Crawler-Carl-Book-ebook/dp/B08BX5D4LC', filename: 'dungeon-crawler-carl.jpg' },
    { url: 'https://www.amazon.co.uk/Carls-Doomsday-Scenario-Dungeon-Crawler/dp/B08Q3C961Y', filename: 'carls-doomsday.jpg' },
    { url: 'https://www.amazon.co.uk/Dungeon-Anarchists-Cookbook-Crawler-Book-ebook/dp/B094XZ3N2L', filename: 'anarchists-cookbook.jpg' },
    { url: 'https://www.amazon.co.uk/Gate-Feral-Gods-Dungeon-Crawler-ebook/dp/B09MVQBL44', filename: 'feral-gods.jpg' },
    { url: 'https://www.amazon.co.uk/Butchers-Masquerade-Dungeon-Crawler-Book-ebook/dp/B0B78F48QD', filename: 'butchers-masquerade.jpg' },
    { url: 'https://www.amazon.co.uk/Eye-Bedlam-Bride-Dungeon-Crawler-ebook/dp/B0CHNN4MGN', filename: 'bedlam-bride.jpg' },
    { url: 'https://www.amazon.co.uk/This-Inevitable-Ruin-Dungeon-Crawler-ebook/dp/B0DJRW54DN', filename: 'inevitable-ruin.jpg' },
    { url: 'https://www.amazon.co.uk/Parade-Horribles-Matt-Dinniman-ebook/dp/B0DQHBGRY1', filename: 'parade-horribles.jpg' },

    // Pierce Brown
    { url: 'https://www.amazon.co.uk/Golden-Son-Red-Rising-Trilogy/dp/1444759078', filename: 'golden-son.jpg' },
    { url: 'https://www.amazon.co.uk/Morning-Star-Red-Rising-Trilogy/dp/1444759086', filename: 'morning-star.jpg' },
    { url: 'https://www.amazon.co.uk/Iron-Gold-Red-Rising-Book/dp/1473646588', filename: 'iron-gold.jpg' },

    // Sci-fi
    { url: 'https://www.amazon.co.uk/All-Systems-Red-Murderbot-Diaries/dp/1250214726', filename: 'all-systems-red.jpg' },
    { url: 'https://www.amazon.co.uk/Project-Hail-Mary-Andy-Weir/dp/1529100968', filename: 'project-hail-mary.jpg' },
    { url: 'https://www.amazon.co.uk/Children-Time-Adrian-Tchaikovsky/dp/1447273303', filename: 'children-of-time.jpg' },

    // Fiction
    { url: 'https://www.amazon.co.uk/Pines-Wayward-Book-Blake-Crouch/dp/1409145662', filename: 'pines.jpg' },
    { url: 'https://www.amazon.co.uk/Watership-Down-Richard-Adams/dp/0241953235', filename: 'watership-down.jpg' },
    { url: 'https://www.amazon.co.uk/Satsuma-Complex-Bob-Mortimer/dp/1398502545', filename: 'satsuma-complex.jpg' },
    { url: 'https://www.amazon.co.uk/Norse-Mythology-Neil-Gaiman/dp/1408886812', filename: 'norse-mythology.jpg' },
    { url: 'https://www.amazon.co.uk/Colour-Magic-Discworld-Novel-Novels/dp/0552166596', filename: 'colour-of-magic.jpg' },
    { url: 'https://www.amazon.co.uk/Between-Two-Fires-Christopher-Buehlman/dp/1472269837', filename: 'between-two-fires.jpg' },

    // Classics
    { url: 'https://www.amazon.co.uk/Heart-Darkness-Penguin-Classics-Conrad/dp/0141441674', filename: 'heart-of-darkness.jpg' },
    { url: 'https://www.amazon.co.uk/All-Quiet-Western-Front-Vintage/dp/0099532816', filename: 'all-quiet.jpg' },
    { url: 'https://www.amazon.co.uk/True-Grit-Charles-Portis/dp/1408891832', filename: 'true-grit.jpg' },

    // Non-fiction
    { url: 'https://www.amazon.co.uk/Walk-Woods-Bill-Bryson/dp/1784161446', filename: 'walk-in-woods.jpg' },
    { url: 'https://www.amazon.co.uk/Humans-Brief-History-Fcked-All/dp/1472263995', filename: 'humans-brief-history.jpg' },

    // Leadership
    { url: 'https://www.amazon.co.uk/Infinite-Game-Simon-Sinek/dp/0241385636', filename: 'infinite-game.jpg' },
    { url: 'https://www.amazon.co.uk/Five-Dysfunctions-Team-Leadership-Fable/dp/0787960756', filename: 'five-dysfunctions.jpg' },
    { url: 'https://www.amazon.co.uk/First-90-Days-Strategies-Expanded/dp/1422188612', filename: 'first-90-days.jpg' },
    { url: 'https://www.amazon.co.uk/Turn-Ship-Around-Building-Breaking/dp/0241250943', filename: 'turn-ship-around.jpg' },
    { url: 'https://www.amazon.co.uk/Drive-Daniel-H-Pink/dp/184767769X', filename: 'drive.jpg' },
];

const outputDir = path.join(__dirname, 'images', 'books');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                const file = fs.createWriteStream(filepath);
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            } else {
                reject(new Error(`Failed to download: ${response.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function scrapeBookCover(page, url, filename) {
    try {
        console.log(`Fetching: ${filename}...`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait for the main product image to load
        await page.waitForSelector('#landingImage, #imgBlkFront, #ebooksImgBlkFront', { timeout: 10000 });

        // Extract the image URL
        const imageUrl = await page.evaluate(() => {
            const img = document.querySelector('#landingImage, #imgBlkFront, #ebooksImgBlkFront');
            if (img) {
                // Get the highest resolution version
                return img.getAttribute('data-old-hires') ||
                       img.getAttribute('data-a-dynamic-image')?.split('"')[1] ||
                       img.src;
            }
            return null;
        });

        if (!imageUrl) {
            console.error(`  ✗ Could not find image for ${filename}`);
            return false;
        }

        // Download the image
        const filepath = path.join(outputDir, filename);
        await downloadImage(imageUrl, filepath);
        console.log(`  ✓ Downloaded ${filename}`);
        return true;

    } catch (error) {
        console.error(`  ✗ Error with ${filename}: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('Starting book cover download...\n');
    console.log(`Output directory: ${outputDir}\n`);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set a realistic user agent to avoid blocking
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    let successful = 0;
    let failed = 0;

    for (const book of books) {
        const result = await scrapeBookCover(page, book.url, book.filename);
        if (result) {
            successful++;
        } else {
            failed++;
        }

        // Add a small delay between requests to be polite
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    await browser.close();

    console.log('\n=================================');
    console.log(`✓ Successfully downloaded: ${successful}`);
    console.log(`✗ Failed: ${failed}`);
    console.log(`Total: ${books.length}`);
    console.log('=================================\n');
}

main().catch(console.error);
