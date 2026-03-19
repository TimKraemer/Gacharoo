---
name: beautiful-ui
description: Modern, polished UI design patterns for Gacharoo using Tailwind CSS, shadcn/ui, react-spring animations, and accessibility-first principles. Use when creating pages, layouts, landing pages, modals, card UIs, responsive design, or any user-facing interface. Also covers README design and marketing pages.
---

# Beautiful UI Patterns for Gacharoo

Gacharoo must look premium, polished, and high-end. Every screen should feel intentionally designed. No generic AI-generated look.

## Design System

### Color Palette (CSS Variables in Tailwind)

Use shadcn/ui theming with HSL variables. Define in `globals.css`:

- Light/dark mode support via `class` strategy
- Rarity colors as additional CSS variables:
  - `--rarity-common`: neutral gray
  - `--rarity-uncommon`: emerald green
  - `--rarity-rare`: sapphire blue
  - `--rarity-epic`: deep purple
  - `--rarity-legendary`: warm gold
- All rarity colors must pass 4.5:1 contrast ratio on both light and dark backgrounds

### Typography

- Display font: bold, distinctive, for card names and headings (load via `next/font`)
- Body font: clean, highly readable, for stats and descriptions
- Import from Google Fonts in `layout.tsx`. Never use system fonts as primary.
- Font sizes via Tailwind scale. Responsive: `text-sm md:text-base lg:text-lg`.

### Spacing and Layout

- Consistent spacing via Tailwind's spacing scale (4, 8, 12, 16, 24, 32, 48)
- Content max-width: `max-w-7xl mx-auto px-4`
- Card grids: `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4`
- Mobile-first: design for 375px width, scale up

## Component Patterns

### Cards (2D UI Cards, not 3D game cards)

Use shadcn/ui `Card` component as base. Extend with rarity-themed variants:

```tsx
<Card className={cn(
  "relative overflow-hidden transition-all duration-200",
  "hover:shadow-lg hover:-translate-y-0.5",
  rarityBorder[card.rarity]  // maps rarity to border color class
)}>
  <RaritySymbol rarity={card.rarity} className="absolute top-2 right-2" />
  {/* card content */}
</Card>
```

### Animations (react-spring)

Use `react-spring` for all UI animations (not CSS transitions -- they feel stiff for game UX):

```tsx
import { useSpring, animated } from "@react-spring/web"

function FadeIn({ children }: { children: React.ReactNode }) {
  const style = useSpring({
    from: { opacity: 0, transform: "translateY(8px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 280, friction: 24 },
  })
  return <animated.div style={style}>{children}</animated.div>
}
```

Respect `prefers-reduced-motion`:
```tsx
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
const style = useSpring({
  to: { opacity: 1 },
  immediate: prefersReducedMotion,  // skip animation
})
```

### Modals and Dialogs

Use shadcn/ui `Dialog` component. For game-specific modals (pack results, trade offers, battle results):
- Centered, with backdrop blur
- Spring-animated entry (scale from 0.95 + fade)
- Close on backdrop click AND Escape key
- Focus trap for accessibility

### Toast Notifications

Use shadcn/ui `Sonner` (toast library). For game events:
- Rare pull: celebratory toast with rarity color
- Trade offer received: actionable toast with Accept/Decline
- Battle result: toast with trophy/heart icon

### Loading States

- Skeleton loaders for card grids (pulsing card-shaped placeholders)
- `Suspense` boundaries per feature section (collection loads independently from trading)
- Never show a full-page spinner. Always show partial content.

## Page Patterns

### Landing Page (Pre-Auth)

Structure:
1. **Hero**: Bold headline ("Turn Anything Into a Card Game"), 3D card demo (R3F canvas showing a pack opening), primary CTA ("Get Started")
2. **How it works**: 3 steps with icons (Create -> Collect -> Battle)
3. **Card showcase**: Interactive 3D card you can tilt with mouse
4. **Social proof**: "X sets created, Y cards collected, Z trades completed" (real Umami numbers)
5. **Open source badge**: GitHub stars, "Self-host for free" link
6. **Footer**: Links to About, Monetization, Responsible Gaming, Impressum, Privacy, Open Source

Design: dark theme, subtle gradient backgrounds, card elements floating with parallax. No generic stock photos. Everything is our own 3D renders and UI.

### Game Pages

- **Collection book**: Grid of cards, dimmed silhouettes for unowned, completion bar at top, filter/sort controls
- **Pack opening**: Full-screen 3D canvas, centered pack, minimal UI chrome (pack count + timer in corner)
- **Trading**: Split view -- your duplicates (left), their collection (right), trade builder (bottom)
- **Battle Run**: Full-screen 3D battle scene with HUD overlay (hearts, trophies, team lineup)
- **Profile**: Card showcase at top, stats grid, achievement badges, set list

### Static Pages (About, Monetization, Responsible Gaming)

Clean, readable, content-focused:
- Max-width prose container (`max-w-prose mx-auto`)
- Clear headings hierarchy
- No marketing fluff -- honest, direct language
- Links to external resources (gambling help, privacy docs)

## Responsive Design

- **Mobile (375px)**: Single column, full-width cards, bottom navigation, swipe gestures
- **Tablet (768px)**: 2-3 column grid, sidebar navigation starts appearing
- **Desktop (1024px+)**: Full layout, hover effects active, keyboard shortcuts

Test on real devices. The 3D canvas must perform on 2020-era Android phones.

## Accessibility Checklist (Every Component)

- [ ] Interactive elements have visible focus rings (`focus-visible:ring-2`)
- [ ] Color is never the only indicator (rarity symbols accompany colors)
- [ ] Touch targets minimum 44x44px on mobile
- [ ] All images have `alt` text (or `alt=""` for decorative)
- [ ] Modals trap focus and close on Escape
- [ ] `prefers-reduced-motion` respected for all animations
- [ ] Contrast ratio 4.5:1 minimum for all text

## README / GitHub Page Design

The README is the project's landing page. Structure:

```markdown
# Gacharoo

> Turn anything into a trading card game.

[Screenshot/GIF of pack opening]

## What is Gacharoo?
[2-3 sentences]

## Try it
[Link to hosted version]

## Self-host (3 commands)
git clone ... && cp .env.example .env && docker compose up

## Features
[Bullet list with icons/emojis sparingly]

## Tech Stack
[Short list]

## Contributing
[Link to CONTRIBUTING.md]

## License
AGPL-3.0

## Note on AI
This project is developed with AI assistance...
```

Keep it scannable. A developer should understand what this is in 10 seconds.
