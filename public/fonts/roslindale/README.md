# Roslindale Display

This folder is used for the **Roslindale Display** font (the serif used for the hero line “for ambitious brands” and other display type).

## Where to store the font files

Add your font files **in this folder** (`public/fonts/roslindale/`). The site expects:

- **Regular weight:** name the file one of:
  - `roslindale-display-regular.woff2` (preferred), or
  - `roslindale-display-regular.ttf`

Supported formats:
- **TTF** — use the filename above; the app will load it via CSS.
- **WOFF2** — same name as above for the regular weight.

If you have multiple weights (e.g. light, medium), add them here and we can wire additional `@font-face` rules in `app/globals.css` for them.

Until at least one of these files is present, the site will fall back to **Georgia** for display text.
