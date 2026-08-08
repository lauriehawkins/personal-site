# Updating the Personal Site

## Overview

This site has four main sections: **Home**, **Professional**, **Fitness**, and **Nerd Stuff**.

Most sections are manually updated by editing HTML/CSS files directly and committing changes.

The **Nerd Stuff** section can be updated either manually or via Discord bot export.

---

## General Updates

### Home, Professional Pages

**To update content:**
1. Edit the relevant HTML file (`index.html`, `professional.html`)
2. Update text, stats, dates
3. Commit and push changes

### Fitness Page

**To update training block:**
1. Tell Claude Code: "I'm starting Block [number]"
2. Provide the training spreadsheet link
3. Claude will:
   - Read the new block's workout data from the spreadsheet
   - Update all 5 training sessions on `fitness.html`
   - Keep PRs, hero text, and layout unchanged
   - Commit and push

**To update Personal Records:**
- Edit the PRs section in `fitness.html` manually, or
- Tell Claude the new PR values (Squat, Bench, Deadlift)

**To add photos to Home page:**

Option A (easiest):
1. Add photo files to `images/home/`
2. Tell Claude: "I added X new photos" (with optional descriptions)
3. Claude will categorize them and update `home-photos.js`

Option B (faster):
1. Add photo files to `images/home/`
2. Tell Claude which category each photo belongs to:
   - **cola** - Photos featuring Cola
   - **travel** - Travel/vacation photos
   - **outdoors** - Hiking, outdoor activities
   - **people** - Group photos, social events
   - **landscapes** - Scenic views, nature
   - **fitness** - Gym, training, competitions
   - **candid** - Casual everyday moments
3. Claude updates `home-photos.js` and commits

The Home page randomly selects different photos on each visit (no duplicates per visit).

**Other images:**
- Add to appropriate `images/` subdirectory and reference in HTML

### Books Section

**To update:**
1. Edit `books.html` to add/remove books
2. Add book cover images to `images/books/`
3. Maintain the tabindex, role, and aria-label attributes for accessibility

---

## Nerd Stuff Updates (Discord Integration)

The Nerd Stuff page can be updated via Discord bot export to avoid manual HTML editing.

### Monthly Update Workflow

**1. Run the Discord bot export command:**
```
!export-nerd-content
```

**2. Bot outputs structured data** (see format below)

**3. Provide the export to Claude Code:**
- Paste the bot's JSON output
- Say "Here's this month's Nerd update"
- Claude will compare against current `nerd.html` and integrate only new content

**4. Claude handles:**
- Adding new battle reports
- Updating server stats
- Downloading and integrating new images
- **Adding new campaign maps to the existing slideshow** (maintains auto-rotation)
- Maintaining existing layout and style
- Committing and pushing changes

---

## Discord Bot Export Format

The bot should implement `!export-nerd-content` that outputs:

```json
{
  "exportDate": "2026-08-31",
  "serverStats": {
    "members": 52,
    "totalMessages": 14320,
    "activeCampaigns": 1,
    "completedBattles": 8
  },
  "battleReports": [
    {
      "id": "unique-message-id",
      "title": "Battle of Kharon Reach",
      "date": "2026-08-15",
      "author": "Username",
      "channel": "#battle-reports",
      "content": "Full battle report text goes here...",
      "participants": ["Imperium", "Tyranids"],
      "outcome": "Imperial Victory",
      "images": [
        {
          "url": "https://cdn.discordapp.com/...",
          "filename": "battle-kharon-1.jpg"
        }
      ]
    }
  ],
  "campaignMaps": [
    {
      "phase": "Phase 3: The Siege",
      "date": "2026-08-10",
      "url": "https://cdn.discordapp.com/...",
      "filename": "kharon-phase3.jpg",
      "description": "Map showing Imperial advance on southern continent"
    }
  ],
  "note": "New campaign maps are automatically added to the existing map slideshow, which rotates through all phases showing progression over time",
  "hobbyShowcase": [
    {
      "title": "Painted Hive Tyrant",
      "date": "2026-08-20",
      "author": "Username",
      "url": "https://cdn.discordapp.com/...",
      "filename": "tyrant-painted.jpg"
    }
  ],
  "campaignNarrative": {
    "currentPhase": "Phase 3: The Siege Begins",
    "summary": "The Imperium has established a beachhead on Kharon's southern continent. Tyranid resistance is fierce..."
  }
}
```

### What the Bot Should Track

**Channels to monitor:**
- `#battle-reports` - Battle narratives and outcomes
- `#campaign-maps` - Map progression images
- `#hobby-showcase` - Painted miniatures and hobby work
- `#campaign-updates` - Story progression

**Server stats to export:**
- Total member count
- Message activity (total or by channel)
- Number of battles/games tracked
- Any custom metrics your bot already tracks

**For each battle report:**
- Message ID (to avoid duplicates)
- Title/subject
- Date posted
- Author
- Full message content
- Attached images (URLs + suggested filenames)
- Participants/factions
- Outcome/result

**For images:**
- Discord CDN URL
- Suggested filename (descriptive, kebab-case)
- Date uploaded
- Any caption/description from the message

---

## Bot Implementation Notes

### Required Bot Capabilities

The Discord bot needs to:
1. **Read message history** from specific channels
2. **Access message attachments** (images)
3. **Query server stats** (member count, etc.)
4. **Output formatted JSON**

### Suggested Bot Command

```
!export-nerd-content [--since YYYY-MM-DD]
```

**Options:**
- No arguments: Export everything the bot can see
- `--since`: Only export content posted after this date

### Output Location

Bot should either:
- Output JSON to Discord (if not too large)
- Upload JSON file to Discord as attachment
- Write to a file that can be copied/pasted

---

## Manual Nerd Stuff Updates (Alternative)

If bot export isn't available, you can manually edit `nerd.html`:

### Adding a Battle Report

Find the battle reports section and add:

```html
<div class="highlight-card featured">
    <div class="highlight-header">
        <h3>Battle Title</h3>
        <div class="battle-tags">
            <span class="tag">Date</span>
            <span class="tag">Factions</span>
        </div>
    </div>
    <div class="battle-story">
        <p>Battle narrative...</p>
        <blockquote>Memorable moment...</blockquote>
    </div>
</div>
```

### Updating Stats

Find the stats section and update numbers:

```html
<div class="nerd-stat-card">
    <div class="nerd-stat-icon">👥</div>
    <div class="nerd-stat-value">52</div>
    <div class="nerd-stat-label">Active Members</div>
</div>
```

### Adding Images

1. Add image file to `images/nerd/`
2. Reference in HTML: `<img src="images/nerd/filename.jpg" alt="description">`

### Adding Campaign Maps to Slideshow

The Nerd Stuff page has an **auto-rotating campaign map slideshow** showing progression over time.

When a new campaign map is added:

1. Download image to `images/nerd/` (e.g., `kharon-phase4.jpg`)
2. Find the `.map-slideshow` section in `nerd.html`
3. Add a new slide:

```html
<div class="map-slide">
    <div class="map-header">
        <h3>Phase 4: Title</h3>
        <span class="map-date">Date</span>
    </div>
    <div class="map-container">
        <img src="images/nerd/kharon-phase4.jpg" alt="Campaign map phase 4">
    </div>
    <div class="map-description">
        Description of what changed in this phase...
    </div>
</div>
```

4. Add indicator dot:

```html
<div class="map-indicators">
    <span class="indicator"></span>
    <span class="indicator"></span>
    <span class="indicator"></span>
    <span class="indicator active"></span> <!-- New map is active -->
</div>
```

**The slideshow automatically rotates** through all phases, showing campaign progression over time.

**When using Discord bot export:** New campaign maps in the export are automatically added to this slideshow structure, maintaining the auto-rotation behavior.

---

## Deployment

The site deploys automatically via **Cloudflare Workers** when changes are pushed to the `main` branch.

**To deploy:**
```bash
git add .
git commit -m "Update: description of changes"
git push
```

Cloudflare picks up changes and deploys within 1-2 minutes.

---

## Maintenance

### Dark Mode

- Default theme is **dark mode** for new visitors
- Theme preference saved in `localStorage`
- Toggle implementation in `dark-mode.js`
- Theme applied inline in each HTML page to prevent flash

### Photo Library (Home Page)

- Photos in `images/home/` directory
- Selection logic in `home-photos.js`
- Categorized by: cola, travel, outdoors, people, landscapes, fitness, candid
- Dynamic selection prevents duplicates per page load

### Color Palettes

Each section has a distinct identity:

- **Professional:** Indigo/violet (`#1E1B4B`, `#6366F1`, `#8B5CF6`)
- **Fitness:** Navy + burnt orange (`#0B0B45`, `#CC5500`)
- **Nerd Stuff:** Petrol/teal/sage (`#081B2A`, `#0E3A4A`, `#1D6A7A`)
- **Global:** Purple accent (`#667eea`, `#764ba2`)

---

## Questions?

For technical questions or updates, work with Claude Code in the repository context. The assistant understands the site structure and can:
- Integrate Discord bot exports
- Update content while maintaining design
- Add new sections or features
- Fix bugs or improve accessibility
