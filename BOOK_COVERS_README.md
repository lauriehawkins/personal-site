# Book Cover Management

The Books page displays 30 book covers using a mix of **JPG and WebP formats**.

Most covers are now **WebP files** downloaded from Amazon UK. Some original JPG files remain where they were already working.

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

## Current Cover Files

Covers are stored in `images/books/` as:
- **18 WebP files** (e.g., `dungeon-crawler-carl.webp`, `golden-son.webp`)
- **12 JPG files** (e.g., `all-quiet.jpg`, `watership-down.jpg`)

`books.html` references the correct format for each book.

## Expected Output (if running automation)

The script attempts to download covers but **Amazon now serves WebP format**, so some manual downloading may be required.

```
✓ Successfully downloaded: 24
✗ Failed: 6 (require manual download)
Total: 30
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
- Manual download from Amazon UK may be required (they now serve WebP format)
- Save WebP files directly to `images/books/`
- Update `books.html` to reference `.webp` extension

## What it does

- Uses Puppeteer (headless Chrome) to visit Amazon UK pages
- Extracts the highest quality cover image URL
- Downloads and saves with correct filenames
- Runs in about 1-2 minutes total

## Adding New Books

When adding new books to the site:

1. Download cover from Amazon UK, Goodreads, or publisher (WebP or JPG acceptable)
2. Save to `images/books/` with descriptive kebab-case filename
3. Update `books.html` to add new book entry with correct filename
4. Include proper accessibility attributes (`tabindex="0"`, `role="img"`, `aria-label`)

See `UPDATING.md` for detailed workflow.
