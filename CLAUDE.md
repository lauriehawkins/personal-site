# Project Context for Claude Code

This is **Laurie Hawkins' personal website** - deliberately NOT just a professional portfolio.

The site shows both professional credibility for job applications AND Laurie as an actual person with interests outside work.

## Navigation Structure

**Primary navigation:**
```
Home | Professional | Fitness | Nerd Stuff
```

**Books** exists as a separate page but is intentionally NOT a primary navigation item. It is discovered from the Home page.

Do not add Books to the primary navigation.

## General Working Rule

**Prefer small, surgical changes.**

- Do not broadly redesign sections when asked for a targeted fix
- Do not refactor unrelated files during visual/content changes
- Preserve working layouts unless explicitly asked to change them
- Make the smallest change necessary to accomplish the request

## Dark Mode

**Dark mode is the intended/default visual experience.**

- New visitors default to dark mode
- Manually selected light/dark preference stored in `localStorage`
- Each HTML page applies theme inline (before rendering) to avoid flash
- **Do NOT remove inline theme initialization when editing pages**

Theme files: `dark-mode.js` + inline `<script>` in each HTML `<body>`

## Section Color Identities

### Professional
- **Indigo/violet identity** - restrained and technical
- Hero gradient: `#17203A → #312E81 → #7C3AED`
- Accents: `#6366F1`, `#8B5CF6`, `#C4B5FD`, `#F3F0FF`
- Dark surfaces with violet/indigo highlights
- Impact cards, timeline, capability map center node use this palette

### Fitness
- **Navy + burnt orange**
- Key colors: `#0B0B45` (deep navy), `#CC5500` (burnt orange)
- Hero gradient: `#0B0B45 → #1a1a5e → #CC5500`
- Energetic but not fluorescent/pink
- Used on: hero, workout borders, section headings, bullets, PRs

### Nerd Stuff
- **Petrol/teal/sage palette**
- Key colors: `#081B2A`, `#0E3A4A`, `#1D6A7A`, `#7FA6A0`, `#E7E2D6`
- Hero gradient: `#081B2A → #0E3A4A → #1D6A7A`
- Atmospheric rather than neon/cyan
- Used on: hero, stat cards, map headers, battle tags, channel bars

**Do not replace these palettes with generic bright SaaS colors.**

## Professional Page Guardrails

### Capability Map ("What I Do")
The orbital layout is intentional:
- **Platform Engineering** is the central circular hub
- Other capabilities arranged in a circle around it
- Uses CSS transforms with `--angle` variables
- **Do NOT flatten into a grid/list** unless explicitly asked
- Only change colors/styling, not the orbital structure

### Impact Section Layout
The card layout is intentional:
```
[Large card] [Large card]
[Large card] [Large card]
[Small]  [Small]  [Small]
```

Do not reintroduce uneven/left-aligned card widths.

## Fitness Workflow

### What's Displayed
The Fitness page shows **the five sessions Laurie is currently training**.

### Public Copy Deliberately Avoids
- "Week 1", "Week 2", etc.
- Dates
- Long-term programme/block terminology

### Current Hero Copy
```
What I'm Training
5 sessions
Plus mountain biking, hiking, learning to ski, the occasional parkrun, and running with the dog.
```

### Update Process
When Laurie says **"I'm starting Block 3"** (or similar):
1. He'll provide his training spreadsheet
2. Read the new block's workout data
3. Update the five sessions in `fitness.html`
4. Keep PRs, hero, and layout unchanged

### Do NOT
- Connect the website directly to Google Sheets
- Automatically sync the spreadsheet
- Build week selectors
- Expose internal block numbers unless Laurie explicitly asks
- Change the hero copy without being asked

**Source of truth:** Laurie's private spreadsheet (provided when updating)

## Home Page Photography

### Dynamic Photo System
- Photos stored in `images/home/`
- Selection logic in `home-photos.js`
- Photos categorized: cola, travel, outdoors, people, landscapes, fitness, candid
- Randomly selected into predefined layout slots
- No duplicates during a single visit
- **Final Cola photo is intentionally locked** ("Told you he was photogenic")

### Do NOT
- Turn Home into a conventional gallery
- Create an Instagram-style grid
- Remove the dynamic selection system
- Change the locked final Cola photo

## Books Section

**Books is a visual personality section, NOT a recommendation/review system.**

### What It Is
- Visual bookshelf with real published cover artwork
- Accessible via keyboard (tabindex, role, aria-label)
- Books not clickable (no cursor:pointer)
- Info overlay shows on hover/focus

### What It's NOT
- No ratings or reviews
- No progress tracking
- No genre filters
- No "currently reading" status
- No recommendation badges

### Current Implementation
- Mix of JPG and WebP formats (WebP from Amazon UK)
- Covers in `images/books/`
- 30 books with varied sizes and subtle rotations

## Nerd Stuff

### Campaign Structure
- Kharon Reach narrative is intentionally visual and story-driven
- **Campaign map slideshow** shows progression over time
- Multiple phases auto-rotate (Phase 1 → 2 → 3, etc.)

### When Adding Campaign Maps
**Preserve the slideshow behavior:**
- Add new maps as new slides (don't replace existing)
- Update indicator dots
- Maps show campaign progression timeline
- Auto-rotation continues through all phases

### Update Process
Discord bot export workflow documented in `UPDATING.md`.

Bot outputs structured JSON → Claude integrates new content → keeps existing layout.

## Deployment

**Production URL:** `https://lauriehawkins.co.uk`

**Cloudflare Worker:** `personal-site`

**Workers URL:** `personal-site.lauriehawkins85.workers.dev`

### How It Works
- Pushes to `main` branch automatically trigger Cloudflare deployment
- Worker serves static assets from repository root
- `.assetsignore` prevents uploading `node_modules` (required for deployment)

### Do NOT
- Remove `.assetsignore`
- Try to configure Wrangler to point elsewhere
- Commit `node_modules` to the repo

## File Structure

### HTML Pages
- `index.html` - Home (dynamic photos)
- `professional.html` - Professional work
- `fitness.html` - Current training sessions
- `nerd.html` - Warhammer campaign
- `books.html` - Visual bookshelf

### Stylesheets
- `styles.css` - Global styles, Professional, Fitness (old), Nerd (old)
- `home.css` - Home page specific
- `professional-new.css` - Professional page (current implementation)
- `books.css` - Books page
- Dark mode styles integrated throughout

### JavaScript
- `dark-mode.js` - Theme toggle functionality
- `home-photos.js` - Dynamic photo selection
- `professional-new.js` - Professional page interactions
- `download-book-covers.js` - Puppeteer script for book covers (not run in production)

### Documentation
- `README.md` - Project overview and local setup
- `UPDATING.md` - Detailed content update workflows (READ THIS for recurring updates)
- `CLAUDE.md` - This file (project context for Claude)

## Documentation

**For recurring content updates, read `UPDATING.md` first.**

It contains detailed workflows for:
- Updating Fitness training blocks
- Monthly Nerd Stuff updates via Discord bot
- Adding photos to Home
- Adding books
- Deployment info

## Common Requests

### "Update Fitness to Block N"
1. Read the spreadsheet Laurie provides
2. Update workout sessions (Day 1-5) in `fitness.html`
3. Keep hero, PRs, layout unchanged
4. Commit and push

### "I added photos"
1. Check `images/home/` for new files
2. Categorize them (ask Laurie if unclear)
3. Add to appropriate categories in `home-photos.js`
4. Commit and push

### "Monthly Nerd update"
1. Receive Discord bot JSON export
2. Compare against current `nerd.html`
3. Add new battle reports, update stats, download new images
4. Add new campaign maps to slideshow (don't replace existing)
5. Commit and push

### "Update PRs"
Laurie will say something like: "Squat 220kg, Bench 130kg, Deadlift 265kg"
- Update the three PR values in `fitness.html`
- Recalculate the gains from 2023 baseline
- Commit and push

## What NOT to Do

- ❌ Add Books to primary navigation
- ❌ Redesign sections when asked for small fixes
- ❌ Connect Fitness to live Google Sheets
- ❌ Flatten the Professional capability map
- ❌ Remove dark mode inline initialization
- ❌ Turn Home into a photo gallery grid
- ❌ Add ratings/reviews to Books
- ❌ Replace campaign map slideshow with single image
- ❌ Change section color palettes without explicit request
- ❌ Remove `.assetsignore`
- ❌ Refactor unrelated files during targeted changes

## Accessibility

The site maintains:
- Keyboard navigation throughout
- Focus states on all interactive elements
- ARIA labels where semantically appropriate
- Books accessible via keyboard (tabindex, role, aria-label)
- Theme toggle has proper aria-label
- Navigation uses aria-current for active page

Do not remove accessibility features when editing.

## When You're Unsure

1. Read `UPDATING.md` for common workflows
2. Check this file for design guardrails
3. Ask Laurie before making structural changes
4. Default to smaller, surgical changes
5. Preserve working behavior unless explicitly asked to change it
