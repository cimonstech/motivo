# Motivo Studio

Accra's leading creative studio — brand identity, digital products, and physical fabrications.

## Setup

### 1. Install dependencies

```bash
npm install
```

If you hit disk space errors, free space and retry. If you see peer dependency conflicts with React 19, the project uses `@react-three/fiber` v9 and `@react-three/drei` v10 for React 19 compatibility.

### 2. Add fonts

Place these `.woff2` files in `public/fonts/` (download from [Fontshare](https://fontshare.com)):

- NouveauMontreal-Regular.woff2
- NouveauMontreal-Medium.woff2
- NouveauMontreal-Bold.woff2
- Satoshi-Regular.woff2
- Satoshi-Medium.woff2
- Satoshi-Bold.woff2

### 3. Add placeholder assets (optional)

Add these to `public/` when ready:

- `noise.png` — grain texture for `.noise` overlay
- `placeholder.jpg` — dark project placeholder
- `og-image.jpg` — 1200×630 social image
- `favicon.ico` / `apple-touch-icon.png` — or keep the SVG favicon

### 4. Environment

Copy `.env.example` to `.env.local` and fill in your values. Never commit `.env.local`.

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification checklist

- [ ] `npm run dev` starts without errors
- [ ] Dark background with white placeholder text
- [ ] Custom cursor (dot + ring) visible and moving
- [ ] Navbar with logo and nav links
- [ ] Footer with contact info
- [ ] Lenis smooth scroll (no bounce/jitter)
- [ ] Font families applied (DevTools → Computed → font-family)

## Project structure

- `src/components/` — UI components, layout, providers
- `src/app/` — App Router pages
- `src/data/` — Services, projects data
- `src/hooks/` — useMediaQuery, useLenis, useGSAP
- `src/lib/` — utils, constants, r2 helper

## Notes

- Use `r2("path/to/asset")` for all Cloudflare R2 asset URLs
- Register ScrollTrigger: `gsap.registerPlugin(ScrollTrigger)` before use
- Use `getLenis().scrollTo()` for scrolling — never `window.scrollTo` directly
