# AGENTS.md

## Project Source of Truth

This document is the primary operating guide for the implementation of the **IT Support Ticketing System** for **Politeknik Mitra Industri**.

Use this file as the highest-priority working reference for:
- scope control
- implementation direction
- code quality
- architecture decisions
- UI/UX consistency
- testing requirements
- delivery discipline

The system is intended to be built as a production-minded web application with:

- **Backend:** Laravel 13
- **Frontend:** React + Inertia
- **Styling:** Tailwind CSS
- **Motion:** Framer Motion
- **Icons:** Lucide React
- **Primitives:** Radix UI or Headless UI
- **Data fetching / server state:** TanStack Query
- **Form handling:** react-hook-form + zod only when genuinely necessary

---

## 1. Role

You are a **Senior Expert Full Stack Developer** responsible for designing and implementing the IT Support Ticketing System as a modular, secure, scalable, and maintainable product.

Your responsibilities include:
- analyzing requirements
- producing a clean system architecture
- designing a logical database schema
- implementing backend and frontend features
- ensuring strict role-based access control
- maintaining high code quality
- enforcing consistent UI/UX behavior
- preparing the system for production use
- documenting the implementation in a way that is useful for future development

---

## 2. Working Objective

Build an IT Support Ticketing System that allows employees to:
- authenticate securely
- submit support tickets
- track ticket progress
- view personal ticket history
- receive status updates
- communicate through notes/comments where needed

Allow IT administrators to:
- view all tickets
- prioritize work
- assign tickets
- update status
- add solution notes
- manage and audit operational activity
- generate reports and exports

The application must feel like a real internal enterprise system:
- functional
- stable
- efficient
- clean
- professional
- easy to use daily

---

## 3. Product Context

The application is an internal ticketing platform for an institutional or company environment where users report issues such as:
- device problems
- printer failures
- account access issues
- network issues
- application errors
- password problems
- general IT requests

The system must solve the common operational failures of manual ticket handling:
- lost requests
- unclear priorities
- no traceable progress
- no repair history
- poor visibility for users
- limited reporting for IT staff

The design and implementation must support a clear service workflow from request submission to resolution.

---

## 4. Core Roles

### 4.1 User / Employee
Users can:
- register and log in
- create support tickets
- attach evidence files
- view their own tickets
- monitor ticket status
- reopen resolved tickets where appropriate
- receive notifications
- update their profile

### 4.2 IT Support / Admin
Admins can:
- view all tickets
- filter and search tickets
- assign tickets to support staff
- set or update status
- add notes and solution summaries
- delete or archive tickets if required
- monitor operational metrics
- manage user access where permitted
- review audit trails and activity history

### 4.3 System / Audit Layer
The system must:
- record important actions
- preserve a history of status changes
- store solution notes
- capture timestamps and responsible actors
- support reporting and operational review

---

## 5. Functional Scope

### 5.1 Authentication
Required:
- register
- login
- logout
- password reset
- session security
- role-aware redirect after login

### 5.2 Ticket Lifecycle
Each ticket should support:
- creation
- listing
- detail view
- status change
- assignment
- note/comment updates
- attachment upload
- closure
- optional reopen

Suggested ticket statuses:
- `open`
- `on_process`
- `closed`
- `reopened` if the workflow requires it

### 5.3 Ticket Metadata
At minimum, each ticket should support:
- ticket number
- title
- category
- priority
- description
- requester
- status
- assigned technician
- notes/solution
- created at
- updated at
- closed at if applicable

### 5.4 Communication & Notifications
The system should support:
- internal comments or notes
- status update notifications
- resolution notifications
- in-app alerts
- optional email notifications if configured

### 5.5 Dashboard
The dashboard must show:
- total tickets
- open tickets
- in-process tickets
- closed tickets
- urgent/high-priority tickets
- recent activity
- quick actions

### 5.6 Search, Filter, and Sort
Users and admins should be able to:
- search by ticket number, title, or keyword
- filter by status
- filter by priority
- filter by date range
- sort by newest, oldest, urgent, or unresolved

### 5.7 Audit and History
The system must retain:
- ticket creation history
- status transition history
- note history
- assignment changes
- profile changes
- login-related activity where appropriate

---

## 6. Technical Stack

### 6.1 Backend

- **Laravel 13**  
  Acts as the core application framework responsible for handling routing, request lifecycle, business logic orchestration, and system architecture. Laravel provides a structured foundation for building a scalable, maintainable, and production-ready application. It enables rapid development through expressive syntax while maintaining strict architectural discipline through controllers, middleware, services, and modular separation.

- **PHP 8.3 or later**  
  Serves as the primary server-side language. Modern PHP versions provide improved performance, type safety, and language features such as enums, readonly properties, and enhanced error handling. These features are critical for building reliable domain logic and reducing runtime ambiguity in a large-scale academic or ticketing system.

- **Eloquent ORM**  
  Used for database interaction through an object-relational mapping approach. Eloquent enables expressive querying, relationship management, and model-based data manipulation. It simplifies complex joins, enforces relationships (one-to-many, many-to-many), and supports eager loading to prevent N+1 query issues. It also integrates seamlessly with Laravel’s factories, scopes, and casting system.

- **Form Request Validation**  
  Centralizes validation logic into dedicated request classes, ensuring all incoming data is validated at the backend level before reaching business logic. This guarantees data integrity, enforces consistent validation rules, and improves code readability by removing validation logic from controllers.

- **Policies and Gates**  
  Provide a structured authorization layer for enforcing role-based and resource-based access control. Policies define permissions at the model level (e.g., who can update a ticket), while Gates handle broader access rules. This ensures that sensitive operations such as ticket management, data access, and administrative actions are strictly controlled.

- **Notifications**  
  Used for delivering system updates to users through multiple channels such as database notifications or email. In a ticketing system, notifications are essential for informing users about ticket status changes, assignments, comments, and resolutions, ensuring transparency and responsiveness.

- **Jobs / Queues**  
  Handle asynchronous and time-consuming tasks such as sending notifications, processing file uploads, generating reports, or exporting data. This prevents blocking the main request lifecycle and ensures the application remains responsive under load.

- **Events / Listeners (where needed)**  
  Enable decoupled system behavior by triggering actions in response to specific events (e.g., ticket created, status updated). This improves modularity and allows features like logging, notifications, and integrations to be handled independently without tightly coupling logic.

---

### 6.2 Frontend

- **React**  
  Serves as the primary UI layer responsible for building interactive, component-based user interfaces. React enables modular design, reusable components, and efficient rendering through a virtual DOM, making it ideal for complex dashboards and data-driven interfaces.

- **Inertia**  
  Acts as the bridge between Laravel and React, allowing the application to behave like a modern single-page application without requiring a separate API layer. It enables server-driven navigation while preserving client-side interactivity, reducing complexity and maintaining a cohesive full-stack workflow.

- **Tailwind CSS**  
  Provides a utility-first styling system that enforces consistency and rapid UI development. Tailwind enables the implementation of a design system through reusable tokens (spacing, colors, typography) and ensures that styling remains predictable, scalable, and aligned with the defined design direction.

- **Framer Motion**  
  Used for subtle and purposeful animations such as transitions, modal appearances, and micro-interactions. It enhances user experience by providing visual feedback and improving perceived performance, while remaining restrained to avoid unnecessary visual noise.

- **Lucide React**  
  Supplies a consistent and lightweight icon system. Icons are used to support visual communication (status indicators, actions, navigation cues) without overwhelming the interface. Consistency in icon usage improves usability and recognition.

- **Radix UI or Headless UI**  
  Provide accessible, unstyled component primitives such as dialogs, dropdowns, tabs, and popovers. These libraries ensure that complex interactive components meet accessibility standards while allowing full control over styling and behavior.

- **TanStack Query**  
  Handles client-side data fetching, caching, and synchronization when needed. It is particularly useful for managing server state, reducing redundant requests, and improving performance in dynamic interfaces such as filtering, searching, and real-time updates.

- **react-hook-form + zod (only when needed)**  
  Used for managing complex forms with structured validation. `react-hook-form` provides efficient form state handling, while `zod` ensures schema-based validation. These tools should only be used when form complexity justifies their overhead, such as multi-step forms or advanced validation rules.

---

### 6.3 Data Layer

- **MySQL or MariaDB as primary relational database**  
  Serves as the main data storage system, handling structured data such as users, tickets, roles, logs, and system configurations. Relational integrity is enforced through foreign keys, indexing, and normalization to ensure consistency, performance, and scalability.

- **Redis (optional for cache and queue)**  
  Used as an in-memory data store for caching frequently accessed data and managing queue workers. Redis significantly improves performance by reducing database load and enabling fast background job processing.

- **Local file storage or S3-compatible storage for attachments**  
  Handles file uploads such as ticket attachments, documents, and media. Local storage is suitable for development environments, while S3-compatible storage is recommended for production due to scalability, reliability, and distributed access.

---

### 6.4 Build and Tooling

- **Vite**  
  Acts as the frontend build tool and development server. It provides fast hot module replacement (HMR), optimized bundling, and efficient asset compilation, ensuring a smooth development experience and performant production builds.

- **Node.js**  
  Required for running the frontend build system, dependency management, and asset compilation. It enables modern JavaScript tooling and integration with Vite.

- **npm or pnpm as the package manager**  
  Used for managing frontend dependencies. `pnpm` is recommended for better performance and disk efficiency, while `npm` remains a stable and widely supported option.

- **Laravel native environment without dependency on XAMPP or Laragon**  
  The system must be configured using a modular and production-like environment. Each component (PHP runtime, database, Node.js, queue worker) runs independently, ensuring consistency between local development, staging, and production environments. This approach improves reliability, scalability, and deployment readiness.

### ## 6.5 Do’s and Don’ts

### Do

- Do fully understand system requirements based on each role before writing any code, ensuring that every module aligns with the workflows of students, lecturers, and administrators.
- Do prioritize clear domain structure; separate academic, services, financial, master data, notification, and audit log domains with strict responsibility boundaries.
- Do use consistent naming conventions across models, controllers, requests, services, policies, routes, events, jobs, and React components to ensure readability and maintainability.
- Do place business logic within the service/action layer, not in controllers, so controllers remain thin, focused, and testable.
- Do use Form Request for all sensitive and complex input validation, including relational validation, formatting, authorization, and business rule enforcement.
- Do enforce strict authorization using Policy and Gate for every action involving academic data, financial data, profiles, grades, and critical documents.
- Do ensure that every important data modification generates a clear audit log, including who made the change, when, what was changed, and from which interface.
- Do design database schemas that are normalized, indexed, and enforce foreign key constraints to maintain long-term data integrity.
- Do use migrations, seeders, factories, and tests consistently to maintain alignment across development, staging, and production environments.
- Do use Inertia properly as a server-driven page bridge, not as a replacement for structured application architecture.
- Do use React in a modular way with reusable components, clean props, and minimal local state to keep the UI performant and maintainable.
- Do use Tailwind CSS with a consistent design token system, not arbitrary utility usage that ignores the design system.
- Do use Framer Motion selectively and purposefully for micro-interactions, smooth transitions, and meaningful visual feedback.
- Do use Lucide React or similar icon libraries consistently with uniform size, stroke, and style across the application.
- Do use Radix UI or Headless UI for accessibility-critical components such as dialogs, dropdowns, popovers, tabs, and contextual menus.
- Do use TanStack Query only when it provides real value for client-side caching, synchronization, or complex query state handling.
- Do use `react-hook-form` and `zod` only when form validation complexity justifies schema-based validation and structured form management.
- Do ensure every page has clearly defined empty states, loading states, success states, and error states.
- Do design UI that is calm, editorial, premium, and authoritative in alignment with DESIGN.md, avoiding generic admin-style interfaces.
- Do use whitespace, tonal layering, and visual hierarchy to structure information instead of relying on hard borders or excessive separators.
- Do use the `stitch_student_dashboard` folder as a reference for mobile visual rhythm and layout composition, while prioritizing DESIGN.md as the primary design authority.
- Do maintain performance using eager loading, pagination, appropriate caching, lazy loading for heavy components, and queue systems for heavy operations.
- Do secure file upload and download processes with file type validation, size limits, access control, and secure storage handling.
- Do implement feature testing for critical flows such as authentication, authorization, dashboard operations, data input, approval workflows, and sensitive data handling.
- Do document key architectural decisions to ensure long-term maintainability and knowledge transfer.
- Do use clear and structured commit messages when working with version control systems.
- Do ensure that every major implementation decision aligns with real operational needs, not just visual appeal.

### Don’t

- Don't place critical business logic directly inside controllers, React pages, or unstructured helper functions.
- Don't mix academic, financial, service, and user management domains within a single file or layer without proper separation of concerns.
- Don't use inconsistent, overly abbreviated, or unclear naming for files, folders, functions, or variables.
- Don't build features based solely on visual assumptions; always validate against actual user workflows and system requirements.
- Don't skip backend validation just because frontend validation exists.
- Don't rely on client-side validation as the only layer of protection for sensitive data.
- Don't write inefficient queries without eager loading or pagination when handling large datasets.
- Don't allow database relationships to be loose, duplicated, or missing proper constraints.
- Don't use undocumented or inconsistent status enums or string values across modules.
- Don't introduce a full REST API architecture if the system is designed as an Inertia monolith, unless there is a clear and justified need.
- Don't create oversized React components with too many responsibilities that reduce reusability.
- Don't overuse global state management without clear necessity.
- Don't use excessive animations, long transitions, or decorative effects that distract from usability.
- Don't use gradients, neon colors, glassmorphism, or any visual style that contradicts the defined design direction.
- Don't create overly symmetrical, boxed, or generic layouts resembling common admin templates.
- Don't ignore accessibility standards such as contrast, labeling, focus visibility, and keyboard navigation.
- Don't hide critical errors without providing actionable feedback to users.
- Don't permanently delete critical data without considering soft deletes, audit trails, or recovery mechanisms.
- Don't store uploaded files without validation, size control, or proper access restrictions.
- Don't expose personal, academic, financial, or internal data without proper authorization and contextual control.
- Don't ignore role-based access control; every sensitive route, action, and resource must be protected with proper policies.
- Don't delay testing until the end; critical features must be tested alongside implementation.
- Don't allow README, documentation, or agents.md to appear generic, shallow, or disconnected from a real production system.
- Don't make architectural decisions that hinder scalability, testing, or long-term maintainability.
- Don't sacrifice system stability for visual aesthetics; the system must remain reliable, secure, and maintainable.
- Don't use emoji, instead use Lucide React for Icons or anything for the interactive website.
---

## 7. Non-Negotiable Principles

### 7.1 Clean Architecture
Keep the codebase modular and easy to reason about.

Preferred flow:
- Controller
- Service / Action
- Model
- Resource / DTO if needed

Avoid business logic in controllers.

### 7.2 Role-Based Security
Apply strict access control:
- users can only access their own tickets and profile-related data
- admins can access operational areas
- sensitive actions must use policies or gates

### 7.3 Validation First
All sensitive or business-critical inputs must be validated on the backend.

### 7.4 Production Mindset
Every decision should support:
- maintainability
- stability
- auditability
- reuse
- clean user experience
- predictable behavior

### 7.5 Minimal Complexity
Do not introduce heavy abstractions unless there is a concrete benefit.

---

## 8. UI/UX Direction

The interface must be:
- professional
- calm
- efficient
- readable
- responsive
- clean
- not decorative for its own sake

### 8.1 Design Philosophy
Use a blue-led institutional palette with a clean, flat, and disciplined composition.

Do not use:
- gradients
- glassmorphism
- neumorphism
- neon effects
- excessive shadow
- noisy decoration
- template-like generic dashboard styling

### 8.2 Visual Hierarchy
Use:
- strong headings
- clear card structures
- clean spacing
- subtle borders
- restrained shadows
- status badges
- readable tables

### 8.3 Interaction Quality
Use motion only when it improves comprehension:
- modal transitions
- button state feedback
- toast appearance
- subtle page interactions

Keep transitions short and functional.

---

## 9. Recommended Information Architecture

### 9.1 User Area
- Dashboard
- Create Ticket
- My Tickets
- Ticket Detail
- Notifications
- Profile
- Help / FAQ

### 9.2 Admin Area
- Dashboard
- All Tickets
- Ticket Detail / Management
- Assignment and status control
- Reports
- User management if required
- Audit log
- Settings

### 9.3 Shared Area
- Authentication
- Profile
- Notification center
- Helpdesk
- Activity history

---

## 10. Database Design Strategy

### 10.1 Main Entities
Minimum recommended entities:
- users
- roles
- tickets
- ticket_categories
- ticket_priorities
- ticket_statuses
- ticket_comments
- ticket_attachments
- ticket_assignments
- notifications
- activity_logs
- profiles if separated from users
- password_resets or equivalent auth tables depending on implementation

### 10.2 Relationship Principles
- one user can create many tickets
- one ticket belongs to one user
- one ticket may have many comments
- one ticket may have many attachments
- one ticket may have many activity log entries
- one ticket may be assigned to one or more support actors over time depending on workflow design

### 10.3 Database Rules
- use foreign keys
- index searchable fields
- keep audit data separate from transactional data where appropriate
- use soft deletes only when recovery is meaningful
- enforce uniqueness on user identifiers and ticket numbers
- keep timestamps consistent

---

## 11. Recommended Laravel Folder Structure

Use a structure that remains clean as the system grows.

```bash
app/
├─ Actions/
│  ├─ Auth/
│  ├─ Tickets/
│  ├─ Notifications/
│  └─ Users/
├─ Enums/
│  ├─ TicketStatus.php
│  ├─ TicketPriority.php
│  └─ UserRole.php
├─ Events/
├─ Exceptions/
├─ Http/
│  ├─ Controllers/
│  │  ├─ Auth/
│  │  ├─ DashboardController.php
│  │  ├─ TicketController.php
│  │  ├─ Admin/
│  │  └─ ProfileController.php
│  ├─ Middleware/
│  └─ Requests/
│     ├─ Auth/
│     ├─ Tickets/
│     ├─ Admin/
│     └─ Profile/
├─ Jobs/
├─ Listeners/
├─ Models/
├─ Notifications/
├─ Policies/
├─ Providers/
├─ Services/
│  ├─ TicketService.php
│  ├─ DashboardService.php
│  ├─ NotificationService.php
│  └─ AuditService.php
└─ Support/
   ├─ Constants/
   ├─ Helpers/
   └─ Types/
```

Frontend:
```bash
resources/js/
├─ components/
│  ├─ ui/
│  ├─ shared/
│  ├─ layout/
│  └─ forms/
├─ hooks/
├─ layouts/
├─ lib/
├─ pages/
│  ├─ Auth/
│  ├─ Dashboard/
│  ├─ Tickets/
│  ├─ Admin/
│  ├─ Profile/
│  └─ Settings/
├─ types/
└─ utils/
```

Routes:
```bash
routes/
├─ web.php
├─ auth.php
├─ admin.php
└─ tickets.php
```

---

## 12. Coding Standards

### 12.1 Backend Standards
- use explicit method names
- keep controllers thin
- isolate business logic in Actions or Services
- validate via Form Requests
- authorize via Policies or Gates
- use enums for fixed statuses and priorities
- return consistent Inertia responses

### 12.2 Frontend Standards
- use reusable components
- split page components and UI primitives
- keep page files thin
- use server props from Inertia as the source of truth
- use TanStack Query only where it adds measurable benefit
- avoid unnecessary global state

### 12.3 Naming Conventions
- Controllers: `SomethingController`
- Requests: `StoreTicketRequest`, `UpdateProfileRequest`
- Services: `TicketService`
- Actions: `CreateTicketAction`
- Components: `TicketStatusBadge`
- Pages: `Index.tsx`, `Show.tsx`, `Create.tsx`, `Edit.tsx`

### 12.4 Commit Discipline
Every change should be:
- scoped
- readable
- reversible
- testable

---

## 13. Frontend Quality Rules

### 13.1 Inertia Usage
Use Inertia for:
- page navigation
- server-driven props
- form submissions
- flash messages
- validation errors

### 13.2 Motion
Use Framer Motion only for:
- page transitions
- modal animations
- dropdown transitions
- toast transitions
- subtle UI feedback

### 13.3 Primitives
Use Radix UI or Headless UI for:
- dialogs
- dropdowns
- tabs
- popovers
- menus
- accessible structural primitives

### 13.4 Data Fetching
Use TanStack Query only when:
- data is refreshed independently from route navigation
- polling is required
- background synchronization is useful
- server state needs caching or deduplication

Do not introduce it for trivial use cases.

### 13.5 Forms
Use react-hook-form + zod only when:
- forms are complex
- validation rules are non-trivial
- dynamic controls are needed
- type-safe validation materially improves maintainability

---

## 14. Implementation Flow

Use the following order:

1. define domain model and roles
2. design database schema
3. build authentication
4. create base layouts
5. build ticket creation and listing
6. build ticket detail and workflow updates
7. add comments and attachments
8. implement dashboard metrics
9. add notifications and activity logs
10. implement admin tools
11. add search, filter, sort, and export
12. write tests
13. review UI consistency
14. finalize documentation

---

## 15. Ticket Workflow Rules

A ticket should follow a clear lifecycle:

### 15.1 User submits ticket
Ticket enters system as `open`.

### 15.2 Admin reviews ticket
Ticket is categorized, prioritized, and optionally assigned.

### 15.3 IT support processes ticket
Status becomes `on_process`.

### 15.4 Resolution is recorded
Admin adds solution notes.

### 15.5 Ticket is closed
Status becomes `closed`.

### 15.6 Optional reopen
If the issue is unresolved, ticket may be reopened under controlled rules.

Each status transition must be logged.

---

## 16. Security Rules

- protect all forms with CSRF
- hash passwords securely
- throttle login attempts
- validate all uploads
- verify file types and sizes
- authorize every sensitive action
- avoid exposing private ticket data to unauthorized users
- record important actions in audit logs
- sanitize output where necessary
- never trust client-side validation alone

---

## 17. Performance Rules

- paginate large datasets
- eager load relationships to prevent N+1 issues
- cache stable reference data if helpful
- queue heavy tasks such as notifications and exports
- avoid loading unnecessary fields
- use efficient queries for filters and search
- keep frontend bundles lean
- lazy load heavy components when appropriate

---

## 18. Testing Requirements

At minimum, cover:
- login and logout
- ticket creation
- ticket listing
- ticket detail access
- ticket update
- status transitions
- authorization rules
- comments and attachments
- dashboard counts
- validation failures
- forbidden access cases
- notification trigger paths

Prefer:
- feature tests for core flows
- unit tests for business logic
- policy tests for authorization
- request validation tests for critical inputs

---

## 19. Documentation Requirements

Maintain documentation for:
- setup instructions
- environment variables
- database schema overview
- deployment considerations
- role permissions
- ticket workflow
- component catalog
- future extension notes

Keep documentation concise, precise, and aligned with the actual codebase.

---

## 20. README.md Requirements

The repository must include a professional `README.md` that presents the project clearly.

The README should contain:
- project title
- project description
- technology stack
- installation steps
- run instructions
- folder structure
- feature overview
- screenshots or preview section if available
- usage notes

The README must feel like a production-grade presentation document, not a generic boilerplate file.

---

## 21. Output Discipline

When generating code or recommendations:
- be concrete
- be specific
- avoid vague placeholders
- avoid overengineering
- keep the implementation realistic
- match the project scope
- preserve consistency across all modules

If the instruction is ambiguous, choose the simplest correct implementation that preserves maintainability.

---

## 22. Definition of Done

The implementation is complete only when:
- authentication works
- users can create and view their tickets
- admins can process all tickets
- status tracking works correctly
- comments and notes are recorded
- attachments are handled safely
- dashboard metrics are accurate
- role access is enforced
- audit history exists
- UI is responsive and consistent
- tests cover critical paths
- documentation is present

---

## 23. Final Delivery Standard

The final result must look and behave like a real internal enterprise product:
- stable
- readable
- maintainable
- secure
- efficient
- polished
- professional

Do not aim for a demo-only output. Aim for a system that can be used in a real operational environment.
