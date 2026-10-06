# UI/UX Design Guide

## Design Direction

**Premium Healthcare SaaS** — Minimal, Modern, Trustworthy, Clean, Mobile-first

---

## Color Palette

| Token                    | Value     | Usage                          |
|--------------------------|-----------|--------------------------------|
| `--color-primary-700`    | `#0a6ebd` | Primary brand, buttons, links  |
| `--color-teal-500`       | `#00b4a0` | Accent, CTA buttons            |
| `--color-navy-900`       | `#0d1525` | Footer, dark sections          |
| `--color-gray-50`        | `#f8fafc` | Page background                |
| White                    | `#ffffff` | Cards, panels                  |

---

## Typography

| Role          | Font       | Weight  |
|--------------|------------|---------|
| Display/Heading | Lexend  | 600–700 |
| Body          | Inter      | 400–500 |
| UI Labels     | Inter      | 500–600 |

Loaded from Google Fonts. Fallback: system-ui, sans-serif.

---

## Component System

All components live in `components/ui/index.tsx`:

### Button
```tsx
<Button variant="primary" size="lg">Book Appointment</Button>
<Button variant="teal" size="md" loading={true}>Submitting...</Button>
<Button variant="outline">Learn More</Button>
```

### Card
```tsx
<Card hover padding="md">Content</Card>
```

### Badge
```tsx
<Badge variant="blue">Confirmed</Badge>
<Badge variant="success">Completed</Badge>
<Badge variant="danger">Cancelled</Badge>
```

### Input
```tsx
<Input label="Phone Number" type="tel" placeholder="+91 XXXXX XXXXX" />
```

---

## Layout

- **Container**: max-width 1280px, centered, 24px padding
- **Section**: 80px vertical padding (40px mobile)
- **Grid**: CSS Grid, auto-fill with min 280px columns
- **Breakpoints**: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)

---

## Animations

| Class              | Effect                          |
|-------------------|---------------------------------|
| `animate-fade-in` | Opacity 0→1 + 8px upward slide  |
| `animate-scale-in`| Scale 0.95→1 + opacity          |
| `animate-pulse-ring` | Pulsing glow ring (emergency) |
| `stagger-1..5`    | Animation delay 50–250ms        |
| `card-hover`      | Shadow lift + 2px translateY    |

---

## Accessibility

- Focus-visible outline on all interactive elements
- Semantic HTML (header, main, nav, section, footer)
- `aria-label` on icon-only buttons
- Contrast ratio target: WCAG AA (4.5:1)
- Single `<h1>` per page
- Unique IDs on all interactive elements
