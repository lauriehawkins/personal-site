# Automated Book Cover Downloader

This script will automatically download all 30 book covers from Amazon.

## Quick Start

```bash
# 1. Install Puppeteer (one-time setup)
npm install puppeteer

# 2. Run the script
node download-book-covers.js
```

The script will:
- Visit each Amazon page
- Extract the high-resolution cover image
- Download it to `images/books/` with the correct filename
- Add a 2-second delay between requests to be respectful

## Expected Output

```
Starting book cover download...

Fetching: dungeon-crawler-carl.jpg...
  ✓ Downloaded dungeon-crawler-carl.jpg
Fetching: carls-doomsday.jpg...
  ✓ Downloaded carls-doomsday.jpg
...

=================================
✓ Successfully downloaded: 30
✗ Failed: 0
Total: 30
=================================
```

## Troubleshooting

**If Puppeteer fails to install:**
- Make sure Node.js is installed: `node --version`
- Try: `npm install puppeteer --unsafe-perm=true`

**If Amazon blocks the requests:**
- The script includes delays and a realistic user agent
- If it still fails, you can manually download using the guide in `images/books/DOWNLOAD_GUIDE.md`

**If some images fail:**
- The script will continue and report which ones failed
- You can manually grab the failed ones from the URLs in the script

## What it does

- Uses Puppeteer (headless Chrome) to visit Amazon pages
- Extracts the highest quality cover image URL
- Downloads and saves with correct filenames
- Runs in about 1-2 minutes total
