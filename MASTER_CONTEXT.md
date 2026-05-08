# MASTER_CONTEXT.md

> **Single Source of Truth** for the Sistem Ticketing IT Support project.
> This document is the primary onboarding and context reference for all AI systems, technical assistants, and human contributors.
> Read this file in its entirety before generating documentation, diagrams, presentations, or implementation suggestions.

---

## 1. Project Identity

| Field | Value |
|---|---|
| Project Name | Sistem Ticketing IT Support |
| Organization | Politeknik Mitra Industri (PT Mitra Industri) |
| Project Type | UTS Semester 2 — Tugas Individu |
| Author | Muhammad Sabri Akbar |
| Domain | Internal IT Support Operations |
| System Class | Institutional Web Application |
| Status | Active Development |

---

## 2. Project Purpose

The Sistem Ticketing IT Support is an internal, institutional web application developed to digitize and centralize the IT complaint handling workflow at Politeknik Mitra Industri.

The system replaces informal, manual reporting mechanisms (phone calls, text messages, verbal reports) with a structured, auditable, and transparent digital platform. It enables employees to submit IT complaints as tickets, and enables the IT Support team to manage, prioritize, track, and resolve those tickets through a unified operational interface.

This is NOT a public SaaS product, consumer application, marketplace, or social platform. It is an enterprise-grade internal operations tool designed for daily institutional use.

---

## 3. Business Problems Solved

The system was created to address the following documented operational failures:

| Problem | Impact | How the System Solves It |
|---|---|---|
| Complaints not recorded | Reports submitted verbally or via informal messages are frequently lost or forgotten | Every complaint is recorded as a ticket with a unique number, metadata, and timestamps |
| Tickets accumulate without tracking | No queue system causes complaints to pile up without visibility | Tickets are listed, filtered, sorted, and prioritized through the admin dashboard |
| Urgent issues difficult to prioritize | No standard mechanism to flag or identify critical issues | Four-tier priority system (Low, Medium, High, Critical) with SLA-based resolution targets |
| Repair history not documented | Solutions to past problems are lost, forcing re-diagnosis | Solution notes are stored permanently on each ticket for future reference |
| IT reports difficult to generate | No structured data available for performance reporting | Analytics dashboard with trend charts, distribution graphs, and exportable data |
| Users unaware of complaint status | Employees must manually ask IT staff for updates | Real-time status tracking via user dashboard and automatic notifications |
| Manual complaint handling | Entire workflow depends on informal communication | End-to-end digital workflow from ticket creation to resolution |
| Inefficient operational monitoring | No centralized view of IT workload and performance | Admin dashboard with operational metrics, activity feeds, and SLA monitoring |

---

## 4. System Goals

1. Digitize the entire IT complaint lifecycle from submission to resolution
2. Centralize ticket management into a single, accessible platform
3. Provide structured workflows with clear status transitions
4. Enable real-time ticket tracking for both users and administrators
5. Improve communication through automated notifications
6. Deliver operational dashboards with actionable analytics
7. Maintain complete audit trails for accountability
8. Support scalable, maintainable, and production-ready architecture

---

## 5. User Roles

The system implements two distinct roles with strict access boundaries.

### 5.1 User (Employee / Karyawan)

The default role assigned upon registration. Users interact with the system as complaint submitters and ticket owners.

**Capabilities:**
- Register a new account with name, email, password, phone, and department
- Login and logout with session-based authentication
- Access a personal dashboard showing ticket statistics and recent activity
- Create new tickets with title, description, category, priority, and file attachments
- View a list of their own tickets with status, priority, and date information
- View detailed ticket pages showing full metadata, comments, attachments, and activity history
- Add comments to their own tickets for clarification or follow-up
- Reopen tickets that were closed prematurely
- Rate resolved tickets and provide feedback
- Receive notifications about ticket status changes and admin broadcasts
- Edit profile information including name, phone, department, and avatar
- Upload and crop profile photos
- Switch the interface language between Indonesian (ID) and English (EN)
- Manage notification preferences

### 5.2 Admin (IT Support / Administrator)

Admins have full operational access to the system. They manage tickets, users, notifications, reports, and system configuration.

**Capabilities:**
- Access a comprehensive admin dashboard with system-wide ticket statistics
- View all tickets from all users in a centralized interface
- Filter tickets by status, priority, category, date range, and search keywords
- Update ticket status through defined transitions (Open → On Process → Closed)
- Assign tickets to specific IT support staff
- Add solution notes documenting how issues were resolved
- View and manage user accounts, including role changes
- Access the Reports module with analytics charts and trend data
- Export ticket data and audit logs
- Access the Notification Operations Center (dashboard, broadcasts, templates, automation)
- Create and send broadcast notifications to users
- Manage notification templates and automation rules
- Access the Audit Log for system-wide activity tracking
- Manage system settings including ticket categories and canned responses (macros)

---

## 6. Technical Architecture

### 6.1 Architecture Pattern

The system follows a **Laravel Monolith with Inertia SPA** architecture. There is no separated REST API. All routing is server-driven through Laravel, with React components rendered client-side via Inertia.js as the bridge layer.

```
Browser ←→ Inertia.js ←→ Laravel Router ←→ Controller ←→ Service/Action ←→ Model ←→ Database
```

### 6.2 Backend Stack

| Technology | Role |
|---|---|
| Laravel 13 | Application framework, routing, middleware, request lifecycle |
| PHP 8.3+ | Server-side runtime with modern type safety features |
| Eloquent ORM | Database interaction, relationships, scopes, casts |
| Form Request Validation | Centralized backend validation for all inputs |
| Policies and Gates | Role-based and resource-based authorization |
| Notifications (Laravel) | Multi-channel notification delivery |
| Queues and Jobs | Asynchronous task processing |
| Events and Listeners | Decoupled system behavior for logging, notifications |
| Soft Deletes | Safe data retention for tickets and users |

### 6.3 Frontend Stack

| Technology | Role |
|---|---|
| React | Component-based UI rendering |
| Inertia.js | Server-driven SPA navigation without a separate API |
| Tailwind CSS | Utility-first styling with institutional design tokens |
| Framer Motion | Subtle animations, transitions, micro-interactions |
| Lucide React | Consistent SVG icon system |
| Radix UI / Headless UI | Accessible unstyled component primitives |
| Recharts | Data visualization for analytics dashboards |
| TanStack Query | Client-side data fetching and caching where beneficial |
| react-hook-form + zod | Complex form management with schema validation |

### 6.4 Data Layer

| Technology | Role |
|---|---|
| MySQL / MariaDB | Primary relational database |
| Redis (optional) | Cache and queue driver |
| Local Storage / S3 | File attachment storage |

### 6.5 Build Tooling

| Technology | Role |
|---|---|
| Vite | Frontend build tool with HMR |
| Node.js | JavaScript runtime for build process |
| npm / pnpm | Package management |

---

## 7. Database Schema

### 7.1 Core Entities

The database consists of 19 migration files defining the following entities:

| Entity | Table | Purpose |
|---|---|---|
| User | `users` | System users with role, department, avatar, language preference |
| Ticket | `tickets` | Core complaint records with status, priority, assignment, SLA |
| TicketCategory | `ticket_categories` | Categorization of ticket types |
| TicketComment | `ticket_comments` | Discussion threads on tickets |
| TicketAttachment | `ticket_attachments` | Files uploaded with tickets |
| TicketAssignment | `ticket_assignments` | Assignment history tracking |
| ActivityLog | `activity_logs` | Polymorphic audit trail |
| CannedResponse | `canned_responses` | Reusable response templates (macros) |
| NotificationBroadcast | `notification_broadcasts` | Admin broadcast messages |
| NotificationTemplate | `notification_templates` | Configurable notification templates |
| NotificationAttachment | `notification_attachments` | Files attached to broadcasts |
| NotificationDeliveryLog | `notification_delivery_logs` | Delivery tracking and analytics |
| NotificationAutomationRule | `notification_automation_rules` | Automated notification triggers |

### 7.2 Key Relationships

```
User (1) ──→ (N) Ticket          [user creates tickets]
User (1) ──→ (N) Ticket          [admin assigned to tickets via assigned_to]
Ticket (1) ──→ (N) TicketComment  [ticket has comments]
Ticket (1) ──→ (N) TicketAttachment [ticket has file attachments]
Ticket (1) ──→ (N) TicketAssignment [ticket has assignment history]
Ticket (1) ──→ (N) ActivityLog    [polymorphic audit entries]
Ticket (N) ──→ (1) TicketCategory  [ticket belongs to category]
User (1) ──→ (N) TicketComment    [user writes comments]
User (1) ──→ (N) ActivityLog      [user generates activity]
```

### 7.3 Ticket Model Fields

| Field | Type | Description |
|---|---|---|
| `ticket_number` | string | Auto-generated unique identifier |
| `title` | string | Short description of the issue |
| `description` | text | Detailed problem description |
| `status` | enum | Current lifecycle state (cast to TicketStatus) |
| `priority` | enum | Urgency level (cast to TicketPriority) |
| `user_id` | FK | Creator/requester |
| `category_id` | FK | Issue category |
| `assigned_to` | FK (nullable) | Assigned technician |
| `solution_notes` | text (nullable) | Resolution documentation |
| `due_at` | datetime (nullable) | SLA deadline |
| `rating` | integer (nullable) | User satisfaction rating |
| `feedback_notes` | text (nullable) | User feedback on resolution |
| `closed_at` | datetime (nullable) | Resolution timestamp |
| `deleted_at` | datetime (nullable) | Soft delete timestamp |

### 7.4 Enums

**TicketStatus** (`open`, `on_process`, `closed`, `reopened`):
- Defines the ticket lifecycle states
- Includes `allowedTransitions()` method enforcing valid state changes:
  - `open` → `on_process`, `closed`
  - `on_process` → `closed`, `open`
  - `closed` → `reopened`, `open`
  - `reopened` → `on_process`, `closed`, `open`

**TicketPriority** (`low`, `medium`, `high`, `critical`):
- Defines urgency levels with sort ordering
- Includes SLA resolution targets:
  - Critical: 4 hours
  - High: 24 hours (1 day)
  - Medium: 72 hours (3 days)
  - Low: 168 hours (7 days)

**UserRole** (`user`, `admin`):
- Two-role system with strict access boundaries

### 7.5 User Model Fields

| Field | Type | Description |
|---|---|---|
| `name` | string | Full name |
| `email` | string | Unique login identifier |
| `password` | string (hashed) | Authentication credential |
| `phone` | string (nullable) | Contact number |
| `department` | string (nullable) | Organizational unit |
| `role` | enum | user or admin (cast to UserRole) |
| `avatar_path` | string (nullable) | Profile photo path |
| `language` | string | Interface language preference (id/en) |
| `notification_preferences` | json | Notification channel settings |
| `last_login_at` | datetime | Last authentication timestamp |

---

## 8. Authentication System

### 8.1 Authentication Flow

The system uses Laravel's session-based authentication with the following flow:

1. **Registration**: User fills form → `RegisterController` validates via Form Request → User created with `role: user` → Redirect to login
2. **Login**: User submits credentials → `LoginController` authenticates → Session created → Role-based redirect (user → `/dashboard`, admin → `/admin/dashboard`)
3. **Logout**: Session destroyed → Redirect to login
4. **Password Reset**: Email-based reset flow via `PasswordResetController`

### 8.2 Authentication UI

The authentication pages use a **split-screen layout** (`AuthLayout.jsx`):

- **Left Panel**: Institutional branding panel with deep blue background, Politeknik Mitra Industri logo, gold-colored institution name typography, and subtle atmospheric styling
- **Right Panel**: Clean form area with login/register forms, logo placement, language switcher, and refined input styling

The design is institutional, premium, and minimal — not startup-like or flashy.

---

## 9. Route Architecture

### 9.1 Guest Routes

| Method | URI | Controller | Purpose |
|---|---|---|---|
| GET | `/` | redirect | Redirects to login |
| GET/POST | `/login` | LoginController | Authentication |
| GET/POST | `/register` | RegisterController | Account creation |
| GET/POST | `/forgot-password` | PasswordResetController | Password recovery |

### 9.2 Authenticated User Routes

| Method | URI | Name | Purpose |
|---|---|---|---|
| POST | `/logout` | logout | End session |
| GET | `/dashboard` | dashboard | User dashboard |
| Resource | `/tickets` | tickets.* | CRUD for user tickets |
| POST | `/tickets/{ticket}/reopen` | tickets.reopen | Reopen closed ticket |
| POST | `/tickets/{ticket}/rate` | tickets.rate | Rate resolved ticket |
| POST | `/tickets/{ticket}/comments` | tickets.comments.store | Add comment |
| GET | `/attachments/{attachment}` | attachments.show | Secure file serving |
| GET/PUT | `/profile` | profile.* | Profile management |
| POST/DELETE | `/profile/photo` | profile.photo.* | Avatar management |
| PUT | `/profile/password` | profile.password | Password change |
| PUT | `/profile/preferences` | profile.preferences | Language and notification preferences |
| GET | `/notifications` | notifications.index | Notification center |
| POST | `/notifications/{id}/read` | notifications.read | Mark as read |
| POST | `/notifications/read-all` | notifications.readAll | Mark all read |
| DELETE | `/notifications/{id}` | notifications.destroy | Delete notification |

### 9.3 Admin Routes (prefix: `/admin`, middleware: `admin`)

| Method | URI | Name | Purpose |
|---|---|---|---|
| GET | `/admin/dashboard` | admin.dashboard | Admin dashboard |
| GET | `/admin/tickets` | admin.tickets.index | All tickets list |
| GET | `/admin/tickets/{ticket}` | admin.tickets.show | Ticket detail |
| PUT | `/admin/tickets/{ticket}` | admin.tickets.update | Update status/notes |
| POST | `/admin/tickets/{ticket}/assign` | admin.tickets.assign | Assign technician |
| GET | `/admin/users` | admin.users.index | User management |
| GET | `/admin/users/{user}` | admin.users.show | User detail |
| PUT | `/admin/users/{user}/role` | admin.users.updateRole | Change user role |
| GET | `/admin/reports` | admin.reports.index | Reports and analytics |
| GET | `/admin/audit-log` | admin.auditLog.index | Audit log viewer |
| Resource | `/admin/notifications/broadcasts` | admin.notifications.broadcasts.* | Broadcast management |
| Resource | `/admin/notifications/templates` | admin.notifications.templates.* | Template management |
| Resource | `/admin/notifications/automation` | admin.notifications.automation.* | Automation rules |
| GET | `/admin/notifications/dashboard` | admin.notifications.dashboard | Notification analytics |
| GET | `/admin/settings` | admin.settings.index | System settings |
| POST | `/admin/settings/categories` | admin.settings.storeCategory | Add ticket category |
| PUT | `/admin/settings/categories/{id}/toggle` | admin.settings.toggleCategory | Enable/disable category |
| POST | `/admin/settings/macros` | admin.settings.storeMacro | Add canned response |
| PUT | `/admin/settings/macros/{id}/toggle` | admin.settings.toggleMacro | Enable/disable macro |
| GET | `/admin/export/tickets` | admin.export.tickets | Export ticket data |
| GET | `/admin/export/audit-logs` | admin.export.auditLogs | Export audit logs |

---

## 10. Backend Architecture

### 10.1 Folder Structure

```
app/
├── Actions/                    # Single-purpose action classes
├── Enums/
│   ├── TicketStatus.php        # open, on_process, closed, reopened
│   ├── TicketPriority.php      # low, medium, high, critical
│   └── UserRole.php            # user, admin
├── Http/
│   ├── Controllers/
│   │   ├── Auth/               # LoginController, RegisterController, PasswordResetController
│   │   ├── Admin/              # AdminDashboardController, AdminTicketController, etc.
│   │   ├── DashboardController.php
│   │   ├── TicketController.php
│   │   ├── TicketAttachmentController.php
│   │   ├── TicketCommentController.php
│   │   ├── NotificationController.php
│   │   └── ProfileController.php
│   ├── Middleware/
│   └── Requests/               # Form Request validation classes
├── Models/
│   ├── User.php
│   ├── Ticket.php
│   ├── TicketCategory.php
│   ├── TicketComment.php
│   ├── TicketAttachment.php
│   ├── TicketAssignment.php
│   ├── ActivityLog.php
│   ├── CannedResponse.php
│   ├── NotificationBroadcast.php
│   ├── NotificationTemplate.php
│   ├── NotificationAttachment.php
│   ├── NotificationDeliveryLog.php
│   └── NotificationAutomationRule.php
├── Notifications/
├── Policies/
├── Providers/
├── Services/
│   ├── AuditService.php        # Activity logging
│   ├── DashboardService.php    # Dashboard statistics computation
│   ├── NotificationService.php # Notification delivery logic
│   └── ReportService.php       # Analytics and report generation
└── Support/
```

### 10.2 Admin Controllers

| Controller | Responsibility |
|---|---|
| AdminDashboardController | System-wide statistics and dashboard data |
| AdminTicketController | Full ticket management (view, update, assign) |
| AuditLogController | Activity log viewing and filtering |
| ExportController | Data export (tickets, audit logs) |
| ReportController | Analytics and reporting data |
| SettingsController | Categories and macros management |
| UserManagementController | User listing, detail, role management |
| NotificationDashboardController | Notification analytics and metrics |
| NotificationBroadcastController | Broadcast CRUD and delivery |
| NotificationTemplateController | Template CRUD |
| NotificationAutomationController | Automation rule CRUD |

### 10.3 Service Layer

| Service | Responsibility |
|---|---|
| AuditService | Records activity log entries for system actions |
| DashboardService | Computes ticket counts, trends, and dashboard metrics |
| NotificationService | Handles notification creation, delivery, and tracking |
| ReportService | Generates analytics data including charts, trends, SLA metrics |

---

## 11. Frontend Architecture

### 11.1 Folder Structure

```
resources/js/
├── app.jsx                     # Application entry point
├── components/
│   ├── layout/                 # Navigation, sidebar, header components
│   ├── shared/                 # Reusable cross-page components
│   └── ui/                     # Primitive UI components (buttons, inputs, badges)
├── contexts/                   # React context providers
├── layouts/
│   ├── AppLayout.jsx           # Main application layout with sidebar
│   └── AuthLayout.jsx          # Split-screen authentication layout
├── lib/                        # Utility libraries and configurations
├── pages/
│   ├── Auth/                   # Login, Register pages
│   ├── Dashboard/              # User dashboard
│   ├── Tickets/                # Create, Show, Index (user-facing)
│   ├── Notifications/          # User notification center
│   ├── Profile/                # Profile editing
│   └── Admin/
│       ├── Dashboard.jsx       # Admin operational dashboard
│       ├── AuditLog.jsx        # Audit log viewer
│       ├── Settings.jsx        # System configuration
│       ├── Tickets/            # Admin ticket management
│       ├── Users/              # User management
│       ├── Reports/
│       │   ├── Index.jsx       # Reports overview
│       │   └── Charts.jsx      # Recharts visualization components
│       └── Notifications/
│           ├── Dashboard.jsx   # Notification analytics
│           ├── Create.jsx      # Broadcast creation
│           ├── Broadcasts/     # Broadcast management
│           ├── Templates/      # Template management
│           └── Automation/     # Automation rules
└── utils/                      # Helper functions
```

### 11.2 Layout System

**AppLayout.jsx**: The main application shell wrapping all authenticated pages. Includes sidebar navigation, header with user dropdown, notification bell, and language switcher.

**AuthLayout.jsx**: The split-screen authentication layout with institutional branding on the left and forms on the right. Uses Framer Motion for smooth transitions.

### 11.3 Charting System

The analytics visualizations use **Recharts** with the following chart types implemented in `Charts.jsx`:

| Chart Type | Purpose |
|---|---|
| AreaChart | Ticket volume trends over time |
| LineChart | Resolution time trends |
| BarChart | Status and priority distribution |
| PieChart | Category distribution |
| FunnelChart | Ticket lifecycle funnel |

Color palette follows the institutional design system:
- Primary Blue: `#1d4ed8`
- Emerald (closed): `#059669`
- Amber (in progress): `#d97706`
- Rose (reopened/critical): `#e11d48`
- Slate (neutral): `#64748b`

---

## 12. Ticket Lifecycle

### 12.1 Status Flow Diagram

```
                    ┌──────────┐
         ┌─────────│  CLOSED  │←────────┐
         │         └──────────┘         │
         │              │               │
         ▼              ▼               │
  ┌──────────┐   ┌──────────┐   ┌──────────────┐
  │   OPEN   │──→│ON_PROCESS│──→│   CLOSED     │
  └──────────┘   └──────────┘   └──────────────┘
         ▲              │               │
         │              │               ▼
         │              │        ┌──────────┐
         └──────────────┘        │ REOPENED │
                                 └──────────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │  ON_PROCESS  │
                               └──────────────┘
```

### 12.2 Complete Ticket Workflow

1. **User creates ticket**: Fills form with title, description, category, priority, and optional attachments
2. **Ticket saved as `open`**: Unique ticket number generated, notification sent to admins
3. **Admin reviews ticket**: Views detail, assigns to technician if needed
4. **Status updated to `on_process`**: User receives notification of status change
5. **Admin resolves issue**: Adds solution notes documenting the fix
6. **Status updated to `closed`**: `closed_at` timestamp recorded, user notified
7. **User reviews resolution**: Can rate the resolution and provide feedback
8. **Optional reopen**: If issue persists, user can reopen → status becomes `reopened`
9. **Re-handling cycle**: Reopened tickets re-enter the processing workflow

### 12.3 SLA System

Each priority level has a defined SLA target:

| Priority | SLA Target | Description |
|---|---|---|
| Critical | 4 hours | System-down, security incidents |
| High | 24 hours | Major functionality blocked |
| Medium | 72 hours | Moderate impact, workaround exists |
| Low | 168 hours | Minor issues, general requests |

The `due_at` field tracks SLA deadlines. The analytics dashboard monitors SLA compliance rates.

---

## 13. Notification System

### 13.1 Architecture

The notification system is a major module consisting of five components:

| Component | Controller | Description |
|---|---|---|
| Notification Dashboard | NotificationDashboardController | Analytics and metrics for notification operations |
| Broadcasts | NotificationBroadcastController | Mass notification creation and delivery |
| Templates | NotificationTemplateController | Reusable notification content templates |
| Automation | NotificationAutomationController | Rule-based automatic notifications |
| User Notifications | NotificationController | User-facing notification center |

### 13.2 Notification Types

1. **Status Change Notifications**: Automatically sent when ticket status changes
2. **Comment Notifications**: Sent when new comments are added to tickets
3. **Assignment Notifications**: Sent when tickets are assigned to technicians
4. **Broadcast Notifications**: Mass notifications from admin to users
5. **System Notifications**: Maintenance and policy announcements

### 13.3 Delivery Tracking

Each notification delivery is logged in `notification_delivery_logs` tracking:
- Delivery status
- Delivery timestamp
- Read/unread state
- Channel used

### 13.4 User Notification Center

Users access `/notifications` to:
- View all received notifications in chronological order
- See read/unread states
- Mark individual or all notifications as read
- Delete specific notifications
- Delete all read notifications

---

## 14. Analytics and Reporting

### 14.1 Report Service

The `ReportService.php` (14,486 bytes) is the largest service file, generating comprehensive analytics data including:

- Ticket volume trends (daily, weekly, monthly)
- Status distribution across all tickets
- Priority distribution analysis
- Open vs resolved trends
- SLA compliance metrics
- Technician performance data
- Category-based analysis
- Lifecycle analytics
- Escalation tracking

### 14.2 Dashboard Metrics

**User Dashboard** (via `DashboardService`):
- Personal ticket count by status
- Recent tickets list
- Quick action shortcuts

**Admin Dashboard** (via `AdminDashboardController`):
- System-wide ticket counts (total, open, on_process, closed)
- Urgent ticket count
- Recent activity feed
- Performance indicators

**Reports Page** (via `ReportController`):
- Full analytics suite with interactive charts
- Date range filtering
- Data export capabilities

### 14.3 Export System

The `ExportController` provides:
- Ticket data export (CSV/Excel format)
- Audit log export
- Filtered data export based on current view parameters

---

## 15. Design Direction

### 15.1 Design Philosophy

The visual design follows an **institutional, enterprise-inspired** direction that prioritizes:
- Operational clarity over aesthetic decoration
- Readability and information density
- Professional, calm visual atmosphere
- Clean spacing and strong typography hierarchy
- Restrained use of color and motion

### 15.2 What the Design IS

- Institutional and professional
- Enterprise-grade and operational
- Modern but restrained
- Clean with purposeful whitespace
- Strong typographic hierarchy
- Premium without being flashy

### 15.3 What the Design is NOT

- Startup-like or playful
- Heavily gradient-based
- Neumorphic or glassmorphic
- AI-template-like or generic
- Over-decorated or visually cluttered
- Neon or futuristic

### 15.4 Color System

| Role | Color | Hex |
|---|---|---|
| Primary Brand | Deep Blue | `#1d4ed8` |
| Primary Light | Light Blue | `#93c5fd` |
| Success / Closed | Emerald | `#059669` |
| Warning / In Progress | Amber | `#d97706` |
| Danger / Critical | Rose | `#e11d48` |
| Neutral / Inactive | Slate | `#64748b` |
| Background | White/Slate-50 | `#f8fafc` |
| Text Primary | Slate-900 | `#0f172a` |

### 15.5 Typography

- Primary font: **Plus Jakarta Sans** (or Inter as fallback)
- Strong heading hierarchy with clear size differentiation
- Readable line-height and balanced spacing
- No decorative or script fonts

### 15.6 Motion

Framer Motion is used with the following principles:
- Subtle, purposeful transitions
- Smooth page/component entry animations
- Restrained modal and dropdown animations
- No flashy, gimmicky, or excessive motion
- Animation enhances comprehension, never distracts

### 15.7 Iconography

Lucide React is used exclusively for all icons:
- Consistent size and stroke width across the application
- No emoji used anywhere in the interface
- Icons support visual communication without overwhelming

---

## 16. File Attachment System

### 16.1 Secure File Serving

All attachments are served through the `TicketAttachmentController` via the `attachments.show` route. Files are NOT served directly from public storage URLs.

The secure serving flow:
1. User requests `/attachments/{attachment}`
2. Controller verifies authentication
3. Controller verifies ownership (user owns the ticket, or user is admin)
4. File is streamed from private storage
5. Optional forced download via `?download=1` query parameter

### 16.2 Supported File Types

The system accepts all file types for upload (no MIME restriction), with a maximum file size of 10MB. The frontend displays contextual icons based on file type:
- Image files: Image icon with inline preview
- PDF files: FileText icon
- Archive files: FileArchive icon
- Spreadsheet files: FileSpreadsheet icon
- Code files: FileCode icon
- Other files: File icon with extension label

### 16.3 Storage

Files are stored in Laravel's private storage (`storage/app/`) and are not publicly accessible. The `storage.serve` route provides a fallback for development environments where symlinks may not work (Windows).

---

## 17. Multilingual System

### 17.1 Supported Languages

| Language | Code | Flag |
|---|---|---|
| Bahasa Indonesia | `id` | ID flag |
| English | `en` | US flag |

### 17.2 Implementation

- Language preference is stored in the `users.language` column
- Language switcher is available in the authentication layout and main app layout
- Preferences are updated via the `profile.preferences` route
- UI elements translate based on the active language setting
- Indonesian text follows proper KBBI standards

---

## 18. Project Boundaries and Restrictions

### 18.1 What This System IS

- An internal institutional IT support platform
- A ticket management and tracking system
- An operational monitoring tool
- An enterprise-grade web application
- A structured complaint handling workflow

### 18.2 What This System is NOT

- A public SaaS product or startup MVP
- A social media or communication platform
- A marketplace or e-commerce system
- A consumer-facing application
- An AI-powered automated resolution system (unless explicitly specified)

### 18.3 Generation Rules for AI Systems

When generating content based on this MASTER_CONTEXT.md:

1. **DO** remain contextual to the actual implemented system
2. **DO** reference real controllers, models, routes, and components
3. **DO** maintain the institutional, professional tone
4. **DO** explain features based on actual implementation
5. **DO NOT** hallucinate features that do not exist
6. **DO NOT** invent unrelated modules or systems
7. **DO NOT** use startup marketing language
8. **DO NOT** overcomplicate the architecture description
9. **DO NOT** generate fake workflows or unrealistic enterprise jargon
10. **DO NOT** describe the UI as flashy, playful, or futuristic

### 18.4 Documentation Generation Guidelines

Future documentation (DOCX, presentations, diagrams) must:
- Follow academic and technical writing standards
- Remain aligned with the actual codebase
- Use proper Indonesian (KBBI) for Indonesian-language documents
- Include only features that are actually implemented
- Reference real file paths and class names where appropriate
- Maintain a professional, institutional tone throughout

### 18.5 Diagram Generation Guidelines

ERD, flowcharts, use case diagrams, and other technical diagrams must:
- Reflect the actual database schema and relationships
- Use the actual enum values and status names
- Show realistic workflows based on implemented routes and controllers
- Avoid inventing relationships or entities that do not exist

---

## 19. Quick Reference

### 19.1 Key File Locations

| Category | Path |
|---|---|
| Models | `app/Models/` |
| Enums | `app/Enums/` |
| Controllers | `app/Http/Controllers/` |
| Admin Controllers | `app/Http/Controllers/Admin/` |
| Services | `app/Services/` |
| Policies | `app/Policies/` |
| Migrations | `database/migrations/` |
| React Pages | `resources/js/pages/` |
| Components | `resources/js/components/` |
| Layouts | `resources/js/layouts/` |
| Routes | `routes/web.php` |

### 19.2 Critical Enum Values

```
TicketStatus:   open | on_process | closed | reopened
TicketPriority: low  | medium     | high   | critical
UserRole:       user | admin
```

### 19.3 SLA Targets

```
Critical: 4h | High: 24h | Medium: 72h | Low: 168h
```

---

> **End of MASTER_CONTEXT.md**
> This document should be read in full before any AI system generates documentation, diagrams, presentations, or implementation guidance for the Sistem Ticketing IT Support project.
