# Royal Stays — Landing Page

**Where Elegance Meets Comfort** — a responsive, accessible landing page for Royal Stays hotel built with plain HTML, CSS and vanilla JavaScript.

---

## Files
- `index.html` — main markup (semantic sections, SEO meta + JSON-LD).
- `style.css` — responsive styling, theme support, focus states.
- `script.js` — UI behaviour: theme persistence, booking & contact validation, carousel, scroll-spy, small UX polish.
- `img/` — images (place your assets here).

---

## Highlights / Features
- Clean, minimal luxury design using Playfair Display (headings) + Inter (body).
- Primary palette: **Gold (#FFD700)** and **Royal Blue (#0B3D91)**.
- Hero, Rooms, Booking form, Facilities, Testimonials carousel, Gallery (static thumbnails), Contact form, Footer.
- Accessibility improvements:
  - Skip link
  - ARIA roles and `aria-live` for error messages
  - Visible focus outlines for keyboard users
- UX & polish:
  - Theme toggle with `localStorage` persistence (light/dark)
  - Booking form: prevents past dates and ensures check-out > check-in
  - Contact form: client-side validation + modal confirmation (no `alert()`)
  - Testimonials carousel with indicators, pause on hover, keyboard support
  - Scroll-spy that highlights the active nav link while scrolling
- Performance:
  - `preconnect` to Google Fonts and `loading="lazy"` on gallery images
  - Respect for `prefers-reduced-motion`
  
---

## Local development
1. Clone the repo (or copy files) into a folder.
2. Open `index.html` in your browser (no server required).
3. To work with live reload, use a simple local server (optional):
   ```bash
   # Python 3
   python -m http.server 8000
   # then open http://localhost:8000
