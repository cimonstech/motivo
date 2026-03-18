# Motivo Studio — Stack & Technical Documentation

A premium creative agency website for Motivo, based in Accra, Ghana. Built with Next.js, featuring an AI-powered contact intake, 3D visuals, and a modern design system.

---

## Table of Contents

1. [Core Stack](#core-stack)
2. [Frontend](#frontend)
3. [Backend & API](#backend--api)
4. [Infrastructure & Services](#infrastructure--services)
5. [Security](#security)
6. [Environment Variables](#environment-variables)
7. [Project Structure](#project-structure)

---

## Core Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **Fonts** | Ranade (display), DIN (sans) — local fonts |

---

## Frontend

### Animation & Motion

- **GSAP** — Scroll-driven animations, hero entrance, pinning, timeline scrubbing
- **GSAP ScrollTrigger** — Hero scroll animation, parallax effects
- **Framer Motion** — UI transitions, micro-interactions
- **Lenis** — Smooth scrolling

### 3D & Graphics

- **Three.js** — 3D scene rendering
- **React Three Fiber** — React bindings for Three.js
- **@react-three/drei** — Helpers (OrbitControls, etc.)
- **HeroCanvas** — Custom animated sphere with particles
- **OrbCanvas** — Liquid orb effect on contact page

### UI Utilities

- **clsx** — Conditional class names
- **tailwind-merge** — Merge Tailwind classes without conflicts
- **class-variance-authority** — Component variants
- **lucide-react** — Icons

### Validation & Utilities

- **Zod** — Schema validation
- **@t3-oss/env-nextjs** — Environment variable validation (optional)

---

## Backend & API

### API Routes

| Route | Purpose |
|-------|---------|
| `/api/chat` | AI chat stream (Claude) — conversational intake |
| `/api/summarize` | AI summary of conversation — brief generation |
| `/api/send-brief` | Email brief to client + Motivo team |

| `/api/notify-email` | Lead capture — email when user submits contact |

### AI (Anthropic)

- **Model:** Claude Sonnet 4 (`claude-sonnet-4-20250514`) for chat
- **Model:** Claude Haiku 4 (`claude-haiku-4-5-20251001`) for summarization
- **Streaming:** SSE (Server-Sent Events) for real-time chat responses
- **Context:** Motivo portfolio, services, and project history included in system prompt

### Email (Resend)

- **Provider:** Resend
- **Templates:** HTML emails for briefs, lead notifications
- **From:** `hello@thisismotivo.com` (Motivo Intake / Motivo Studio)

---

## Infrastructure & Services

### Upstash Redis

- **Purpose:** Rate limiting for API routes
- **Packages:** `@upstash/ratelimit`, `@upstash/redis`
- **Algorithm:** Sliding window (30 requests per minute per IP)
- **Fallback:** In-memory rate limiting when env vars are not set (e.g. local dev)
- **Analytics:** Enabled for monitoring blocked requests

### Cloudflare R2

- **Purpose:** Asset storage (images, logos, email assets)
- **URL:** `NEXT_PUBLIC_R2_BASE_URL` (e.g. `https://assets.motivo.studio`)
- **Domains:** `assets.thisismotivo.com`, `assets.motivo.studio`, R2 public bucket

### Hosting & Deployment

- **Domain:** `thisismotivo.com` (www redirects to apex)
- **Redirects:** `www.thisismotivo.com` → `https://thisismotivo.com`

---

## Security

### Middleware

- **Rate limiting:** 30 req/min per IP for `/api/chat`, `/api/notify-email`, `/api/send-brief`, `/api/summarize`
- **Origin check:** Only requests from allowed origins (production + localhost)
- **Headers:** All responses set security headers

### Security Headers

| Header | Value |
|--------|-------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-DNS-Prefetch-Control` | `on` |

### Input Validation & XSS

- **`escapeHtml()`** — All user content in email templates (`notify-email`, `send-brief`)
- **`isValidEmail()`** — Email format + max length (254 chars)
- **`sanitizeString()`** — Max length, trim for messages and summaries

### Limits

| Input | Limit |
|-------|-------|
| Chat messages | 30 per request, 2000 chars each |
| Brief messages | 50 per request, 2000 chars each |
| Summary | 2000 chars |
| Email | 254 chars |

### Error Handling

- Generic error messages returned to clients
- No stack traces or internal details exposed
- API key missing → "Service temporarily unavailable"

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes (prod) | Anthropic API key for AI chat |
| `RESEND_API_KEY` | Yes (prod) | Resend API key for emails |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis URL (fallback: in-memory) |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Redis token |
| `NEXT_PUBLIC_SITE_URL` | No | Site URL (default: `https://thisismotivo.com`) |
| `NEXT_PUBLIC_R2_BASE_URL` | No | R2 asset base URL (e.g. `https://assets.motivo.studio`) |

### R2 (Cloudflare)

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── chat/
│   │   ├── notify-email/
│   │   ├── send-brief/
│   │   └── summarize/
│   ├── about/
│   ├── contact/
│   ├── work/
│   │   └── [slug]/          # Project detail
│   ├── layout.tsx
│   ├── page.tsx
│   ├── opengraph-image.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── about/
│   ├── contact/             # AiChatWidget, ContactSidebar
│   ├── layout/              # Navbar, Footer
│   ├── sections/            # Hero, FeaturedWork, Services, etc.
│   ├── three/               # HeroCanvas, OrbCanvas, LiquidOrb
│   ├── ui/                  # AvailabilityCard, FloatingPills, etc.
│   └── providers/          # LenisProvider, RouteCleanup
├── data/                    # projects, services, team, categories
├── hooks/                   # useMediaQuery, useLenis, useGSAP
├── lib/
│   ├── constants.ts
│   ├── redis.ts             # Upstash Redis client
│   ├── r2.ts                # R2 asset URLs
│   ├── safeNavigate.ts      # GSAP cleanup before navigation
│   ├── security.ts          # escapeHtml, isValidEmail, sanitizeString
│   └── utils.ts
└── middleware.ts            # Rate limit, origin check, headers
```

---

## Key Features

- **Responsive:** 768px breakpoint for mobile layouts
- **AI Chat:** Streaming contact intake with brief summarization
- **3D Hero:** Animated sphere with particles on homepage
- **Smooth scroll:** Lenis-powered scrolling
- **Safe navigation:** GSAP/ScrollTrigger cleanup to avoid Three.js errors

---

*Last updated: March 2025*
