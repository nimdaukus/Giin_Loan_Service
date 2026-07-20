---
name: GIIN Sentinel
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
  success-emerald: '#10B981'
  alert-amber: '#F59E0B'
  danger-coral: '#F43F5E'
  surface-gray: '#F8FAFC'
  border-subtle: '#E2E8F0'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is engineered for the **GIIN Sentinel** financial ecosystem. The brand personality is rooted in **institutional trust, technical precision, and absolute clarity**. It must feel like a secure vault while remaining accessible to borrowers who may be in stressful financial situations.

The chosen design style is **Corporate / Modern** with a strong **Modular Card-based** architecture. This approach balances the data-density required by administrators with the streamlined simplicity needed by borrowers.

**Key visual principles:**
- **Clarity over Decoration:** Every UI element must serve a functional purpose. Whitespace is used strategically to separate complex data sets.
- **Institutional Authority:** Deep navies and structured grids reinforce the platform's reliability as a financial service.
- **Progressive Disclosure:** Information is organized into logical "containers" (cards) to prevent cognitive overload in administrative views.
- **Trust Indicators:** Subtle shadows and clean borders provide a sense of physical layering and stability.

## Colors

The palette is anchored by **Deep Navy (#0F172A)** to establish a professional foundation. **Professional Blue (#2563EB)** is used for primary actions and navigation to guide the eye toward "forward-moving" tasks.

**Functional Accents:**
- **Emerald Green:** Reserved strictly for success states, approved statuses, and completed repayments. It acts as a "reward" color.
- **Amber:** Used for pending statuses and warning states that require attention but aren't yet critical.
- **Coral:** Employed for rejected applications, overdue reminders, or destructive actions.

The background uses a tiered system of **Surface Gray (#F8FAFC)** and pure white to create a clear visual hierarchy between the application canvas and the individual data cards.

## Typography

The typography system uses **Inter** exclusively to leverage its exceptional legibility in data-heavy environments. 

**Application Rules:**
- **Headlines:** Use tight letter-spacing and bold weights to ground the top of page hierarchies.
- **Data Tables:** Use `body-md` for standard cell content. For financial figures (RWF/USD), use `data-mono` to ensure numbers align vertically and remain distinguishable.
- **Form Labels:** Use `label-caps` for field headers to provide a clear distinction between the user's input and the system's prompts.
- **Readability:** Ensure a minimum contrast ratio of 4.5:1 for all body text against its background.

## Layout & Spacing

This design system employs a **Hybrid Grid Strategy**:
1. **Admin Web:** A 12-column fluid grid. Dashboards use a masonry-style card layout where KPI widgets span 3 columns and the Main Tracker spans the full 12.
2. **Borrower Mobile:** A single-column fluid layout focused on vertical scrolling and ease of thumb-interaction.

**Spacing Rhythm:**
A strict 8px (0.5rem) base unit drives all padding and margins. 
- **Internal Card Padding:** Always 24px (1.5rem) to ensure data doesn't feel cramped.
- **Component Gap:** 16px (1rem) between related form elements; 32px (2rem) between major sections or different cards.

## Elevation & Depth

Visual depth is communicated through **Tonal Layering** and **Ambient Shadows**. This design system avoids high-elevation shadows to maintain a professional, "flat-but-functional" aesthetic.

- **Level 0 (Background):** Surface Gray (#F8FAFC). Used for the main application background.
- **Level 1 (Cards):** Pure White (#FFFFFF) with a 1px border (#E2E8F0). This is the primary container for all content.
- **Level 2 (Dropdowns/Modals):** Pure White with a soft, diffused shadow (0px 10px 15px -3px rgba(0,0,0,0.1)).
- **Interactive States:** When a user hovers over a table row or a clickable card, the background shifts slightly to a very pale blue to indicate interactivity.

## Shapes

The shape language is **Soft (0.25rem)**. This subtle rounding provides a modern feel without sacrificing the professional "seriousness" required by a loan service.

- **Buttons & Inputs:** 4px (0.25rem) corner radius.
- **Dashboard Cards:** 8px (0.5rem) corner radius to differentiate them as larger structural containers.
- **Status Badges:** Fully rounded (pill-shaped) to make them instantly recognizable as non-interactive status indicators.

## Components

### 1. Status Badges
Badges use a "soft-tint" background with high-contrast text:
- **Pending:** Amber background (10% opacity) with dark amber text.
- **Approved:** Emerald background (10% opacity) with dark emerald text.
- **Completed:** Navy background (10% opacity) with Navy text.

### 2. Data Tables
The backbone of the Admin view. 
- **Header:** Sticky top, light gray background, uppercase bold labels.
- **Rows:** Thin 1px bottom border; alternating row tints are avoided in favor of clear hover states.
- **Collateral Cell:** Includes a thumbnail-sized image preview if a file is uploaded.

### 3. KPI Widgets
Small cards used at the top of the Admin Dashboard.
- **Layout:** Large numeric value (`headline-lg`), secondary label (`label-caps`), and a small trend indicator (e.g., "+12% this month").

### 4. Input Forms (Loan Application)
- **File Upload:** A dedicated "Dropzone" component with a dashed border. Must show a progress bar during collateral photo uploads.
- **Inputs:** High-contrast borders (1px) that turn Professional Blue on focus.

### 5. Action Buttons
- **Primary:** Solid Professional Blue with white text.
- **Secondary:** Transparent with 1px Navy border.
- **Critical (Reject/Delete):** Transparent with 1px Coral border.

### 6. Loan Lifecycle Tracker
A horizontal step-indicator for borrowers to see where their application is (Applied → Under Review → Approved → Active → Completed).