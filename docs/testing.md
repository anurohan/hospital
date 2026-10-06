# Testing Guide

## Testing Strategy

### Phase 0 (Current)
- TypeScript strict mode — type errors are compile-time tests
- ESLint — code quality enforcement
- Manual browser testing

### Phase 1+
- Unit tests: Vitest + React Testing Library
- Integration tests: Supabase test helpers
- E2E tests: Playwright

---

## Running Checks

```bash
# TypeScript
npx tsc --noEmit

# Lint
npm run lint

# Build (catches all issues)
npm run build
```

---

## Manual QA Checklist

### Homepage
- [ ] Hero loads without FOUC
- [ ] Quick book form renders
- [ ] Departments grid is responsive
- [ ] Footer emergency number is visible
- [ ] Mobile hamburger menu opens/closes
- [ ] All CTA buttons link correctly

### Performance
- [ ] Lighthouse score > 85 on mobile
- [ ] No layout shift (CLS < 0.1)
- [ ] Images are optimized (Next.js Image)
- [ ] Fonts load without flicker

### Accessibility  
- [ ] Tab navigation works throughout
- [ ] Focus rings visible
- [ ] Screen reader announces headings
- [ ] Color contrast passes AA

---

## Known Lint Rules

ESLint config: `eslint.config.mjs`  
Uses `eslint-config-next` which includes React, TypeScript, and accessibility rules.
