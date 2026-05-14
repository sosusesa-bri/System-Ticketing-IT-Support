# POLMIND IT Support Ticketing System

<p align="center">
  <img src="public/images/Logo_POLMIND.png" alt="Politeknik Mitra Industri" width="180" />
</p>

<p align="center">
  Enterprise-oriented internal helpdesk application for ticket intake, SLA-aware processing, operational analytics, knowledge management, and institutional notification workflows at Politeknik Mitra Industri.
</p>

<p align="center">
  <img alt="Laravel 13" src="https://img.shields.io/badge/Laravel-13-red">
  <img alt="PHP 8.3+" src="https://img.shields.io/badge/PHP-8.3%2B-777bb4">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-149eca">
  <img alt="Inertia.js" src="https://img.shields.io/badge/Inertia.js-3.0-9553e9">
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4">
  <img alt="SQLite default" src="https://img.shields.io/badge/Database-SQLite-default-0f172a">
</p>

## Project Preview

This repository currently ships institutional branding assets and an in-app documentation center, but it does not yet include committed UI screenshots of the running application.

- Branding assets are available in `public/images/`.
- Interactive ERD, flowchart, and use-case diagrams are available inside the admin documentation module.
- Production frontend assets are already built into `public/build/`.

## Table of Contents

- [Project Overview](#project-overview)
- [Problem Background](#problem-background)
- [Core Features](#core-features)
- [Enterprise Operational Features](#enterprise-operational-features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Database Design](#database-design)
- [Authentication \& Authorization](#authentication--authorization)
- [Multilingual System](#multilingual-system)
- [Ticket Workflow](#ticket-workflow)
- [Dashboard \& Analytics](#dashboard--analytics)
- [Notification System](#notification-system)
- [File Attachment \& Preview](#file-attachment--preview)
- [Screenshots / UI Showcase](#screenshots--ui-showcase)
- [Installation Guide](#installation-guide)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Security Features](#security-features)
- [Performance \& Operational Notes](#performance--operational-notes)
- [Deployment Notes](#deployment-notes)
- [Documentation Assets](#documentation-assets)
- [Future Improvements](#future-improvements)
- [Contributors / Author](#contributors--author)
- [License](#license)

## Project Overview

This repository contains a Laravel monolith with an Inertia.js + React frontend for managing internal IT support operations. The application is built around two primary actor groups:

- `User` employees who submit, track, comment on, rate, and reopen their own support tickets.
- `Admin` IT staff who triage, assign, escalate, resolve, report on, and audit support activity across the organization.

The implemented codebase goes beyond a basic ticket CRUD application. In addition to ticket submission and ticket handling, the repository includes:

- a user and admin dashboard
- SLA-aware ticket deadlines
- assignment history
- internal comments
- CSAT ratings
- audit logging
- CSV exports
- a bilingual knowledge base
- a notification operations center
- user management
- profile preferences for language and theme
- an admin documentation module with interactive diagrams

## Problem Background

The project addresses a very specific operational problem: IT complaints handled through informal channels become difficult to track, prioritize, audit, and report on.

From the repository documentation and implemented modules, the system is designed to reduce:

- lost or forgotten complaints submitted by chat, phone, or verbal handoff
- unclear ownership of unresolved technical issues
- poor visibility for employees who need to know whether their issue is being handled
- inconsistent prioritization for urgent and critical incidents
- missing repair history for recurring problems
- slow reporting and limited operational insight for the IT team

The resulting application is positioned as an internal institutional support platform rather than a public SaaS product.

## Core Features

### 1. Authentication and session flow

The application provides:

- user registration with backend validation
- email/password sign-in with optional remember-me
- logout with session invalidation and token regeneration
- forgot-password flow using Laravel's password reset link mechanism
- role-aware post-login redirects to `/dashboard` or `/admin/dashboard`

#### Dummy Account
- Admin Account: `admin@politekmitra.ac.id` || `password`
- User Account: `budi@politekmitra.ac.id` || `password`

### 2. User ticket workspace

Authenticated users can:

- create tickets with title, category, priority, description, and attachments
- save tickets as `draft` before formal submission
- detect possible duplicate open tickets while composing a request
- browse their own tickets with status, priority, and search filters
- view detailed ticket history including comments, attachments, assignment history, and activity logs
- add follow-up comments
- reopen closed tickets
- submit satisfaction ratings and optional feedback on resolved tickets

Operationally, this gives end users a self-service channel for both reporting and follow-up instead of relying on informal communication.

### 3. Admin ticket operations

Admins can:

- review all tickets across the organization
- filter by status, priority, category, assignee, and keyword
- assign tickets to support staff
- change ticket status with transition rules
- add solution notes
- add internal comments not intended for users
- escalate tickets with escalation level and reason tracking
- review assignment history and audit activity per ticket

This creates a controlled processing layer for IT staff rather than a flat inbox.

### 4. Knowledge base

The repository includes a full knowledge base module with:

- authenticated article browsing for all users
- search and category filtering
- bilingual article fields (`title_en`, `title_id`, `content_en`, `content_id`)
- article attachments
- related article suggestions
- unique per-user view tracking
- admin CRUD pages for article management

This turns the project into more than a ticketing inbox by preserving reusable operational knowledge.

### 5. Notification center

Users have a dedicated notification inbox where they can:

- view all notifications
- filter unread vs read
- mark individual items as read
- mark all items as read
- delete individual notifications
- clear all read notifications

The interface supports ticket-linked notifications as well as admin broadcast messages.

### 6. Reporting and exports

Admins have access to:

- a reporting dashboard with multiple chart types and KPI blocks
- ticket and audit-log CSV exports
- status, priority, category, technician, SLA, lifecycle, and satisfaction views

This is one of the clearest signs that the repository targets institutional operations rather than a simple submission form.

### 7. User and profile management

The system includes:

- admin user directory with search, role, and department filters
- detailed user profile views for administrators
- role changes, department updates, email updates, password resets, and soft deletion
- user profile editing for personal details
- avatar and cover image uploads
- language, theme, and notification preference updates

### 8. Documentation workspace

The admin area includes a built-in documentation module with pages and diagrams for:

- ERD visualization
- notification-related ERD visualization
- authentication flow
- ticket flow
- admin flow
- use-case diagrams

This is useful both for project presentation and for onboarding future contributors.

## Enterprise Operational Features

Several implemented features move this repository beyond a generic CRUD helpdesk:

- **SLA-aware prioritization**  
  Ticket priorities are modeled as enums with response and resolution hour targets. Deadlines are stored in `response_due_at` and `due_at`.

- **Intelligent auto-assignment**  
  New non-draft tickets are automatically assigned to the admin with the lowest active workload.

- **Escalation tracking**  
  Tickets can be escalated with `is_escalated`, `escalation_level`, `escalated_at`, and `escalation_reason`.

- **Duplicate ticket checking**  
  The create-ticket flow queries similar open tickets before submission.

- **Assignment history**  
  Ticket assignments are preserved in a dedicated `ticket_assignments` table instead of only updating a single foreign key.

- **CSAT and feedback capture**  
  Closed tickets can be rated and annotated with feedback notes, and those results appear in reporting.

- **Workload monitoring**  
  Admin dashboards calculate active, overdue, and resolved workload per technician/admin.

- **Operational analytics**  
  Reports include lifecycle funnel, technician performance, SLA trend, activity heatmap, and reopened-ticket metrics.

- **Auditability**  
  Important actions are written to `activity_logs` with actor, subject, IP address, and user-agent context.

- **Communication tooling**  
  Admins can manage broadcasts, notification templates, automation rules, and delivery logs.

## Tech Stack

### Backend

- `Laravel 13`
- `PHP 8.3+`
- `Eloquent ORM`
- `Inertia Laravel`
- `Tighten Ziggy`
- `Laravel Notifications`
- `Form Request` validation
- custom `Policies`, `Enums`, `Actions`, and `Services`

### Frontend

- `React 19`
- `@inertiajs/react`
- `Tailwind CSS 4`
- `@tailwindcss/vite`
- `Framer Motion`
- `Lucide React`
- `Radix UI` primitives:
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-popover`
  - `@radix-ui/react-select`
  - `@radix-ui/react-tabs`
  - `@radix-ui/react-tooltip`

### Data, state, and utilities

- `@tanstack/react-query`
- `axios`
- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `flag-icons`
- `react-easy-crop`

### Reporting and diagram tooling

- `recharts`
- `@xyflow/react`
- `dagre`
- `html-to-image`
- `jspdf`

### Build and developer tooling

- `Vite`
- `@vitejs/plugin-react`
- `concurrently`
- `Laravel Pint`
- `PHPUnit`

### Database and runtime defaults

- local development defaults to `SQLite`
- queue, cache, and session tables are configured for database-backed operation in `.env.example`
- storage uses Laravel's `public` disk by default

## Architecture Overview

The application follows a server-driven SPA pattern:

- Laravel handles routing, validation, authorization, persistence, notifications, and orchestration.
- Inertia renders React pages without introducing a separate public REST API layer.
- React pages under `resources/js/pages/` receive server props directly from controllers.

The backend is organized around responsibility boundaries rather than giant controllers:

- `app/Http/Controllers/` handles request entry points
- `app/Actions/Tickets/` contains transaction-oriented ticket workflows such as create, update, reopen, and escalate
- `app/Services/` contains reusable reporting, audit, dashboard, and notification logic
- `app/Policies/` enforces resource access rules
- `app/Enums/` centralizes role, status, and priority semantics

The frontend mirrors that modularity:

- `resources/js/layouts/` defines authenticated and auth-only shells
- `resources/js/components/` contains shared layout pieces and UI primitives
- `resources/js/contexts/` handles language and theme state
- `resources/js/pages/` maps directly to Inertia-rendered screens

This is an Inertia monolith, not an API-first split architecture.

## Database Design

The schema visible in `database/migrations/` centers on the following entity groups.

### Core support entities

- `users`
- `ticket_categories`
- `tickets`
- `ticket_comments`
- `ticket_attachments`
- `ticket_assignments`
- `activity_logs`

### Knowledge management

- `knowledge_base_articles`
- `kb_attachments`
- `kb_article_views`

### Notification operations

- Laravel `notifications`
- `notification_broadcasts`
- `notification_templates`
- `notification_automation_rules`
- `notification_delivery_logs`
- `notification_attachments`

### Supporting configuration

- `canned_responses`
- queue, cache, and session-supporting tables generated by Laravel

### Relationship highlights

- one user creates many tickets
- one ticket belongs to one requester and may belong to one current assignee
- one ticket has many comments, attachments, assignments, and activity logs
- one knowledge-base article may have many attachments and many unique viewers
- notification broadcasts are linked to creators, templates, attachments, and delivery logs

### Data-model characteristics

- `tickets` and `users` use soft deletes
- `ticket_number` is unique
- indexes are applied to ticket status, priority, and creation date
- `kb_article_views` enforces one unique view record per article/user pair
- Laravel database notifications use the standard polymorphic `notifiable` structure

## Authentication & Authorization

Authentication is session-based and built with Laravel's web guard.

Authorization is layered:

- admin-only areas are protected by the custom `admin` middleware alias in `bootstrap/app.php`
- ticket access is guarded by `app/Policies/TicketPolicy.php`
- users can only view and manage their own tickets unless they are admins
- attachment downloads are protected by ownership/admin checks in `TicketAttachmentController`
- status transitions are validated by `TicketStatus` enum rules before persistence

In practical terms, the repository clearly separates user-facing and admin-facing operational surfaces.

## Multilingual System

The frontend includes a substantial bilingual translation dictionary in `resources/js/contexts/LanguageContext.jsx`.

Implemented multilingual behavior includes:

- English (`en`) and Indonesian (`id`) UI support
- local persistence through `localStorage`
- profile-level persistence through the `users.language` field
- bilingual knowledge base content fields
- bilingual-oriented UI copy across dashboards, tickets, notifications, and profile pages

The translation system is frontend-driven rather than based on Laravel `lang/` files.

## Ticket Workflow

The implemented lifecycle includes both a pre-submission state and the operational ticket states:

1. `draft`  
   Optional temporary state while the requester is still composing the ticket.

2. `open`  
   Active ticket after submission. SLA deadlines are generated at this stage.

3. `on_process`  
   Ticket is being actively handled by IT support.

4. `closed`  
   Ticket has been resolved and may contain solution notes, rating, and feedback.

5. `reopened`  
   A previously closed ticket was reopened because the issue persisted.

Additional workflow behavior implemented in code:

- valid transitions are enforced by `TicketStatus::allowedTransitions()`
- drafts can be submitted into active workflow
- first response timestamps can be captured when admins comment
- escalations can be tracked independently from status
- closed tickets can be rated

## Dashboard & Analytics

### User dashboard

The user dashboard focuses on personal visibility:

- total tickets
- open tickets
- in-progress tickets
- closed tickets
- recent tickets

### Admin dashboard

The admin dashboard functions as an operations console with:

- total/open/in-progress/closed/urgent/unassigned counts
- priority queue for urgent and active work
- recent activity feed from audit logs
- workload monitoring by support staff

### Reports module

The reports area aggregates a much broader operational dataset:

- overview KPIs
- ticket volume trend
- opened vs resolved trend
- status distribution
- priority distribution
- category distribution
- resolution-time trend
- technician performance
- activity heatmap
- lifecycle funnel
- satisfaction analytics
- reopened-ticket analytics
- SLA compliance trend

## Notification System

The repository implements two notification layers.

### 1. User-facing notification inbox

Users receive database notifications for ticket-related events and can manage them through a dedicated notification page with read/unread handling.

### 2. Admin notification operations center

Admins can manage:

- broadcast messages
- reusable notification templates
- automation-rule records
- delivery logs
- notification dashboard metrics

Current behavior visible in source code:

- broadcasts can be sent immediately or scheduled
- audience targeting supports all users, departments, roles, or explicit users
- immediate broadcast dispatch is implemented for the `database` channel
- delivery logs track sent/read state per recipient
- email delivery is acknowledged in code comments as future-extensible rather than fully implemented today

## File Attachment & Preview

Attachments are implemented in several areas of the system.

### Ticket attachments

Supported attachment families in validation rules include:

- images: `jpg`, `jpeg`, `png`, `gif`, `webp`
- documents: `pdf`, `doc`, `docx`, `xls`, `xlsx`, `ppt`, `pptx`
- archives and text: `zip`, `csv`, `txt`, `md`

Other attachment characteristics:

- backend validation allows up to `100MB` per file
- files are stored on the `public` disk
- access is served through a secure controller route rather than blind public exposure
- download and inline response behavior are both supported

### Knowledge base attachments

Knowledge-base articles can also store attachments under article-specific directories.

### Profile media

Users can upload:

- avatar photos
- cover/banner images

These are validated independently from ticket attachments.

## Screenshots / UI Showcase

No static UI screenshots are currently committed in the repository.

Visual assets and showcase material that do exist today:

- `public/images/Logo_POLMIND.png`
- `public/images/background.png`
- `public/images/contoh_background.png`
- admin documentation pages with interactive diagrams under `resources/js/pages/Admin/Documentation/`

If this repository is being prepared for judging or public presentation, the most valuable next addition would be curated screenshots from:

- login
- user dashboard
- create-ticket form
- ticket detail
- admin dashboard
- reports dashboard
- notification center

## Installation Guide

### Prerequisites

- `PHP 8.3+`
- `Composer`
- `Node.js`
- `npm`

### 1. Clone the repository

```bash
git clone <repository-url>
cd Sistem-Ticketing-IT-Support
```

### 2. Install backend dependencies

```bash
composer install
```

### 3. Prepare the environment file

```bash
php -r "file_exists('.env') || copy('.env.example', '.env');"
```

### 4. Ensure the default SQLite database file exists

```bash
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
```

The repository already includes `database/database.sqlite`, but this command keeps first-time setup reproducible.

### 5. Generate the application key

```bash
php artisan key:generate
```

### 6. Run migrations and seed base data

```bash
php artisan migrate --seed
```

Seeded defaults include:

- one admin account
- one sample user account
- baseline ticket categories

### 7. Install frontend dependencies

```bash
npm install
```

### 8. Start the development stack

For a full local stack using the repository's Composer script:

```bash
composer run dev
```

That script starts:

- `php artisan serve`
- `php artisan queue:listen`
- `php artisan pail`
- `npm run dev`

If you prefer to run services manually:

```bash
php artisan serve
npm run dev
```

### 9. Optional production asset build

```bash
npm run build
```

## Environment Variables

The most important variables visible in `.env.example` are:

| Variable | Purpose |
| --- | --- |
| `APP_NAME` | Application name shown in UI and notifications |
| `APP_ENV` / `APP_DEBUG` / `APP_URL` | Core runtime environment and base URL |
| `APP_LOCALE` / `APP_FALLBACK_LOCALE` | Default Laravel locale configuration |
| `DB_CONNECTION` | Defaults to `sqlite` in local setup |
| `SESSION_DRIVER` | Defaults to `database` |
| `CACHE_STORE` | Defaults to `database` |
| `QUEUE_CONNECTION` | Defaults to `database` |
| `FILESYSTEM_DISK` | Defaults to `local` / storage-backed file handling |
| `MAIL_*` | Mail transport configuration, defaults to `log` mailer locally |
| `AWS_*` | Optional object storage integration if moving beyond local disk |
| `VITE_APP_NAME` | Frontend application title |

For this repository's default local setup, the most immediately relevant values are the database, queue, mail, filesystem, and locale settings.

## Folder Structure

The directories that matter most to contributors are:

```text
app/
|-- Actions/                # Transactional domain workflows
|-- Console/                # Artisan command(s)
|-- Enums/                  # Role, ticket status, and priority enums
|-- Http/
|   |-- Controllers/        # Web and admin controllers
|   |-- Middleware/         # Inertia middleware and admin access middleware
|   `-- Requests/           # Form Request validation
|-- Models/                 # Eloquent models
|-- Notifications/          # Notification classes
|-- Policies/               # Authorization policies
|-- Services/               # Dashboard, report, audit, notification services
`-- Support/Helpers/        # Utilities such as ticket number generation

database/
|-- factories/
|-- migrations/
|-- seeders/
`-- database.sqlite         # Default local database file

resources/
|-- css/                    # Tailwind-based global stylesheet
|-- js/
|   |-- components/         # Shared UI and layout components
|   |-- contexts/           # Language and theme contexts
|   |-- layouts/            # Auth and app shells
|   |-- pages/              # Inertia page components
|   |-- utils/
|   `-- app.jsx             # Frontend entrypoint
`-- views/                  # Blade shell used by Inertia

routes/
|-- web.php                 # Main application routes
`-- console.php

public/
|-- build/                  # Built frontend assets
|-- images/                 # Branding and UI background assets
`-- favicon.ico

tests/
|-- Feature/
`-- Unit/
```

## Security Features

The codebase includes several concrete security and integrity measures:

- backend validation through dedicated Form Request classes and controller validation
- session-based authentication
- CSRF protection through Laravel's web stack
- custom admin middleware for privileged routes
- resource-level authorization in `TicketPolicy`
- secure attachment serving with owner/admin checks
- enum-based ticket transition validation
- soft deletes for key records
- audit logging for sensitive and operational actions
- password hashing through Laravel's built-in auth model casting

## Performance & Operational Notes

Performance-related patterns that are clearly present in the repository include:

- eager loading on ticket, article, and broadcast detail views
- pagination on major user/admin listings
- chunked CSV export to avoid loading all records into memory at once
- Vite-based asset bundling
- generated `public/build/` assets already present in the repository
- database-backed queue, cache, and session infrastructure provisioned in migrations and env defaults

Operationally useful implementation details include:

- a `/storage/{path}` fallback route exists for Windows development environments where storage symlinks can be inconvenient
- `composer run dev` already orchestrates the main local services needed during development

## Deployment Notes

For production use, the repository implies the following baseline workflow:

1. Configure the application environment and a production database.
2. Run `composer install --no-dev` and `npm run build`.
3. Run `php artisan migrate --force`.
4. Configure the mailer, queue connection, and filesystem disk appropriately.
5. Use a proper queue worker if notification or background workloads are expected to grow.
6. Use standard Laravel public storage practices such as `php artisan storage:link` when appropriate.

The project is built with a production-minded folder structure, but actual deployment details such as server type, supervisor configuration, and object storage selection are not yet documented in this repository.

## Documentation Assets

Repository-level documentation already present includes:

- `Website documentation module in Admin Role`
  Interactive in-app documentation pages and diagrams under the admin area.

## Future Improvements

Natural next steps, based on the current codebase, would be:

- add committed UI screenshots and GIF previews to strengthen repository presentation
- expand automated notification-rule execution beyond CRUD configuration records
- implement broader automated test coverage beyond the current example tests
- document production deployment in more detail
- extend notification delivery beyond the current database-first implementation
- standardize a few multilingual content/admin configuration edges across older and newer modules

## Contributors / Author

Based on the bundled project documentation, this application was prepared as an academic project for Politeknik Mitra Industri by:

- `Muhammad Sabri Akbar`

## License

This project is distributed under the MIT License.

### Why MIT License
The MIT License was chosen because it is simple, widely recognized, and repository-friendly. As a standard open-source license, it provides absolute clarity without imposing heavy legal burdens. This permissive structure makes it particularly appropriate for an academic, portfolio, and competition project, enabling reviewers, evaluators, and the broader development community to freely inspect and evaluate the codebase.

### Permissions
Under the terms of the MIT License, you are granted broad permissions to interact with this repository. You are allowed to:
- **Reuse and Integrate:** Incorporate this software, in whole or in part, into other projects.
- **Modify and Adapt:** Alter the source code to suit your specific operational or technical requirements.
- **Distribute and Share:** Redistribute the original or modified source code to third parties.
- **Private and Public Use:** Deploy the system in private institutional networks or public-facing environments without the obligation to publish your proprietary modifications.

### Conditions
While the license provides extensive freedom, it requires adherence to the following conditions to protect the original attribution:
- **Copyright Preservation:** You must retain the original copyright notice in all copies or substantial portions of the software.
- **License Inclusion:** Any redistribution of this codebase must include an unaltered copy of the MIT License text.

### Warranty Disclaimer
This software is provided "as is", without any warranty of any kind, whether express or implied. This includes, but is not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement. In no event shall the author or copyright holder be held liable for any claims, damages, or other operational liabilities arising from the use, deployment, or inability to use this software.

### Project Context and Attribution
This repository serves as a functional, competition-oriented academic project, architected to demonstrate enterprise-grade IT support capabilities. The application of the MIT License supports responsible reuse and open technical evaluation without overcomplicating the project with restrictive legal terms.

If you choose to reuse, fork, or adapt this code for your own academic or professional work, proper attribution must be preserved. Acknowledging the original author and the Politeknik Mitra Industri context respects the extensive engineering effort invested in this platform.

For the full legal text, please refer to the [LICENSE](LICENSE) file located in the root directory of this repository.

---

*Architected and developed as a comprehensive IT Support Ticketing platform for Politeknik Mitra Industri by Muhammad Sabri Akbar.*
