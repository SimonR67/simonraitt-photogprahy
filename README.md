# Aperture & Field — Photography Portfolio

A static, no-build-step website: plain HTML, CSS and vanilla JS. Open `index.html`
in a browser, or upload the whole folder to any static host (Netlify, Vercel,
GitHub Pages, or standard shared hosting).

## Structure

```
index.html      Home — hero, category grid, roadmap teaser
gallery.html    Full portfolio with category filters + lightbox
services.html   Booking info per category + print shop teaser
social.html     Instagram / Flickr feed page (currently sample images)
about.html      Bio, stats, kit list
contact.html    Enquiry form (front-end only — see below)
css/style.css   All styles, one file, organised by section
js/main.js      Nav toggle, gallery filter, lightbox, social tabs
```

## Replacing the placeholder images

Every image currently points to `picsum.photos/seed/...` so the layout can be
judged with real proportions before you have final photos. To swap in your
own work:

1. Add your images somewhere in the project, e.g. `images/gallery/`.
2. Replace each `src="https://picsum.photos/seed/..."` with your own file
   path, keeping the surrounding `data-title` / `data-exif` / `data-full`
   attributes on gallery items — the lightbox and filters read those.
3. Keep an eye on file size — compress large exports (under ~300KB per image
   is a good target for a portfolio site) so pages stay fast.

## The enquiry form

`contact.html` currently only shows a front-end "sent" confirmation — it
doesn't email anyone yet. To make it live, either:

- Point the form at a form backend (Formspree, Basin, Netlify Forms), or
- Wire it to your own backend/email service once you have one.

## Roadmap: the two upgrades already planned for

The site is deliberately simple now so these can be added without a rebuild.

### 1. Private client galleries

For a client to view (and later download) images from their own shoot behind
a login, you'll need a lightweight backend — this can't be done with static
HTML alone. A reasonable path:
- A small backend (e.g. Node/Express, or a hosted backend-as-a-service like
  Supabase or Firebase) to store per-client image sets and issue either a
  password or a unique unguessable link per gallery.
- An `/client/<gallery-id>` route that checks the password/link, then lists
  that client's images using the same gallery-grid and lightbox styles
  already in `style.css` — no new visual design needed, just new data.
- Optional: expiring links, download limits, or watermarked previews with
  unlocked full-res downloads after payment.

### 2. Print ordering

Two parts: a product/checkout layer, and image fulfilment.
- Checkout: Stripe Checkout or Shopify's buy-button are the fastest way to
  add "buy this print" to an existing static site without building a full
  e-commerce backend.
- Fulfilment: a print-on-demand lab (e.g. WhiteWall, Loxley, Printful-style
  services) can handle printing/shipping so you're not managing that
  yourself — you upload the high-res file per order.
- The `.print-card` component in `style.css`/`services.html` is already
  built for this — each card just needs a real "Buy print" button wired to
  checkout once it exists.

### 3. Live social feeds (partially covered now)

`social.html` currently shows sample images in the same layout the real feed
will use. To go live:
- **Flickr** is the simpler of the two: a free API key + your Flickr user ID
  is enough to pull recent uploads via `flickr.photos.getRecent` or a
  specific album via `flickr.photosets.getPhotos`. No app review needed.
- **Instagram** requires a Meta developer app connected to an Instagram
  Business or Creator account, using the Instagram Graph API (the older
  Basic Display API is being phased out). You'll need a long-lived access
  token, refreshed periodically. Because of the setup overhead, some
  photographers instead embed a third-party widget (e.g. SnapWidget,
  EmbedSocial) that handles the Instagram connection for a monthly fee —
  worth weighing against building it directly.

## Notes for whoever picks this up next

- Fonts are loaded from Google Fonts (Fraunces, Work Sans, IBM Plex Mono) via
  a CDN `<link>` — no local font files to manage.
- All interactive behaviour (filtering, lightbox, tabs, mobile nav) lives in
  `js/main.js` and is dependency-free, so it will keep working if this later
  moves into a framework-based rebuild, or can be lifted as-is.
- Colour and type tokens are defined once at the top of `style.css` as CSS
  variables — change the palette or fonts there rather than hunting through
  individual rules.
