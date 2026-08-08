# Personal Site

A multi-page personal website with sections for:
- **Home** - Introduction with dynamic photo selection
- **Professional** - Engineering leadership and platform work
- **Fitness** - Training program and personal records
- **Nerd Stuff** - Warhammer campaign tracking and battle reports
- **Books** - Visual bookshelf collection

## Running Locally

Simply open `index.html` in a browser, or use a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`

## Updating Content

See **[UPDATING.md](UPDATING.md)** for detailed instructions on:
- Updating page content
- Monthly Nerd Stuff updates via Discord bot export
- Adding photos and images
- Deployment to Cloudflare Workers

## Features

- **Dark mode by default** with persistent theme preference
- **Dynamic photo selection** on Home page (no duplicates per visit)
- **Distinct color identities** for each main section
- **Accessible** - keyboard navigation, ARIA labels, focus states
- **Responsive** - works on desktop, tablet, and mobile
