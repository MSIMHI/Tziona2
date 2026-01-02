TZ Shopify Theme Blueprint

This document defines the system, vocabulary, and rules for building sections in the TZ Shopify theme.

It does not define specific sections.
It defines how sections are designed, specified, and implemented.

All sections in this theme MUST be designed using this blueprint.

1. Purpose

The Theme Blueprint exists to ensure:

Consistent editor experience

Predictable section behavior

Scalable theme development

Clear separation between rules and decisions

Ability to support multiple theme philosophies (minimal / flexible / builder)

This blueprint is policy — not implementation.

2. Core Design Principles

System first, decisions later

The theme defines what is possible

Each section defines what it uses

Editor-first

Sections and blocks are configured through the Shopify editor

No hidden or implicit behavior

No implicit limitations

Limitations are declared per theme or per section

Not baked into the system

Separation of concerns

Theme Blueprint → rules & vocabulary

Section instructions (JSON) → decisions

Section Liquid → implementation

3. Terminology
Section Archetype

A conceptual category that describes the role of a section.

Examples:

Global

Hero

Content

Media

Merchandising

Conversion

Utility

Archetypes do not enforce behavior — they inform rulesets.

Block Archetype

A conceptual category that describes what a block represents.

Examples:

Text

RichText

Menu

Image

Icon

CTA

Social Icons

Newsletter

Product

Custom Liquid

Block archetypes are reusable across sections.

Control

A Shopify editor input (e.g. text, range, color).

Controls are grouped into control categories for clarity.

4. Control Categories

Control categories describe intent, not schema types.

Section Control Categories

Layout

Spacing

Background

Typography

Colors

Visibility

Behavior

Content

Advanced

Block Control Categories

Content

Variant

Alignment

Emphasis

Media

CTA

Styling

Advanced

The Theme Blueprint defines these categories.
Each section chooses which categories it uses.

5. Mandatory Section Structure (Implementation Rule)

All sections MUST implement the shared wrapper structure.

<section class="tz-section">
  <div class="tz-section__inner">
    <!-- optional background layers -->
    <div class="tz-section__content">
      <!-- section content / blocks -->
    </div>
  </div>
</section>


This structure is non-negotiable.

It enables:

Shared layout logic

Shared spacing logic

Shared background handling

Shared visibility rules

6. Styling Architecture Rules

No hardcoded spacing or colors

No inline styles (except CSS variables)

No section-specific font systems

No duplicated wrapper logic

All styling must flow through:

Section settings

CSS variables

Global theme CSS

7. Typography Rules (System Level)

Font families are defined at theme level

Sections may control:

Size

Weight

Casing

Blocks may override typography only if explicitly allowed by section instructions

Typography decisions belong to section instructions, not this blueprint.

8. Blocks Philosophy

Blocks represent content units

Sections represent layout and composition

By default:

Blocks control content

Sections control design

This is a default philosophy, not a hard rule.
Deviations must be explicit in section instructions.

9. Section Instructions (JSON) – Concept

Each section MUST have a corresponding Section Instruction JSON file.

This file defines:

Section archetype

Available control categories (section-level)

Allowed block types

Allowed control categories per block

Layout zones (if applicable)

This JSON is the decision record for that section.

10. Presets Policy

Every section MUST define at least one preset

Presets represent valid initial compositions

Presets are part of UX, not decoration

11. File Responsibilities
Theme Blueprint (THEME_BLUEPRINT.md)

Defines system

Defines vocabulary

Defines rules

Does NOT define specific sections

Section Instructions (*.section.json)

Defines section decisions

Defines controls used

Defines block availability

Defines block controls

Section Implementation (sections/*.liquid)

Implements instructions

No additional behavior

Theme CSS (assets/*.css)

Owns layout

Owns spacing

Owns typography

Owns visual consistency

12. Forbidden Patterns ❌

Undocumented controls

Hardcoded layout values

Implicit styling logic

Block behavior not described in section instructions

Editor options without system justification

13. Extension Policy

New capabilities (e.g. animations, sticky behavior, advanced typography) must be added in this order:

Defined in Theme Blueprint

Allowed in section instructions

Implemented in sections

No feature may skip a layer.

14. Footer & Global Sections Policy

Global sections prioritize consistency over flexibility

Blocks in global sections default to content-only

Styling controls at block level must be explicitly justified

Footer and header are infrastructure, not canvases.

15. Single Source of Truth

This document is the system authority.

If something is not defined here:

It is not part of the system

It must be added before use

End of Theme Blueprint.