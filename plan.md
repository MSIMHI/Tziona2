# Plan: Adapting Static HTML Product Page to Shopify Theme

## Overview
Convert the Tailwind-based static HTML product detail page into a Shopify Liquid section that integrates with the theme's structure and Shopify product data.

---

## Phase 1: Structure Analysis & Mapping

### 1.1 Component Mapping
**Static HTML → Shopify Equivalent:**
- Breadcrumb navigation → Shopify breadcrumb snippet (or custom)
- Product gallery → `product-media-gallery.liquid` snippet (adapt)
- Product info section → `main-product.liquid` section blocks
- Color selector → `product-variant-picker.liquid` (color swatches)
- Size selector → `product-variant-picker.liquid` (size buttons)
- Add to cart button → `buy-buttons.liquid` snippet
- Accordion sections → `collapsible_tab` blocks
- Related products → `related-products.liquid` section
- Recently viewed → Custom section or app integration

### 1.2 Layout Structure
- **Current Static:** 2-column grid (gallery left, info right in RTL)
- **Shopify Equivalent:** `product--media_position` settings
- **Maintain:** RTL-first layout

---

## Phase 2: Section File Modifications

### 2.1 Main Product Section (`sections/main-product.liquid`)
**Tasks:**
- Replace/adapt the product info wrapper to match static design
- Update block structure:
  - Vendor block (text, uppercase)
  - Title block
  - Price block
  - Variant picker (color swatches + size grid)
  - Quantity selector
  - Buy buttons (yellow primary button style)
  - DREAM CARD points block (custom)
  - MY LIST/wishlist button (custom block or app)
  - Service icons row (custom block)
  - Collapsible tabs (details, brand, shipping, technical)

### 2.2 Product Media Gallery (`snippets/product-media-gallery.liquid`)
**Tasks:**
- Adapt to match static layout:
  - Vertical thumbnail strip on left (RTL)
  - Main image display
  - Zoom/share buttons on hover
  - Sticky positioning for gallery

---

## Phase 3: Styling & CSS

### 3.1 CSS File Strategy
- **Option A:** Create new `section-main-product-custom.css`
- **Option B:** Extend existing `section-main-product.css`
- **Remove:** Tailwind dependencies
- **Convert:** Tailwind classes to custom CSS:
  - Grid layouts → CSS Grid/Flexbox
  - Spacing utilities → Custom spacing variables
  - Color scheme → Theme color variables
  - Dark mode → Theme color schemes

### 3.2 Key Style Conversions
- Yellow primary button (`bg-primary`) → Theme button styles
- RTL spacing (`space-x-reverse`) → Logical properties
- Material Icons → SVG icons or icon font
- Dark mode classes → Shopify color schemes
- Responsive breakpoints → Theme breakpoints

---

## Phase 4: Custom Blocks & Features

### 4.1 New Custom Blocks Needed

**1. DREAM CARD Points Block**
- Display points calculation
- Links to join/login
- Conditional display

**2. Service Icons Block**
- 4 icons: Shipping, Exchange, Return, Gift
- Icon + text layout
- Hover states

**3. MY LIST/Wishlist Block**
- Wishlist button
- Integration with wishlist app or custom

**4. "LAST CALL" Badge Block**
- Conditional badge display
- Styling match

### 4.2 Block Settings (Schema)
- Toggle switches for each custom block
- Color scheme options
- Text customization
- Icon selection

---

## Phase 5: JavaScript Functionality

### 5.1 Required JS Features
- Variant selection (color/size)
- Image gallery navigation
- Accordion expand/collapse
- Zoom functionality
- Share functionality
- Add to cart AJAX
- Wishlist toggle

### 5.2 File Modifications
- `product-form.js` - variant handling
- `product-info.js` - product data updates
- **New:** `product-gallery-custom.js` - gallery interactions
- **New:** `product-accordion.js` - accordion behavior

---

## Phase 6: Shopify Data Integration

### 6.1 Liquid Variables Mapping
- `{{ product.vendor }}` → Brand name
- `{{ product.title }}` → Product title
- `{{ product.price }}` → Price display
- `{{ product.variants }}` → Color/Size options
- `{{ product.media }}` → Gallery images
- `{{ product.description }}` → Details accordion
- `{{ product.metafields }}` → Custom data (DREAM CARD points, etc.)

### 6.2 Metafields Needed
- `product.metafields.custom.dream_card_points` - Points calculation
- `product.metafields.custom.last_call` - Badge toggle
- `product.metafields.custom.brand_info` - Brand description
- `product.metafields.custom.technical_specs` - Technical data

---

## Phase 7: Related Products Integration

### 7.1 Related Products Section
- Use existing `related-products.liquid` section
- Match static design:
  - Grid layout (2/4/5 columns responsive)
  - Product cards with hover effects
  - Wishlist buttons
  - Price display
  - Badge support (BUY 400 PAY 200)

### 7.2 Recently Viewed
- **Option A:** Use Shopify app
- **Option B:** Custom section with localStorage
- Match static grid layout

---

## Phase 8: RTL & Accessibility

### 8.1 RTL Considerations
- All layouts use logical properties
- Text alignment: `text-align: start/end`
- Spacing: `margin-inline-start/end`
- Flexbox direction: RTL-aware
- Material Icons: RTL-flipped where needed

### 8.2 Accessibility
- ARIA labels for interactive elements
- Keyboard navigation
- Focus states
- Screen reader support
- Semantic HTML structure

---

## Phase 9: Responsive Design

### 9.1 Breakpoint Strategy
- **Mobile:** Stack layout (gallery top, info bottom)
- **Tablet:** 2-column with adjusted spacing
- **Desktop:** Full 2-column with sticky gallery

### 9.2 Mobile-Specific
- Thumbnail strip hidden on mobile
- Touch-friendly buttons
- Swipeable gallery
- Collapsed accordions by default

---

## Phase 10: Testing & Optimization

### 10.1 Testing Checklist
- [ ] Product variants selection
- [ ] Add to cart functionality
- [ ] Image gallery navigation
- [ ] Accordion interactions
- [ ] Responsive layouts
- [ ] RTL text rendering
- [ ] Dark mode (if implemented)
- [ ] Performance (Lighthouse)
- [ ] Cross-browser compatibility

### 10.2 Performance
- Lazy load images
- Optimize CSS (remove unused)
- Minify JavaScript
- Use Shopify CDN for assets

---

## Implementation Order

1. **Phase 1:** Analysis ✅ (Complete)
2. **Phase 3:** CSS Conversion (Create base styles)
3. **Phase 2:** Section Structure (Modify main-product.liquid)
4. **Phase 4:** Custom Blocks (Add new blocks)
5. **Phase 6:** Data Integration (Connect Liquid variables)
6. **Phase 5:** JavaScript (Add interactions)
7. **Phase 7:** Related Products (Style existing section)
8. **Phase 8:** RTL/Accessibility (Refine)
9. **Phase 9:** Responsive (Test all breakpoints)
10. **Phase 10:** Testing (Final QA)

---

## Files to Modify/Create

### Modify:
- `sections/main-product.liquid`
- `snippets/product-media-gallery.liquid`
- `snippets/buy-buttons.liquid`
- `assets/section-main-product.css`
- `assets/product-form.js`
- `assets/product-info.js`

### Create:
- `snippets/product-service-icons.liquid`
- `snippets/product-dream-card.liquid`
- `snippets/product-wishlist-button.liquid`
- `assets/section-main-product-custom.css` (optional)
- `assets/product-gallery-custom.js`

### Use Existing:
- `sections/related-products.liquid` (style to match)

---

## Key Design Elements to Preserve

1. ✅ Yellow primary button (`#F8E71C`)
2. ✅ RTL-first layout
3. ✅ Sticky gallery on desktop
4. ✅ Vertical thumbnail strip
5. ✅ Service icons row
6. ✅ DREAM CARD integration
7. ✅ Accordion sections
8. ✅ Related products grid
9. ✅ Dark mode support (if theme supports it)
10. ✅ Material Icons (or equivalent SVG)

---

## Notes

- This plan maintains the static design while integrating with Shopify's product system and theme architecture.
- All implementations should follow RTL-first best practices using logical properties.
- Ensure accessibility standards are met throughout.
- Performance optimization should be considered at each phase.
