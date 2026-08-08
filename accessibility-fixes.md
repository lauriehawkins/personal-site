# Site-wide Consistency & Accessibility Audit

## Issues Found

### Visual Consistency
1. **Max widths:** Inconsistent (900px, 1200px, 1400px, 800px, 700px)
2. **Border radius:** 4px, 8px, 12px, 15px, 16px, 20px, 25px, 50px (too many)
3. **Body background:** #f4f4f4 in styles.css, #ffffff in home.css
4. **Navigation:** No active state ARIA, missing focus states
5. **Footer treatment:** Identical across pages ✓
6. **Responsive breakpoints:** Consistent at 768px and 1024px ✓

### Accessibility
1. **Focus states:** NONE across entire site - CRITICAL
2. **Books page:** cursor:pointer on non-interactive elements
3. **Books info:** Hover-only on desktop, inaccessible via keyboard
4. **Alt text:** Dynamic photos have placeholder alt text
5. **Dark mode toggle:** Has aria-label ✓
6. **Nav active state:** Uses .active class but no aria-current

### Typography
- Body text sizes vary: 1.05rem to 1.25rem
- Heading hierarchy appears consistent ✓

## Fixes to Apply
1. Add comprehensive focus states
2. Remove cursor:pointer from books, make info keyboard accessible
3. Standardize max-widths using CSS custom properties
4. Standardize common border radii
5. Add aria-current to active nav links
6. Improve dynamic photo alt text
