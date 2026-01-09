# Blog Theme Rebuild - Complete Instructions

## Overview

Rebuild the Blog section of the Shopify theme from scratch, following the theme's architecture and design system. The blog must use a Tailwind-like utility-first design approach while maintaining full theme compliance.

---

## Context & References

### Design References
- `blog_template/` - Static HTML reference for blog listing layout (visual inspiration only)
- `post.html` - Static HTML reference for single article page (visual inspiration only)

**Important:** Use these files ONLY for visual structure and layout inspiration. Do NOT reuse their classes or CSS.

### Implementation References
- `sections/main-product.liquid` - **MUST READ** - Reference for:
  - Project structure
  - Class naming conventions (`tz-*` prefix)
  - Asset paths and loading patterns
  - Dark/Light mode implementation
  - RTL/LTR layout support
  - Hebrew locale detection

---

## Files to Implement

### Primary Files
1. **`sections/main-blog.liquid`** - Blog listing page
2. **`sections/main-article.liquid`** - Single blog post page

### Assets to Create
1. **`assets/tz-main-blog.css`** - All blog styling (Tailwind-like utility-first approach)
2. **`assets/tz-main-blog.js`** - Blog-specific JavaScript functionality

### Translation Keys
- Add all blog translation keys to `locales/en.default.json` with `blog.*` prefix

---

## Mandatory Rules

### 1. Custom Classes Only
- ✅ **Use:** All classes prefixed with `tz-*` (e.g., `tz-blog-section`, `tz-blog-article`)
- ❌ **Do NOT use:** Default theme classes (e.g., `main-blog`, `article-card`, `blog-articles`)
- ❌ **Do NOT use:** Classes from static HTML references

### 2. Theme Compliance

#### Dark / Light Mode
- Support both dark and light modes
- Use CSS variables for colors
- Follow pattern from `main-product.liquid`
- Use `.dark` class and `prefers-color-scheme` media queries

#### RTL / LTR Layouts
- Support both RTL and LTR layouts
- Use Hebrew locale detection (same pattern as `main-product.liquid`)
- Use logical properties and `[dir="rtl"]` selectors
- Test with Hebrew content

#### Theme Integration
- Use theme colors, spacing, typography, and containers
- Follow same structure and asset-loading patterns as `main-product.liquid`
- Match theme's design language and aesthetic

### 3. Translations
- All visible text must use translation keys
- Prefix all translation keys with: `blog.*`
- Examples:
  - `blog.article.read_more`
  - `blog.pagination.next`
  - `blog.article.comment_form_title`

### 4. Assets
- Create and use: `tz-main-blog.css` and `tz-main-blog.js`
- Remove or disable any default blog-related CSS/JS
- All styling and interactions must live in the new assets
- No dependencies on default theme blog styles

---

## Design Approach: Tailwind-Like Utility-First

### CSS Architecture
Follow a Tailwind-like utility-first approach with:

#### Spacing Scale
```css
--tz-spacing-1: 0.25rem;   /* 4px */
--tz-spacing-2: 0.5rem;    /* 8px */
--tz-spacing-3: 0.75rem;   /* 12px */
--tz-spacing-4: 1rem;      /* 16px */
--tz-spacing-6: 1.5rem;    /* 24px */
--tz-spacing-8: 2rem;      /* 32px */
--tz-spacing-12: 3rem;     /* 48px */
```

#### Color Palette
```css
--tz-blog-gray-50: #f9fafb;
--tz-blog-gray-200: #e5e7eb;
--tz-blog-gray-600: #4b5563;
--tz-blog-gray-900: #111827;
```

#### Typography Scale
```css
--tz-text-xs: 0.75rem;     /* 12px */
--tz-text-sm: 0.875rem;    /* 14px */
--tz-text-base: 1rem;      /* 16px */
--tz-text-lg: 1.125rem;    /* 18px */
--tz-text-xl: 1.25rem;     /* 20px */
--tz-text-2xl: 1.5rem;     /* 24px */
--tz-text-3xl: 1.875rem;   /* 30px */
--tz-text-4xl: 2.25rem;    /* 36px */
```

#### Responsive Breakpoints
- Mobile: Default (no media query)
- Tablet: `@media (min-width: 640px)`
- Desktop: `@media (min-width: 1024px)`

### Design Principles
- **Clean & Minimal:** Remove heavy borders, use subtle dividers
- **Consistent Spacing:** Use spacing scale throughout
- **Typography Hierarchy:** Clear heading sizes and weights
- **Subtle Interactions:** Smooth hover effects, no heavy animations
- **Modern Aesthetic:** Clean cards, good whitespace, professional look

---

## Implementation Checklist

### Phase 1: Setup & Structure
- [ ] Read and understand `main-product.liquid` structure
- [ ] Review `blog.html` and `post.html` for layout inspiration
- [ ] Review `login.html` for Tailwind-style design patterns
- [ ] Create `assets/tz-main-blog.css` with Tailwind-like variables
- [ ] Create `assets/tz-main-blog.js` with basic structure

### Phase 2: Blog Listing Page (`main-blog.liquid`)
- [ ] Remove default theme CSS/JS imports
- [ ] Add `tz-main-blog.css` and `tz-main-blog.js` imports
- [ ] Add Hebrew locale detection (copy from `main-product.liquid`)
- [ ] Replace all default classes with `tz-*` classes
- [ ] Implement custom article card markup (inline, no snippet dependency)
- [ ] Implement custom pagination with `tz-*` classes
- [ ] Add padding CSS variables in `{%- style -%}` block
- [ ] Update schema to remove translation dependencies

### Phase 3: Article Page (`main-article.liquid`)
- [ ] Remove default theme CSS imports
- [ ] Add `tz-main-blog.css` and `tz-main-blog.js` imports
- [ ] Add Hebrew locale detection
- [ ] Replace all default classes with `tz-*` classes
- [ ] Implement custom share buttons
- [ ] Implement custom comment form with `tz-*` classes
- [ ] Update schema to remove translation dependencies

### Phase 4: Styling (`tz-main-blog.css`)
- [ ] Define Tailwind-like CSS variables (spacing, colors, typography)
- [ ] Implement dark mode support
- [ ] Implement RTL/LTR support with logical properties
- [ ] Style blog listing page (grid, cards, pagination)
- [ ] Style article page (hero, content, comments, forms)
- [ ] Ensure responsive design (mobile, tablet, desktop)
- [ ] Match theme's clean, minimal aesthetic

### Phase 5: JavaScript (`tz-main-blog.js`)
- [ ] Handle image loading errors
- [ ] Smooth scroll for pagination links
- [ ] Copy link functionality for share buttons
- [ ] Any additional interactive features

### Phase 6: Translations
- [ ] Add `blog.*` translation keys to `locales/en.default.json`
- [ ] Include all necessary keys:
  - `blog.article.*` (read_more, comments, share, etc.)
  - `blog.pagination.*` (next, previous, page, etc.)
  - `blog.article.comment_form.*` (name, email, message, etc.)

### Phase 7: Testing
- [ ] Test blog listing page layout
- [ ] Test article page layout
- [ ] Test dark/light mode switching
- [ ] Test RTL/LTR layouts
- [ ] Test responsive breakpoints
- [ ] Test pagination functionality
- [ ] Test comment form
- [ ] Test share buttons
- [ ] Verify no default theme CSS/JS is loaded

---

## Code Structure Example

### Asset Loading Pattern
```liquid
{{ 'tz-main-blog.css' | asset_url | stylesheet_tag }}
<script src="{{ 'tz-main-blog.js' | asset_url }}" defer="defer"></script>
```

### Locale Detection Pattern
```liquid
{%- liquid
  assign is_hebrew = false
  assign locale_code = request.locale.iso_code | downcase
  assign shop_locale = shop.locale | downcase
  if locale_code == 'he' or locale_code == 'iw' or shop_locale == 'he' or shop_locale == 'iw' or locale_code contains 'he' or shop_locale contains 'he'
    assign is_hebrew = true
  endif
-%}
```

### Section Structure Pattern
```liquid
<div class="tz-blog-section" data-hebrew="{% if is_hebrew %}true{% else %}false{% endif %}">
  <div class="tz-blog-container">
    <!-- Content -->
  </div>
</div>
```

### Padding Variables Pattern
```liquid
{%- style -%}
  #shopify-section-{{ section.id }} {
    --tz-blog-pt: {{ section.settings.padding_top | times: 0.75 | round: 0 }}px;
    --tz-blog-pb: {{ section.settings.padding_bottom | times: 0.75 | round: 0 }}px;
  }

  @media screen and (min-width: 750px) {
    #shopify-section-{{ section.id }} {
      --tz-blog-pt: {{ section.settings.padding_top }}px;
      --tz-blog-pb: {{ section.settings.padding_bottom }}px;
    }
  }
{%- endstyle -%}
```

---

## What You May Change

### ✅ Allowed Changes
- Rewrite or add custom HTML markup
- Create new CSS classes (with `tz-*` prefix)
- Add JavaScript functionality
- Modify schema labels (but preserve structure)

### ❌ Must Preserve
- Liquid logic (loops, conditions, variables)
- Schema structure and settings (unless strictly necessary)
- Shopify data integration (article, blog objects)
- Pagination logic
- Comment form functionality

---

## Expected Outcome

### Visual
- Modern, clean, and beautiful blog experience
- Tailwind-like utility-first design
- Consistent with theme's aesthetic
- Professional and polished appearance

### Technical
- Fully responsive (mobile, tablet, desktop)
- Dark/Light mode support
- RTL/LTR layout support
- Zero reliance on default blog styles
- Maintainable and scalable code
- Performance optimized

### User Experience
- Smooth interactions
- Clear navigation
- Accessible design
- Fast loading
- Intuitive layout

---

## Key Design Elements

### Blog Listing Page
- Clean grid layout (1/2/3 columns responsive)
- Article cards with images
- Hover effects on cards
- Custom pagination
- Clean typography hierarchy

### Article Page
- Hero image (if available)
- Article title and meta
- Article content with proper styling
- Share buttons
- Comment section with form
- Back to blog link

---

## Notes

- This rebuild maintains Shopify functionality while using custom styling
- All implementations should follow RTL-first best practices
- Ensure accessibility standards are met
- Performance optimization should be considered throughout
- The design should feel native to the theme, not copied from references

---

## Final Checklist

Before considering the task complete:

- [ ] All default theme blog CSS/JS removed
- [ ] All classes use `tz-*` prefix
- [ ] Dark/Light mode works correctly
- [ ] RTL/LTR layouts work correctly
- [ ] All translations use `blog.*` keys
- [ ] Responsive design tested
- [ ] No console errors
- [ ] Code follows theme conventions
- [ ] Design matches theme aesthetic
- [ ] Performance is optimized
