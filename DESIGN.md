# IT Support Ticketing System
## Complete UI/UX Design Concept

**Client:** Politeknik Mitra Industri  
**Platform:** Laravel + Inertia + React  
**Frontend Stack:** React + Inertia, Tailwind CSS, Framer Motion, Lucide React, Radix UI / Headless UI, TanStack Query, and optionally react-hook-form + zod for complex forms/validation.  
**Deliverable:** Design System & Screen Specifications  
**Date:** May 2026

---

## Table of Contents
1. [Design Principles & Brand Identity](#1-design-principles--brand-identity)
   - [Visual Direction](#11-visual-direction)
   - [Design Goals](#12-design-goals)
2. [Color Palette](#2-color-palette)
   - [Primary Colors](#21-primary-colors)
   - [Neutral Colors](#22-neutral-colors)
   - [Status Colors](#23-status-colors)
3. [Typography](#3-typography)
4. [Spacing & Layout Grid](#4-spacing--layout-grid)
5. [Component Library](#5-component-library)
   - [Buttons](#51-buttons)
   - [Form Inputs](#52-form-inputs)
   - [Badges & Labels](#53-badges--labels)
   - [Cards & Panels](#54-cards--panels)
   - [Tables & Lists](#55-tables--lists)
   - [Feedback Components](#56-feedback-components)
6. [Screen Designs](#6-screen-designs)
   - [Authentication Flow](#61-authentication-flow)
   - [User Dashboard](#62-user-dashboard)
   - [Create Ticket](#63-create-ticket)
   - [Ticket Detail](#64-ticket-detail)
   - [Ticket List / My Tickets](#65-ticket-list--my-tickets)
   - [Admin Dashboard](#66-admin-dashboard)
   - [Admin Ticket Management](#67-admin-ticket-management)
   - [Settings & Profile](#68-settings--profile)
7. [Responsive Behavior](#7-responsive-behavior)
8. [Accessibility Guidelines](#8-accessibility-guidelines)
9. [UX Best Practices](#9-ux-best-practices)
10. [Implementation Notes](#10-implementation-notes)

---

## 1. Design Principles & Brand Identity

### 1.1 Visual Direction
The IT Support Ticketing System for **Politeknik Mitra Industri** adopts a flat, disciplined, and understated visual language. The interface is designed to feel like a mature internal enterprise application — not a marketing website or a futuristic dashboard. Every visual decision prioritizes clarity, order, and operational efficiency.

**Core Visual Philosophy**
- **Flat Design:** Solid colors, no gradients, no glassmorphism, no neumorphism.
- **Institutional Palette:** Deep navy blue as the primary identity, with restrained accent colors.
- **Clean Surfaces:** White cards on light gray backgrounds with subtle borders.
- **Strong Spacing:** Systematic spacing rhythm creates clear hierarchy without clutter.
- **High Readability:** Dark slate text on light backgrounds with accessible contrast ratios.

### 1.2 Design Goals
- **Clarity:** Users must understand ticket status and required actions at a glance.
- **Efficiency:** Common tasks (creating tickets, updating status, adding comments) require minimal steps.
- **Trust:** The interface communicates institutional credibility and technical reliability.
- **Consistency:** Every screen feels like part of the same cohesive system.
- **Accessibility:** Sufficient contrast, readable text, and keyboard-friendly structures.

---

## 2. Color Palette
The color system is intentionally limited. Color is used functionally — to indicate status, guide attention, and establish hierarchy — never for decoration.

### 2.1 Primary Colors

| Token | Hex | Usage |
|---|---:|---|
| Primary 900 | `#0F2A5F` | Headers, sidebar, active states, emphasis |
| Primary 700 | `#1D4ED8` | Primary buttons, links, active indicators |
| Primary 100 | `#DBEAFE` | Badge backgrounds, highlights, info panels |

### 2.2 Neutral Colors

| Token | Hex | Usage |
|---|---:|---|
| Neutral 950 | `#0F172A` | Headings, primary text, numbers |
| Neutral 500 | `#64748B` | Secondary text, metadata, labels, icons |
| Neutral 100 | `#F1F5F9` | Page background, secondary surfaces |
| White | `#FFFFFF` | Cards, modals, input backgrounds |

### 2.3 Status Colors

Status colors are used sparingly and only for functional indicators. Each status color is paired with a light background variant for badges.

| Status | Hex | Usage | Badge BG |
|---|---:|---|---:|
| Success / Closed | `#16A34A` | Completed tickets, success messages | `#DCFCE7` |
| Warning / Pending | `#D97706` | In progress, pending action, medium priority | `#FEF3C7` |
| Danger / Urgent | `#DC2626` | Critical priority, errors, destructive actions | `#FEE2E2` |
| Open / Info | `#1D4ED8` | Open tickets, informational alerts | `#DBEAFE` |

---

## 3. Typography
The typographic system uses **Inter** as the primary typeface. It is neutral, highly legible, and optimized for screen reading at small sizes — ideal for an internal enterprise application.

| Element | Size | Weight | Color | Usage |
|---|---:|---:|---|---|
| H1 (Page Title) | 24px / 1.5rem | 700 | `#0F2A5F` | Main page headings |
| H2 (Section Title) | 18px / 1.125rem | 600 | `#0F172A` | Card titles, section headers |
| H3 (Subsection) | 16px / 1rem | 600 | `#0F172A` | Sub-sections, form group labels |
| Body | 14px / 0.875rem | 400 | `#0F172A` | Paragraphs, descriptions |
| Label | 12px / 0.75rem | 500 | `#64748B` | Form labels, metadata, captions |
| Stat Number | 32px / 2rem | 700 | `#0F2A5F` | Dashboard statistic values |
| Button | 14px / 0.875rem | 500 | varies | Button text |

**Line Height:** 1.5 for body text, 1.3 for headings.  
**Letter Spacing:** -0.2px for headings; normal for body.  
**Text Transform:** None. Avoid uppercase for labels — sentence case is more readable.

---

## 4. Spacing & Layout Grid
The layout uses a consistent 8px base unit for spacing. This creates a predictable rhythm and makes the interface feel orderly.

| Token | Value | Usage |
|---|---:|---|
| space-1 | 4px | Tight gaps, icon padding |
| space-2 | 8px | Inline element spacing |
| space-3 | 12px | Small component padding |
| space-4 | 16px | Standard card padding, form gaps |
| space-6 | 24px | Section gaps, card margins |
| space-8 | 32px | Large section separation |
| space-12 | 48px | Page-level vertical padding |

### Layout Grid
- **Desktop:** 12-column grid, max content width 1280px, gutters 24px.
- **Tablet:** 8-column grid, gutters 16px.
- **Mobile:** Single column, padding 16px on each side.

### Container Behavior
Main content area is fluid but constrained to a maximum width to maintain readability. The sidebar is fixed-width (240px on desktop, collapsible on mobile). Cards and forms are centered within the content area with consistent padding.

---

## 5. Component Library
The component system is the visual foundation of the application. Every element follows the same design language to ensure consistency across all screens.

![Figure 1 - Component Library Overview](design_assets/component_library.jpg)

### 5.1 Buttons

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| Primary | `#1D4ED8` | `#FFFFFF` | none | Main CTAs: Submit, Create, Save |
| Secondary | `#FFFFFF` | `#0F172A` | `1px #E2E8F0` | Cancel, Back, Secondary actions |
| Ghost | transparent | `#1D4ED8` | none | Tertiary actions, links |
| Danger | `#DC2626` | `#FFFFFF` | none | Delete, destructive actions |
| Disabled | `#F1F5F9` | `#94A3B8` | none | Inactive state |

**Specs:** Height 40px, padding 0 16px, border-radius 6px, font-size 14px, font-weight 500. Hover: darken background by 8%. Active: darken by 12%.

### 5.2 Form Inputs

| Element | Height | Border | Radius | Focus State |
|---|---:|---|---:|---|
| Text Input | 40px | `1px #E2E8F0` | 6px | 2px `#1D4ED8` ring |
| Select Dropdown | 40px | `1px #E2E8F0` | 6px | 2px `#1D4ED8` ring |
| Textarea | auto (min 96px) | `1px #E2E8F0` | 6px | 2px `#1D4ED8` ring |
| Search Input | 40px | `1px #E2E8F0` | 6px | 2px `#1D4ED8` ring |
| File Upload | 120px | `2px dashed #CBD5E1` | 6px | dashed `#1D4ED8` |

**Labels:** 12px, font-weight 500, color `#64748B`, margin-bottom 4px.  
**Help Text:** 12px, color `#64748B`, margin-top 4px.  
**Error State:** Border `#DC2626`, error text `#DC2626`, background `#FEE2E2` (subtle).

### 5.3 Badges & Labels
Badges are compact indicators used for status, priority, and category.

| Type | Background | Text | Usage |
|---|---|---|---|
| Open | `#DBEAFE` | `#1D4ED8` | New, unassigned tickets |
| In Progress | `#FEF3C7` | `#D97706` | Tickets being handled |
| Closed | `#DCFCE7` | `#16A34A` | Resolved tickets |
| Urgent | `#FEE2E2` | `#DC2626` | Critical priority |
| Low Priority | `#F1F5F9` | `#64748B` | Low priority |
| Medium Priority | `#DBEAFE` | `#1D4ED8` | Medium priority |
| High Priority | `#FEF3C7` | `#D97706` | High priority |

**Specs:** Height 24px, padding 0 10px, border-radius 9999px (pill), font-size 12px, font-weight 500.

### 5.4 Cards & Panels
Cards are the primary container for content. They are clean, white, and use subtle borders rather than heavy shadows.

- **Background:** `#FFFFFF`
- **Border:** `1px solid #E2E8F0`
- **Border Radius:** 8px
- **Shadow:** `0 1px 2px rgba(0,0,0,0.04)` — extremely subtle
- **Padding:** 24px

### 5.5 Tables & Lists
Tables are used for ticket lists, user directories, and activity logs. They prioritize scannability.

- **Header:** Background `#F8FAFC`, text `#64748B`, font-size 12px, font-weight 500, uppercase tracking (optional).
- **Row:** Background `#FFFFFF`, border-bottom `1px #E2E8F0`.
- **Hover:** Background `#F8FAFC`.
- **Action Column:** Icon buttons (view, edit, assign) in ghost style.
- **Pagination:** Compact, centered below table. Previous/Next buttons + numbered pages.

### 5.6 Feedback Components

#### Alert Box
- **Success:** Left border 4px `#16A34A`, background `#F0FDF4`, text `#166534`.
- **Warning:** Left border 4px `#D97706`, background `#FFFBEB`, text `#92400E`.
- **Error:** Left border 4px `#DC2626`, background `#FEF2F2`, text `#991B1B`.
- **Info:** Left border 4px `#1D4ED8`, background `#EFF6FF`, text `#1E40AF`.

#### Toast Notification
Positioned top-right, fixed. Auto-dismiss after 4 seconds. Background white, border `1px #E2E8F0`, shadow `0 4px 12px rgba(0,0,0,0.08)`, border-left 4px status color.

#### Modal Dialog
Overlay: `rgba(0,0,0,0.4)`. Modal card: white, radius 8px, max-width 480px, padding 24px. Header with title and close icon. Footer with action buttons aligned right.

#### Empty State
Centered in content area. Simple icon + heading "No tickets found" + subtext + optional action button. No decorative illustrations.

---

## 6. Screen Designs
This section presents high-fidelity mockups for all required screens. Each screen follows the design system defined above.

### 6.1 Authentication Flow
The authentication pages share a unified, minimal layout. A centered card on a light gray background ensures focus remains on the form. The institutional header bar reinforces brand identity.

#### Login Page
![Figure 2 - Login Page](design_assets/login_page.jpg)

**Elements:** Email input, Password input, "Remember me" checkbox, Primary "Login" button, "Forgot Password?" link, "Register" link.  
**Behavior:** Validation errors appear below fields in real-time. Button shows loading state on submit.

#### Register Page
![Figure 3 - Register Page](design_assets/register_page.jpg)

**Elements:** Full Name, Email, Department (select), Password, Confirm Password, "Register" button, "Already have an account? Login" link.

#### Password Reset Page
![Figure 4 - Password Reset Page](design_assets/password_reset_page.jpg)

**Elements:** Email input, "Send Reset Link" button, "Back to Login" link.  
**Behavior:** Success message replaces form after submission. Error state if email not found.

### 6.2 User Dashboard
![Figure 5 - User Dashboard](design_assets/user_dashboard.jpg)

The User Dashboard is the primary landing page after login. It provides an immediate operational overview.

- **Summary Cards:** Four cards displaying Total Tickets, Open, In Progress, and Closed counts. Large bold numbers (`#0F2A5F`) with clear labels (`#64748B`).
- **Recent Tickets Table:** Shows the 5 most recent tickets with sortable columns for ID, Title, Status, Priority, and Date. Status and Priority are rendered as color-coded pill badges.
- **Quick Action:** "Create New Ticket" button (Primary) positioned top-right of the Recent Tickets section.
- **Sidebar:** Collapsible on mobile. Active item indicated by left border (`#1D4ED8`) and background tint (`#F1F5F9`).

### 6.3 Create Ticket
![Figure 6 - Create Ticket Page](design_assets/create_ticket.jpg)

The ticket creation form is designed for speed and clarity. Every field is essential.

- **Title:** Text input, required. Hint: "Briefly describe the issue."
- **Category:** Select dropdown (Hardware, Software, Network, Account, Other).
- **Priority:** Select dropdown (Low, Medium, High, Critical). Default: Medium.
- **Description:** Textarea, required. Hint: "Provide detailed information including steps to reproduce."
- **Attachment:** File upload zone with dashed border. Supports drag-and-drop. Shows file name and size after selection.
- **Actions:** "Submit Ticket" (Primary) + "Cancel" (Secondary).

### 6.4 Ticket Detail
![Figure 7 - Ticket Detail Page](design_assets/ticket_detail.jpg)

The detail page is the most information-dense screen. It uses a clear hierarchy to separate ticket content from meta-information and activity.

- **Header:** Ticket ID (#12345), Title, Status badge, Priority badge. Action buttons: Edit (admin), Close (if open).
- **Metadata Row:** Requester name, Category, Created date, Assigned technician.
- **Description:** Contained in a white card with subtle border. Preserves line breaks.
- **Activity Log / Timeline:** Vertical timeline showing status changes, assignments, and comments. Each entry shows avatar, user name, action description, and timestamp. Alternate background tints for readability.
- **Attachments:** Grid of file cards showing icon, name, size, and download link.
- **Add Comment:** Textarea at bottom of timeline with "Post Comment" button.

### 6.5 Ticket List / My Tickets
This screen uses the same table component as the Admin Management page but filtered to the current user's tickets. It includes search, status filter, and pagination. The design is identical to the table shown in Figure 8 but with user-level actions (View, Edit if open).

### 6.6 Admin Dashboard
![Figure 8 - Admin Dashboard](design_assets/admin_dashboard.jpg)

The Admin Dashboard is optimized for high-volume operational awareness. It surfaces critical items requiring immediate attention.

- **Stat Cards:** Six cards in a 3x2 grid: Total, Open, In Progress, Closed, Urgent, Awaiting Assignment. Urgent and Awaiting Assignment use warning/danger color accents to draw attention.
- **Priority Queue:** Compact table of high-priority and unassigned tickets. Technicians can self-assign directly from this table.
- **Recent Activity:** Stream of recent system actions (ticket created, status changed, assigned) with timestamps relative to now (e.g., "5m ago").

### 6.7 Admin Ticket Management
![Figure 9 - Admin Ticket Management](design_assets/admin_ticket_management.jpg)

This is the primary workspace for IT administrators. The design prioritizes information density and action efficiency.

- **Filter Bar:** Horizontal row of dropdown filters (Status, Category, Priority, Date Range) + Search input + "Export" secondary button. Filters apply instantly (no submit button required).
- **Data Table:** Full-width table with sortable headers. Columns: ID, Title, Requester, Category, Priority, Status, Assigned To, Created, Actions.
- **Row Actions:** Icon buttons for View, Edit, Assign. Hover reveals tooltip.
- **Pagination:** Standard numbered pagination below table. Shows total count: "Showing 1-25 of 1,234 tickets."
- **Batch Actions:** Checkbox in table header allows multi-select. Batch action bar appears at bottom: "Assign to...", "Change Status...", "Delete" (danger).

### 6.8 Settings & Profile
![Figure 10 - Settings and Profile Page](design_assets/settings_profile.jpg)

The settings page uses a tabbed layout to separate profile information, account preferences, and password management.

- **Profile Tab:** Avatar upload, Name, Email (read-only if managed by LDAP), Department, Phone. "Update Profile" primary button.
- **Account Tab:** Notification preferences (email alerts for ticket updates), language selection.
- **Password Tab:** Current Password, New Password, Confirm New Password. "Change Password" button. Strength indicator below new password field.

---

## 7. Responsive Behavior
The application is designed desktop-first, but all screens adapt gracefully to tablet and mobile viewports.

![Figure 11 - Mobile Dashboard](design_assets/mobile_dashboard.jpg)

| Breakpoint | Width | Behavior |
|---|---:|---|
| Desktop | > 1024px | Full sidebar, multi-column grids, expanded tables. |
| Tablet | 768px - 1024px | Collapsible sidebar (icon-only or overlay), 2-column grids become single column, tables scroll horizontally. |
| Mobile | < 768px | Hamburger menu, stacked cards, full-width forms, simplified list views instead of tables. |

### Mobile Adaptations
- **Sidebar:** Becomes a slide-out drawer triggered by a hamburger icon in the top bar.
- **Summary Cards:** Stack vertically in a single column. Font sizes reduce slightly.
- **Tables:** Convert to card lists. Each ticket becomes a card with key info and a "View" button.
- **Forms:** All fields become full-width. Action buttons stack: primary on top, secondary below.
- **Filters:** Collapse into a single "Filter" button that opens a bottom sheet or modal.

---

## 8. Accessibility Guidelines
The design adheres to WCAG 2.1 Level AA standards to ensure usability for all employees and IT staff.

### Color Contrast
- All text on colored backgrounds maintains a minimum contrast ratio of 4.5:1.
- Large text (18px+ or 14px+ bold) maintains 3:1 contrast.
- Status badges use dark text on light backgrounds to ensure readability.

### Non-Color Indicators
- Status is communicated through **color + text + icon** (e.g., a green dot next to the word "Closed").
- Priority uses **color + label** (never color alone).
- Errors are indicated by **red border + error text + icon**.

### Keyboard Navigation
- All interactive elements have visible focus rings (2px `#1D4ED8` with 2px offset).
- Tab order follows visual reading order (left-to-right, top-to-bottom).
- Modal dialogs trap focus until dismissed.

### Screen Reader Support
- Form labels are explicitly associated with inputs.
- Icon buttons have aria-label attributes.
- Tables use proper thead/th scope markup.
- Status changes announced via live regions (toast notifications).

### Motion & Animation
- Animations are subtle and functional (e.g., modal fade-in, button hover states).
- No auto-playing animations. Respect `prefers-reduced-motion`.
- Transitions limited to 150-200ms for snappiness.

---

## 9. UX Best Practices

### Form Usability
- Always show field labels — never rely on placeholder text alone.
- Group related fields visually with consistent spacing.
- Validate on blur for immediate feedback. Validate on submit for final check.
- Use helper text to explain format requirements (e.g., "Minimum 8 characters").
- Disable submit button until required fields are valid.

### Table Usability
- Keep the most important columns (ID, Title, Status) left-aligned and sticky if horizontal scrolling is needed.
- Use zebra striping sparingly — subtle alternating rows (`#FAFAFA` / `#FFFFFF`) improve scannability in wide tables.
- Truncate long text with ellipsis and provide tooltip on hover.
- Show empty state immediately if no results match filters.

### Feedback & Confirmation
- Confirm destructive actions (Delete, Close without solution) with a modal.
- Show toast notifications for all state changes: success, error, warning.
- Loading states: skeleton screens for initial load, spinners for button actions.

### Navigation
- Breadcrumbs on detail pages: Dashboard / Tickets / #12345.
- Active sidebar item clearly distinguished by left border and background tint.
- Logo or system name in top bar links back to dashboard.

---

## 10. Implementation Notes
This design concept is built for **Laravel + Inertia + React** with the following frontend stack:

- React + Inertia
- Tailwind CSS
- Framer Motion
- Lucide React
- Radix UI / Headless UI
- TanStack Query
- Optional: react-hook-form + zod for form-heavy or validation-complex screens

All components described can be implemented using standard Tailwind CSS utility classes and React functional components. The design system tokens (colors, spacing, typography) should be mapped to a Tailwind configuration file to ensure consistency across the application.

The result should be a production-ready internal system: professional, maintainable, responsive, accessible, and visually consistent.
