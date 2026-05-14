import { cn } from '../../../lib/utils';
import { 
    CheckCircle2, 
    Info, 
    AlertTriangle, 
    FileText,
    Users,
    Settings,
    Activity,
    Bell,
    ShieldAlert,
    BarChart,
    MessageSquare,
    BookOpen,
    Cpu,
    GitCommit,
    Database,
    Layers,
    LifeBuoy
} from 'lucide-react';

const docData_en = {
    overview: {
        title: 'System Overview & Purpose',
        icon: BookOpen,
        description: 'The definitive truth about the Sistem Ticketing IT Support application at Politeknik Mitra Industri.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Application Purpose</h3>
                    <p className="text-neutral-700 leading-relaxed mb-4">
                        Sistem Ticketing IT Support is an internal, enterprise-grade institutional web application developed to digitize and centralize the IT complaint handling workflow at Politeknik Mitra Industri.
                        It replaces informal, manual reporting mechanisms (phone calls, text messages, verbal reports) with a structured, auditable, and transparent digital platform.
                    </p>
                    <Alert type="info" title="System Boundaries">
                        This is NOT a public SaaS product, consumer application, marketplace, or social platform. It is strictly an enterprise-grade internal operations tool designed for daily institutional use.
                    </Alert>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Business Problems Solved</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <ProblemCard title="Lost Complaints" desc="Informal reports are often forgotten. Solved by recording every complaint as a ticket with a unique number and timestamps." />
                        <ProblemCard title="No Queue Tracking" desc="Tickets accumulate invisibly. Solved by listing, filtering, and sorting through an admin dashboard." />
                        <ProblemCard title="Prioritization Issues" desc="Critical issues get buried. Solved by a four-tier SLA-based priority system (Low to Critical)." />
                        <ProblemCard title="Lost Repair History" desc="Solutions to past problems are forgotten. Solved by permanently storing solution notes on each ticket." />
                        <ProblemCard title="Lack of Reporting" desc="No data for IT performance. Solved by an Analytics dashboard with trend charts and exportable data." />
                        <ProblemCard title="Manual Handling" desc="Informal communication overhead. Solved by end-to-end digital workflow with real-time status tracking." />
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">System Goals</h3>
                    <ul className="list-disc pl-5 space-y-2 text-neutral-700">
                        <li>Digitize the entire IT complaint lifecycle from submission to resolution</li>
                        <li>Centralize ticket management into a single, accessible platform</li>
                        <li>Provide structured workflows with clear status transitions</li>
                        <li>Enable real-time ticket tracking for users and administrators</li>
                        <li>Deliver operational dashboards with actionable analytics</li>
                        <li>Maintain complete audit trails for accountability</li>
                    </ul>
                </section>
            </div>
        )
    },
    tech_stack: {
        title: 'Tech Stack & Libraries',
        icon: Cpu,
        description: 'Comprehensive documentation of the technologies and libraries supporting the system features.',
        content: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Backend / Core Platform</h3>
                    <div className="grid gap-3">
                        <TechItem name="Laravel 13" desc="The core application framework managing routing, middleware, and the overall request lifecycle." />
                        <TechItem name="PHP 8.3+" desc="Server-side runtime offering modern type safety features used for rigorous backend logic." />
                        <TechItem name="Eloquent ORM" desc="Handles database interactions, entity relationships, query scopes, and attribute casting." />
                        <TechItem name="Form Request Validation" desc="Enforces centralized backend validation for all inputs, ensuring data integrity before processing." />
                        <TechItem name="Policies and Gates" desc="Provides strict role-based and resource-based authorization (e.g., users can only view their own tickets)." />
                        <TechItem name="Laravel Notifications" desc="Engine powering multi-channel notification delivery (in-app, email)." />
                        <TechItem name="Jobs and Queues" desc="Processes asynchronous tasks to prevent blocking the main request lifecycle during heavy operations." />
                        <TechItem name="Events and Listeners" desc="Decouples system behavior, specifically used for triggering audit logging and notifications." />
                        <TechItem name="MySQL / MariaDB" desc="The primary relational database managing structured data with absolute relational integrity." />
                        <TechItem name="Redis" desc="(If configured) Used for high-speed caching and as the queue driver." />
                        <TechItem name="Local / S3 Storage" desc="Manages secure file attachments uploaded to tickets or broadcast notifications." />
                        <TechItem name="Vite & Node.js" desc="Frontend build tool and JS runtime used for compiling assets with HMR support." />
                        <TechItem name="npm / pnpm" desc="Package managers handling Javascript dependencies." />
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Frontend / UI</h3>
                    <div className="grid gap-3">
                        <TechItem name="React" desc="The primary UI rendering library for building interactive, component-based interfaces." />
                        <TechItem name="Inertia.js" desc="Bridges Laravel and React to provide a server-driven SPA experience without requiring a separate REST API." />
                        <TechItem name="Tailwind CSS" desc="Utility-first CSS framework enforcing institutional design tokens, typography, and spacing." />
                        <TechItem name="Framer Motion" desc="Handles subtle, purposeful animations and transitions (e.g., page transitions, modals) without being overly flashy." />
                        <TechItem name="Lucide React" desc="Provides the consistent, professional SVG icon system used exclusively across the app." />
                        <TechItem name="Radix UI / Headless UI" desc="Provides accessible, unstyled component primitives (dialogs, dropdowns) ensuring structural integrity." />
                        <TechItem name="TanStack Query" desc="Handles client-side data fetching and caching for specific highly-dynamic components." />
                        <TechItem name="react-hook-form & zod" desc="Manages complex form state and performs schema-based validation on the client side." />
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Charts & Diagram Visualization</h3>
                    <div className="grid gap-3">
                        <TechItem name="Recharts & Tremor" desc="Visualizes data in the Analytics module (Area, Line, Bar, Pie charts) to reflect operational trends." />
                        <TechItem name="React Flow" desc="Engine rendering interactive, zoomable, and pannable ERD, Flowchart, and Use Case diagrams within this documentation module." />
                        <TechItem name="Dagre / ELK.js" desc="Supporting libraries used alongside React Flow for auto-laying out complex diagram nodes." />
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Supporting Libraries</h3>
                    <div className="grid gap-3">
                        <TechItem name="react-dropzone" desc="Facilitates drag-and-drop file uploads for ticket attachments with type and size validation." />
                        <TechItem name="react-pdf / PDF.js" desc="Allows inline previewing of PDF documents directly within the ticket detail view." />
                        <TechItem name="Tiptap" desc="Rich text editor used by admins for formatting solution notes and broadcast messages." />
                        <TechItem name="cmdk" desc="Command menu providing quick keyboard-accessible navigation." />
                        <TechItem name="TanStack Table" desc="Powers the robust, sortable, and filterable ticket and user lists in the admin area." />
                        <TechItem name="html-to-image & jsPDF" desc="Used within the Diagram Center to export interactive diagrams as static PNGs or PDFs." />
                        <TechItem name="Sonner / Radix Toast" desc="Delivers non-intrusive toast notifications for success/error feedback." />
                    </div>
                </section>
            </div>
        )
    },
    roles: {
        title: 'User Roles & Boundaries',
        icon: Users,
        description: 'The strict access control system defining operational capabilities.',
        content: (
            <div className="space-y-8">
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">U</div>
                        <h3 className="text-lg font-semibold text-neutral-900">User (Employee / Karyawan)</h3>
                    </div>
                    <p className="text-neutral-600 mb-4">The default operational role assigned to all employees submitting complaints.</p>
                    <ul className="space-y-2">
                        <FeatureListItem text="Create and submit tickets with priority, category, and attachments." />
                        <FeatureListItem text="Access a personal dashboard reflecting own ticket statistics." />
                        <FeatureListItem text="View and track the status of owned tickets exclusively." />
                        <FeatureListItem text="Add comments to owned tickets for clarification." />
                        <FeatureListItem text="Reopen tickets if a closed issue persists." />
                        <FeatureListItem text="Rate resolved tickets and provide feedback." />
                        <FeatureListItem text="Manage profile, avatar, language (ID/EN), and notification preferences." />
                    </ul>
                </section>
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold">A</div>
                        <h3 className="text-lg font-semibold text-neutral-900">Admin (IT Support / Administrator)</h3>
                    </div>
                    <p className="text-neutral-600 mb-4">The elevated role granting full visibility and management capabilities over the system.</p>
                    <ul className="space-y-2">
                        <FeatureListItem text="View all tickets submitted by all users globally." />
                        <FeatureListItem text="Update ticket statuses (Open → On Process → Closed) and assign technicians." />
                        <FeatureListItem text="Add official solution notes to document issue resolution." />
                        <FeatureListItem text="Access the Analytics & Reports module and export data." />
                        <FeatureListItem text="Manage all user accounts and alter roles." />
                        <FeatureListItem text="Access the Notification Operations Center to dispatch broadcasts." />
                        <FeatureListItem text="Manage notification templates and automation rules." />
                        <FeatureListItem text="View the comprehensive system Audit Log." />
                        <FeatureListItem text="Manage system settings (ticket categories, macro templates)." />
                    </ul>
                </section>
            </div>
        )
    },
    auth_flow: {
        title: 'Authentication Flow',
        icon: ShieldAlert,
        description: 'Session-based security and entry points.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Registration & Login</h3>
                    <p className="text-neutral-700 mb-4">The system utilizes Laravel's native session-based authentication for maximum security in an internal environment. No JWT or external OAuth is currently implemented.</p>
                    <ul className="space-y-2 mb-4">
                        <FeatureListItem text="Registration: Validated via Form Request. New accounts are assigned the 'User' role by default." />
                        <FeatureListItem text="Login: Verifies credentials and generates a secure session cookie." />
                        <FeatureListItem text="Role-Based Redirect: Users are routed to /dashboard, Admins to /admin/dashboard." />
                    </ul>
                    <Alert type="info" title="Auth UI Layout">
                        Authentication screens utilize a split-screen layout. The left panel features a modern institutional branding design (deep blue background with gradient overlay, prominent typography, and a grid of key features with icons), while the right panel houses the functional forms with an ambient background.
                    </Alert>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Session Lifecycle</h3>
                    <ul className="space-y-2">
                        <FeatureListItem text="Logout immediately invalidates the session and regenerates the CSRF token." />
                        <FeatureListItem text="Password reset utilizes secure, time-limited email tokens." />
                    </ul>
                </section>
            </div>
        )
    },
    ticket_workflow: {
        title: 'Ticket Lifecycle & SLA',
        icon: Activity,
        description: 'The definitive state machine for IT Support tickets.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Lifecycle States</h3>
                    <div className="grid gap-3">
                        <StatusCard status="Open" color="blue" desc="Initial state. Ticket created; pending IT review." />
                        <StatusCard status="On Process" color="amber" desc="Ticket assigned to technician and work is actively being performed." />
                        <StatusCard status="Closed" color="emerald" desc="Issue resolved. Solution notes attached. SLA clock stopped." />
                        <StatusCard status="Reopened" color="rose" desc="User reported issue persists after closure. Returns to processing." />
                    </div>
                    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <h4 className="font-semibold text-sm mb-2">Valid State Transitions</h4>
                        <code className="text-sm text-slate-700 block whitespace-pre">
                            open       → on_process, closed<br/>
                            on_process → closed, open<br/>
                            closed     → reopened, open<br/>
                            reopened   → on_process, closed, open
                        </code>
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Service Level Agreements (SLA)</h3>
                    <p className="text-neutral-600 mb-4">SLAs are determined by the assigned Priority level and stored as a `due_at` timestamp.</p>
                    <div className="overflow-x-auto rounded-lg border border-neutral-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 text-neutral-700">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Priority</th>
                                    <th className="px-4 py-3 font-medium">SLA Target</th>
                                    <th className="px-4 py-3 font-medium">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                <tr>
                                    <td className="px-4 py-3 font-medium text-rose-600">Critical</td>
                                    <td className="px-4 py-3">4 hours</td>
                                    <td className="px-4 py-3 text-neutral-600">System-down, major security incidents</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-amber-600">High</td>
                                    <td className="px-4 py-3">24 hours</td>
                                    <td className="px-4 py-3 text-neutral-600">Major functionality blocked</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-blue-600">Medium</td>
                                    <td className="px-4 py-3">72 hours</td>
                                    <td className="px-4 py-3 text-neutral-600">Moderate impact, workaround exists</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-slate-600">Low</td>
                                    <td className="px-4 py-3">168 hours</td>
                                    <td className="px-4 py-3 text-neutral-600">Minor issues, general requests</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        )
    },
    admin_workflow: {
        title: 'Admin Operations',
        icon: Settings,
        description: 'How IT Support staff process tickets and manage the system.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Ticket Management</h3>
                    <ul className="space-y-2 mb-4">
                        <FeatureListItem text="Global View: Access all tickets via a master list with advanced filtering (Status, Priority, Category)." />
                        <FeatureListItem text="Assignment: Route tickets to specific IT staff members based on workload or specialty." />
                        <FeatureListItem text="Status Updates: Transition tickets to 'On Process' and eventually 'Closed'." />
                        <FeatureListItem text="Solution Documentation: Add formal Solution Notes when closing tickets to build a knowledge base." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">System Settings</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <ProblemCard title="Ticket Categories" desc="Admins control the dropdown list of categories users select from (e.g., Hardware, Network). Categories can be disabled." />
                        <ProblemCard title="Canned Responses" desc="Admins manage 'Macros'—pre-written responses to common issues to accelerate resolution." />
                        <ProblemCard title="User Management" desc="Inspect user details, review their ticket history, and elevate trusted users to Admin status." />
                        <ProblemCard title="Data Export" desc="Export raw ticket data and audit logs to CSV/Excel for external audits." />
                    </div>
                </section>
            </div>
        )
    },
    user_workflow: {
        title: 'User Operations',
        icon: Users,
        description: 'How employees interact with the ticketing system.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Submitting Complaints</h3>
                    <p className="text-neutral-700 mb-4">Users initiate the process by creating a ticket. They must provide a title, detailed description, select an appropriate category, and set a perceived priority.</p>
                    <ul className="space-y-2 mb-4">
                        <FeatureListItem text="File Uploads: Users can attach screenshots or documents to clarify the issue." />
                        <FeatureListItem text="Tracking: The user dashboard lists all their active and historical tickets." />
                        <FeatureListItem text="Communication: Users can post comments on the ticket thread to answer IT questions." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Post-Resolution</h3>
                    <p className="text-neutral-700 mb-4">Once an admin closes the ticket, the user workflow involves verification:</p>
                    <ul className="space-y-2">
                        <FeatureListItem text="Feedback: Users can rate the service (1-5 stars) and leave feedback notes." />
                        <FeatureListItem text="Reopening: If the issue was marked closed but is not actually fixed, the user triggers the Reopen action." />
                    </ul>
                </section>
            </div>
        )
    },
    notifications: {
        title: 'Notification System',
        icon: MessageSquare,
        description: 'The Notification Operations Center and alert mechanisms.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">System Alerts</h3>
                    <p className="text-neutral-700 mb-4">Notifications are highly integrated into the workflow. Users are alerted when their ticket changes status or receives a comment. Admins are alerted upon new ticket creation or assignment.</p>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Notification Operations Center (Admin)</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <ProblemCard title="Broadcasts" desc="Mass communication tool to send rich-text announcements (e.g., 'Server Maintenance') to all users." />
                        <ProblemCard title="Templates" desc="Manage reusable notification text using variables like {{ticket_id}} for consistent messaging." />
                        <ProblemCard title="Automation Rules" desc="Configure event-driven triggers (e.g., SLA breach alerts)." />
                        <ProblemCard title="Delivery Logs" desc="Track success rates, read states, and delivery channels." />
                    </div>
                </section>
            </div>
        )
    },
    dashboard_analytics: {
        title: 'Dashboard & Analytics',
        icon: BarChart,
        description: 'Data visualization and operational command centers.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Dashboards</h3>
                    <ul className="space-y-2 mb-4">
                        <FeatureListItem text="User Dashboard: Focused on the individual. Shows personal ticket counts, recent activity, and quick-create actions." />
                        <FeatureListItem text="Admin Dashboard: The command center. Displays global ticket metrics, highlights urgent/critical SLA tickets, and streams a live activity feed." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Analytics & Reports</h3>
                    <p className="text-neutral-700 mb-4">Powered by Recharts and processed by the ReportService, the Analytics module provides deep insights:</p>
                    <ul className="space-y-2">
                        <FeatureListItem text="Volume Trends: Area charts visualizing ticket influx over daily/weekly/monthly periods." />
                        <FeatureListItem text="Resolution Time: Line charts tracking average time-to-resolve against SLA targets." />
                        <FeatureListItem text="Distributions: Pie/Bar charts mapping tickets by category, priority, and status." />
                        <FeatureListItem text="SLA Compliance: Metric tracking the percentage of tickets resolved within the deadline." />
                    </ul>
                </section>
            </div>
        )
    },
    attachments_multilingual: {
        title: 'Attachments, Profiles & Localization',
        icon: Layers,
        description: 'Secure file handling, profile management enhancements, and bilingual support.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Secure Attachment Handling</h3>
                    <p className="text-neutral-700 mb-4">Files attached to tickets are highly sensitive and are never exposed to public URLs.</p>
                    <ul className="space-y-2 mb-4">
                        <FeatureListItem text="Served securely via /attachments/{id} route requiring active authentication." />
                        <FeatureListItem text="Ownership verification: Only ticket owners and Admins can access the file." />
                        <FeatureListItem text="Inline Previews: PDF.js and Lightbox support for immediate viewing." />
                        <FeatureListItem text="MIME Context: UI displays appropriate icons (Image, Code, Archive, PDF) based on file type." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Profile Cover Photo (LinkedIn-style)</h3>
                    <p className="text-neutral-700 mb-3">Every user profile now features a full-width cover photo banner similar to LinkedIn.</p>
                    <ul className="space-y-2">
                        <FeatureListItem text="Click or hover the cover area in Profile to reveal the upload and remove buttons." />
                        <FeatureListItem text="Accepted formats: JPEG, PNG, GIF, WebP — max size 5MB." />
                        <FeatureListItem text="Cover photo is stored in storage/covers and served via the same secure storage route." />
                        <FeatureListItem text="Admins viewing a user's detail page (Admin → Users → Detail) also see the cover photo." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Phone Number Validation</h3>
                    <ul className="space-y-2">
                        <FeatureListItem text="Phone field accepts numeric digits only (0-9). Letters and symbols are automatically stripped." />
                        <FeatureListItem text="Minimum length: 9 digits. Maximum length: 15 digits." />
                        <FeatureListItem text="Validated both on the frontend (input masking) and backend (regex rule: ^[0-9]{9,15}$)." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Department — Admin-Only Field</h3>
                    <p className="text-neutral-700 mb-3">The Department field is displayed as read-only on the user's own profile page. Only an Admin can change it.</p>
                    <ul className="space-y-2">
                        <FeatureListItem text="Users see their department in a locked display field with an informational note." />
                        <FeatureListItem text="Admins navigate to Admin → Users → Detail → Department tab to change it." />
                        <FeatureListItem text="All department changes are recorded in the Audit Log with old and new values." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Multilingual Profile System</h3>
                    <ul className="space-y-2">
                        <FeatureListItem text="Dual Language: Full support for Bahasa Indonesia (ID) and English (EN)." />
                        <FeatureListItem text="Persistence: Preference is saved to the user profile and applied upon login." />
                        <FeatureListItem text="All new user management pages (Admin → Users → Detail) are fully bilingual." />
                    </ul>
                </section>
            </div>
        )
    },
    audit_security: {
        title: 'Audit Log & Security',
        icon: ShieldAlert,
        description: 'Tracking system actions and maintaining data integrity.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Polymorphic Audit Log</h3>
                    <p className="text-neutral-700 mb-4">The `AuditService` records all critical actions into the `activity_logs` table to guarantee non-repudiation.</p>
                    <ul className="space-y-2 mb-4">
                        <FeatureListItem text="Tracks ticket creation, status transitions, assignments, and solution notes." />
                        <FeatureListItem text="Tracks administrative actions like role alterations and system setting changes." />
                        <FeatureListItem text="Payload includes the actor (User ID), target entity, timestamp, IP, and User Agent context." />
                        <FeatureListItem text="Admins view logs via the dedicated Audit Log viewer." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Data Integrity (Soft Deletes)</h3>
                    <p className="text-neutral-700">To prevent accidental data loss, critical entities like Tickets and Users utilize Laravel Soft Deletes. They are hidden from standard queries but retained structurally for compliance and recovery.</p>
                </section>
            </div>
        )
    },
    troubleshooting: {
        title: 'Troubleshooting Guidance',
        icon: LifeBuoy,
        description: 'Common operational issues and resolution paths.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Common Issues</h3>
                    <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-white">
                            <h4 className="font-bold text-rose-700 mb-1">Issue: File Attachment Fails</h4>
                            <p className="text-sm text-neutral-600"><strong>Cause:</strong> File exceeds 100MB limit or storage directory lacks write permissions.<br/><strong>Fix:</strong> Ensure file size is below 100MB or contact System Admin to verify `storage/app` permissions.</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-white">
                            <h4 className="font-bold text-rose-700 mb-1">Issue: Not Receiving Notifications</h4>
                            <p className="text-sm text-neutral-600"><strong>Cause:</strong> Notification preferences are toggled off in Profile Settings.<br/><strong>Fix:</strong> Navigate to Profile → Preferences and ensure the desired channels are active.</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-white">
                            <h4 className="font-bold text-rose-700 mb-1">Issue: Unable to view a specific ticket</h4>
                            <p className="text-sm text-neutral-600"><strong>Cause:</strong> Strict Policy constraints. Users can only view their own tickets.<br/><strong>Fix:</strong> Verify you are logged in with the account that created the ticket, or request Admin access.</p>
                        </div>
                    </div>
                </section>
            </div>
        )
    },
    glossary_faq: {
        title: 'Glossary & FAQ',
        icon: FileText,
        description: 'Terminology definitions and Frequently Asked Questions.',
        content: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Glossary of Terms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-neutral-50 rounded border">
                            <strong className="block text-primary-700">SLA (Service Level Agreement)</strong>
                            <span className="text-sm text-neutral-600">The maximum targeted time limit to resolve a ticket based on its priority.</span>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded border">
                            <strong className="block text-primary-700">Soft Delete</strong>
                            <span className="text-sm text-neutral-600">Flagging a record as deleted without physically removing it from the database.</span>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded border">
                            <strong className="block text-primary-700">Canned Response / Macro</strong>
                            <span className="text-sm text-neutral-600">A pre-written message used by admins to quickly answer common problems.</span>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded border">
                            <strong className="block text-primary-700">Polymorphic Relationship</strong>
                            <span className="text-sm text-neutral-600">A database structure allowing a model (like Audit Log) to belong to multiple different entities (Ticket, User, etc) on a single association.</span>
                        </div>
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4">
        <div>
                            <h4 className="font-semibold text-neutral-800">Q: Can a User change their own Department?</h4>
                            <p className="text-sm text-neutral-600 mt-1">No. Department is a read-only field on the user's profile. Only an Admin can change it via Admin → Users → Detail → Department tab. This ensures organizational structure integrity.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800">Q: Can a User delete a ticket?</h4>
                            <p className="text-sm text-neutral-600 mt-1">No. To maintain complete audit integrity, tickets cannot be deleted by users. Admins can close or soft-delete them if inappropriate.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800">Q: What happens if a ticket breaches its SLA?</h4>
                            <p className="text-sm text-neutral-600 mt-1">It is flagged visually on the Admin dashboard as overdue, affecting the overall SLA Compliance metric in the Reports module. Automation rules can be set to notify supervisors.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800">Q: Is the system accessible via mobile?</h4>
                            <p className="text-sm text-neutral-600 mt-1">Yes, the entire interface is built responsively using Tailwind CSS, allowing full functionality from mobile browsers.</p>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
};

const docData_id = {
    overview: {
        title: 'Ikhtisar Sistem & Tujuan',
        icon: BookOpen,
        description: 'Panduan definitif tentang aplikasi Sistem Ticketing IT Support di Politeknik Mitra Industri.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Tujuan Aplikasi</h3>
                    <p className="text-neutral-700 leading-relaxed mb-4">
                        Sistem Ticketing IT Support adalah aplikasi web internal tingkat perusahaan yang dikembangkan untuk mendigitalkan dan memusatkan alur kerja penanganan keluhan IT di Politeknik Mitra Industri.
                        Sistem ini menggantikan mekanisme pelaporan manual informal (telepon, pesan teks, laporan lisan) dengan platform digital yang terstruktur, dapat diaudit, dan transparan.
                    </p>
                    <Alert type="info" title="Batasan Sistem">
                        Ini BUKAN produk SaaS publik, aplikasi konsumen, marketplace, atau platform sosial. Ini murni alat operasi internal tingkat perusahaan yang dirancang untuk penggunaan institusional harian.
                    </Alert>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Masalah Bisnis yang Diselesaikan</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <ProblemCard title="Keluhan Hilang" desc="Laporan informal sering terlupakan. Diselesaikan dengan merekam setiap keluhan sebagai tiket dengan nomor dan stempel waktu yang unik." />
                        <ProblemCard title="Tidak Ada Pelacakan Antrean" desc="Tiket menumpuk tanpa terlihat. Diselesaikan melalui daftar, filter, dan pengurutan di dasbor admin." />
                        <ProblemCard title="Masalah Prioritas" desc="Masalah kritis tertutup masalah lain. Diselesaikan dengan sistem prioritas berbasis SLA empat tingkat (Rendah hingga Kritis)." />
                        <ProblemCard title="Riwayat Perbaikan Hilang" desc="Solusi untuk masalah masa lalu dilupakan. Diselesaikan dengan menyimpan catatan solusi secara permanen di setiap tiket." />
                        <ProblemCard title="Kurangnya Pelaporan" desc="Tidak ada data untuk kinerja IT. Diselesaikan melalui Dasbor analitik dengan grafik tren dan data yang dapat diekspor." />
                        <ProblemCard title="Penanganan Manual" desc="Beban komunikasi informal yang tinggi. Diselesaikan dengan alur kerja digital end-to-end dengan pelacakan status waktu nyata." />
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Tujuan Sistem</h3>
                    <ul className="list-disc pl-5 space-y-2 text-neutral-700">
                        <li>Mendigitalkan seluruh siklus keluhan IT dari pengajuan hingga penyelesaian</li>
                        <li>Memusatkan manajemen tiket ke dalam satu platform yang dapat diakses</li>
                        <li>Menyediakan alur kerja terstruktur dengan transisi status yang jelas</li>
                        <li>Mengaktifkan pelacakan tiket waktu nyata untuk pengguna dan administrator</li>
                        <li>Memberikan dasbor operasional dengan analitik yang dapat ditindaklanjuti</li>
                        <li>Menjaga jejak audit lengkap untuk akuntabilitas</li>
                    </ul>
                </section>
            </div>
        )
    },
    tech_stack: {
        title: 'Teknologi & Pustaka',
        icon: Cpu,
        description: 'Dokumentasi komprehensif dari teknologi dan pustaka yang mendukung fitur sistem.',
        content: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Backend / Platform Inti</h3>
                    <div className="grid gap-3">
                        <TechItem name="Laravel 13" desc="Kerangka kerja aplikasi inti yang mengelola perutean, middleware, dan keseluruhan siklus hidup permintaan." />
                        <TechItem name="PHP 8.3+" desc="Runtime sisi server yang menawarkan fitur keamanan tipe modern yang digunakan untuk logika backend yang ketat." />
                        <TechItem name="Eloquent ORM" desc="Menangani interaksi basis data, hubungan entitas, cakupan kueri, dan tipe atribut." />
                        <TechItem name="Form Request Validation" desc="Menerapkan validasi backend terpusat untuk semua masukan, memastikan integritas data sebelum pemrosesan." />
                        <TechItem name="Policies and Gates" desc="Menyediakan otorisasi berbasis peran dan sumber daya yang ketat (mis. pengguna hanya dapat melihat tiket mereka sendiri)." />
                        <TechItem name="Laravel Notifications" desc="Mesin yang menggerakkan pengiriman notifikasi multi-saluran (dalam aplikasi, email)." />
                        <TechItem name="Jobs and Queues" desc="Memproses tugas asinkron untuk mencegah pemblokiran permintaan utama selama operasi berat." />
                        <TechItem name="Events and Listeners" desc="Memisahkan perilaku sistem, khususnya digunakan untuk memicu log audit dan notifikasi." />
                        <TechItem name="MySQL / MariaDB" desc="Basis data relasional utama yang mengelola data terstruktur dengan integritas relasional absolut." />
                        <TechItem name="Redis" desc="(Jika dikonfigurasi) Digunakan untuk caching berkecepatan tinggi dan sebagai penggerak antrean." />
                        <TechItem name="Local / S3 Storage" desc="Mengelola lampiran file aman yang diunggah ke tiket atau notifikasi siaran." />
                        <TechItem name="Vite & Node.js" desc="Alat build frontend dan runtime JS yang digunakan untuk mengkompilasi aset dengan dukungan HMR." />
                        <TechItem name="npm / pnpm" desc="Manajer paket yang menangani dependensi Javascript." />
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Frontend / UI</h3>
                    <div className="grid gap-3">
                        <TechItem name="React" desc="Pustaka rendering antarmuka utama untuk membangun antarmuka interaktif berbasis komponen." />
                        <TechItem name="Inertia.js" desc="Menjembatani Laravel dan React untuk memberikan pengalaman SPA berbasis server tanpa memerlukan API REST terpisah." />
                        <TechItem name="Tailwind CSS" desc="Kerangka kerja CSS yang memprioritaskan utilitas, menerapkan token desain, tipografi, dan spasi institusional." />
                        <TechItem name="Framer Motion" desc="Menangani animasi dan transisi yang halus dan bertujuan (mis. transisi halaman, modal) tanpa terlalu mencolok." />
                        <TechItem name="Lucide React" desc="Menyediakan sistem ikon SVG yang konsisten dan profesional yang digunakan secara eksklusif di seluruh aplikasi." />
                        <TechItem name="Radix UI / Headless UI" desc="Menyediakan primitif komponen tak bergaya yang dapat diakses (dialog, dropdown) yang memastikan integritas struktural." />
                        <TechItem name="TanStack Query" desc="Menangani pengambilan dan penyimpanan data sisi klien untuk komponen yang sangat dinamis." />
                        <TechItem name="react-hook-form & zod" desc="Mengelola keadaan formulir yang kompleks dan melakukan validasi berbasis skema di sisi klien." />
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Visualisasi Bagan & Diagram</h3>
                    <div className="grid gap-3">
                        <TechItem name="Recharts & Tremor" desc="Memvisualisasikan data dalam modul Analitik (Area, Garis, Batang, Pai) untuk mencerminkan tren operasional." />
                        <TechItem name="React Flow" desc="Mesin yang merender ERD, Flowchart, dan Use Case interaktif yang dapat diperbesar dan digeser di dalam modul dokumentasi ini." />
                        <TechItem name="Dagre / ELK.js" desc="Pustaka pendukung yang digunakan bersama React Flow untuk menata letak simpul diagram yang kompleks secara otomatis." />
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Pustaka Pendukung</h3>
                    <div className="grid gap-3">
                        <TechItem name="react-dropzone" desc="Memfasilitasi unggahan file seret dan lepas untuk lampiran tiket dengan validasi jenis dan ukuran." />
                        <TechItem name="react-pdf / PDF.js" desc="Memungkinkan pratinjau dokumen PDF secara langsung dalam tampilan detail tiket." />
                        <TechItem name="Tiptap" desc="Editor teks kaya yang digunakan oleh admin untuk memformat catatan solusi dan pesan siaran." />
                        <TechItem name="cmdk" desc="Menu perintah yang menyediakan navigasi cepat yang dapat diakses keyboard." />
                        <TechItem name="TanStack Table" desc="Menggerakkan daftar tiket dan pengguna yang tangguh, dapat diurutkan, dan difilter di area admin." />
                        <TechItem name="html-to-image & jsPDF" desc="Digunakan di dalam Pusat Diagram untuk mengekspor diagram interaktif sebagai PNG atau PDF statis." />
                        <TechItem name="Sonner / Radix Toast" desc="Memberikan pemberitahuan singkat yang tidak mengganggu untuk umpan balik keberhasilan/kesalahan." />
                    </div>
                </section>
            </div>
        )
    },
    roles: {
        title: 'Peran & Batasan Pengguna',
        icon: Users,
        description: 'Sistem kontrol akses ketat yang menentukan kemampuan operasional.',
        content: (
            <div className="space-y-8">
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">U</div>
                        <h3 className="text-lg font-semibold text-neutral-900">User (Karyawan / Pegawai)</h3>
                    </div>
                    <p className="text-neutral-600 mb-4">Peran operasional default yang diberikan kepada semua karyawan yang mengajukan keluhan.</p>
                    <ul className="space-y-2">
                        <FeatureListItem text="Membuat dan mengirim tiket dengan prioritas, kategori, dan lampiran." />
                        <FeatureListItem text="Mengakses dasbor pribadi yang mencerminkan statistik tiket mereka sendiri." />
                        <FeatureListItem text="Melihat dan melacak status tiket yang mereka miliki secara eksklusif." />
                        <FeatureListItem text="Menambahkan komentar ke tiket yang mereka miliki untuk klarifikasi." />
                        <FeatureListItem text="Membuka kembali tiket jika masalah yang telah ditutup masih berlanjut." />
                        <FeatureListItem text="Menilai tiket yang diselesaikan dan memberikan umpan balik." />
                        <FeatureListItem text="Mengelola profil, avatar, preferensi bahasa (ID/EN), dan notifikasi." />
                    </ul>
                </section>
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold">A</div>
                        <h3 className="text-lg font-semibold text-neutral-900">Admin (IT Support / Administrator)</h3>
                    </div>
                    <p className="text-neutral-600 mb-4">Peran dengan hak lebih tinggi yang memberikan visibilitas penuh dan kemampuan manajemen atas sistem.</p>
                    <ul className="space-y-2">
                        <FeatureListItem text="Melihat semua tiket yang dikirimkan oleh seluruh pengguna secara global." />
                        <FeatureListItem text="Memperbarui status tiket (Buka → Dalam Proses → Tutup) dan menugaskan teknisi." />
                        <FeatureListItem text="Menambahkan catatan solusi resmi untuk mendokumentasikan penyelesaian masalah." />
                        <FeatureListItem text="Mengakses modul Analitik & Laporan dan mengekspor data." />
                        <FeatureListItem text="Mengelola semua akun pengguna dan mengubah peran." />
                        <FeatureListItem text="Mengakses Pusat Operasi Notifikasi untuk mengirim siaran (broadcast)." />
                        <FeatureListItem text="Mengelola templat notifikasi dan aturan otomatisasi." />
                        <FeatureListItem text="Melihat Log Audit sistem yang komprehensif." />
                        <FeatureListItem text="Mengelola pengaturan sistem (kategori tiket, templat makro)." />
                    </ul>
                </section>
            </div>
        )
    },
    auth_flow: {
        title: 'Alur Autentikasi',
        icon: ShieldAlert,
        description: 'Keamanan berbasis sesi dan titik masuk sistem.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Pendaftaran & Masuk</h3>
                    <p className="text-neutral-700 mb-4">Sistem ini menggunakan autentikasi berbasis sesi asli Laravel untuk keamanan maksimum di lingkungan internal. Tidak ada JWT atau OAuth eksternal yang diimplementasikan saat ini.</p>
                    <ul className="space-y-2 mb-4">
                        <FeatureListItem text="Pendaftaran: Divalidasi melalui Form Request. Akun baru diberi peran 'User' secara default." />
                        <FeatureListItem text="Masuk: Memverifikasi kredensial dan menghasilkan cookie sesi yang aman." />
                        <FeatureListItem text="Pengalihan Berbasis Peran: Pengguna diarahkan ke /dashboard, Admin ke /admin/dashboard." />
                    </ul>
                    <Alert type="info" title="Tata Letak UI Autentikasi">
                        Layar autentikasi menggunakan tata letak layar terbagi. Panel kiri menampilkan desain branding institusional modern (latar belakang biru tua dengan overlay gradien, tipografi menonjol, dan grid fitur utama beserta ikon), sedangkan panel kanan menampung formulir fungsional dengan latar belakang ambien.
                    </Alert>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Siklus Hidup Sesi</h3>
                    <ul className="space-y-2">
                        <FeatureListItem text="Keluar segera membatalkan sesi dan meregenerasi token CSRF." />
                        <FeatureListItem text="Pengaturan ulang kata sandi menggunakan token email yang aman dan berbatas waktu." />
                    </ul>
                </section>
            </div>
        )
    },
    ticket_workflow: {
        title: 'Siklus Tiket & SLA',
        icon: Activity,
        description: 'Mesin status definitif untuk tiket IT Support.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Status Siklus Tiket</h3>
                    <div className="grid gap-3">
                        <StatusCard status="Open" color="blue" desc="Status awal. Tiket dibuat; menunggu tinjauan IT." />
                        <StatusCard status="On Process" color="amber" desc="Tiket ditugaskan ke teknisi dan pekerjaan sedang dilakukan secara aktif." />
                        <StatusCard status="Closed" color="emerald" desc="Masalah diselesaikan. Catatan solusi dilampirkan. Jam SLA berhenti." />
                        <StatusCard status="Reopened" color="rose" desc="Pengguna melaporkan masalah berlanjut setelah ditutup. Kembali ke pemrosesan." />
                    </div>
                    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <h4 className="font-semibold text-sm mb-2">Transisi Status Valid</h4>
                        <code className="text-sm text-slate-700 block whitespace-pre">
                            open       → on_process, closed<br/>
                            on_process → closed, open<br/>
                            closed     → reopened, open<br/>
                            reopened   → on_process, closed, open
                        </code>
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Service Level Agreements (SLA)</h3>
                    <p className="text-neutral-600 mb-4">SLA ditentukan oleh tingkat Prioritas yang ditetapkan dan disimpan sebagai timestamp `due_at`.</p>
                    <div className="overflow-x-auto rounded-lg border border-neutral-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 text-neutral-700">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Prioritas</th>
                                    <th className="px-4 py-3 font-medium">Target SLA</th>
                                    <th className="px-4 py-3 font-medium">Deskripsi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                <tr>
                                    <td className="px-4 py-3 font-medium text-rose-600">Critical</td>
                                    <td className="px-4 py-3">4 jam</td>
                                    <td className="px-4 py-3 text-neutral-600">Sistem mati, insiden keamanan besar</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-amber-600">High</td>
                                    <td className="px-4 py-3">24 jam</td>
                                    <td className="px-4 py-3 text-neutral-600">Fungsionalitas utama terblokir</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-blue-600">Medium</td>
                                    <td className="px-4 py-3">72 jam</td>
                                    <td className="px-4 py-3 text-neutral-600">Dampak sedang, ada jalan pintas (workaround)</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-slate-600">Low</td>
                                    <td className="px-4 py-3">168 jam</td>
                                    <td className="px-4 py-3 text-neutral-600">Masalah minor, permintaan umum</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        )
    },
    admin_workflow: {
        title: 'Operasional Admin',
        icon: Settings,
        description: 'Bagaimana staf IT Support memproses tiket dan mengelola sistem.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Manajemen Tiket</h3>
                    <ul className="space-y-2 mb-4">
                        <FeatureListItem text="Tampilan Global: Akses semua tiket melalui daftar master dengan penyaringan lanjutan (Status, Prioritas, Kategori)." />
                        <FeatureListItem text="Penugasan: Merutekan tiket ke anggota staf IT tertentu berdasarkan beban kerja atau keahlian." />
                        <FeatureListItem text="Pembaruan Status: Mengubah transisi tiket ke 'Dalam Proses' dan akhirnya 'Tutup'." />
                        <FeatureListItem text="Dokumentasi Solusi: Menambahkan Catatan Solusi formal saat menutup tiket untuk membangun basis pengetahuan." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Pengaturan Sistem</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <ProblemCard title="Kategori Tiket" desc="Admin mengontrol daftar drop-down kategori yang dapat dipilih pengguna (mis., Hardware, Jaringan). Kategori dapat dinonaktifkan." />
                        <ProblemCard title="Respons Otomatis (Canned)" desc="Admin mengelola 'Makro'—tanggapan yang ditulis sebelumnya untuk masalah umum guna mempercepat penyelesaian." />
                        <ProblemCard title="Manajemen Pengguna" desc="Memeriksa detail pengguna, meninjau riwayat tiket mereka, dan mengangkat pengguna tepercaya ke status Admin." />
                        <ProblemCard title="Ekspor Data" desc="Mengekspor data tiket mentah dan log audit ke CSV/Excel untuk audit eksternal." />
                    </div>
                </section>
            </div>
        )
    },
    user_workflow: {
        title: 'Operasional Pengguna',
        icon: Users,
        description: 'Bagaimana karyawan berinteraksi dengan sistem ticketing.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Mengajukan Keluhan</h3>
                    <p className="text-neutral-700 mb-4">Pengguna memulai proses dengan membuat tiket. Mereka harus memberikan judul, deskripsi rinci, memilih kategori yang sesuai, dan menetapkan prioritas yang dirasakan.</p>
                    <ul className="space-y-2 mb-4">
                        <FeatureListItem text="Unggah Berkas: Pengguna dapat melampirkan tangkapan layar atau dokumen untuk memperjelas masalah." />
                        <FeatureListItem text="Pelacakan: Dasbor pengguna mencantumkan semua tiket mereka yang aktif dan historis." />
                        <FeatureListItem text="Komunikasi: Pengguna dapat memposting komentar di utas tiket untuk menjawab pertanyaan IT." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Pasca-Penyelesaian</h3>
                    <p className="text-neutral-700 mb-4">Setelah admin menutup tiket, alur kerja pengguna melibatkan verifikasi:</p>
                    <ul className="space-y-2">
                        <FeatureListItem text="Umpan Balik: Pengguna dapat menilai layanan (1-5 bintang) dan meninggalkan catatan umpan balik." />
                        <FeatureListItem text="Buka Kembali: Jika masalah ditandai tertutup tetapi sebenarnya tidak diperbaiki, pengguna memicu tindakan Buka Kembali (Reopen)." />
                    </ul>
                </section>
            </div>
        )
    },
    notifications: {
        title: 'Pusat Notifikasi',
        icon: MessageSquare,
        description: 'Pusat Operasi Notifikasi dan mekanisme peringatan.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Peringatan Sistem</h3>
                    <p className="text-neutral-700 mb-4">Notifikasi sangat terintegrasi ke dalam alur kerja. Pengguna diberi tahu saat tiket mereka mengubah status atau menerima komentar. Admin diberi tahu saat pembuatan atau penugasan tiket baru.</p>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Pusat Operasi Notifikasi (Admin)</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <ProblemCard title="Siaran (Broadcast)" desc="Alat komunikasi massal untuk mengirim pengumuman teks kaya (mis., 'Pemeliharaan Server') ke semua pengguna." />
                        <ProblemCard title="Templat" desc="Mengelola teks notifikasi yang dapat digunakan kembali menggunakan variabel seperti {{ticket_id}} untuk pesan yang konsisten." />
                        <ProblemCard title="Aturan Otomatisasi" desc="Konfigurasikan pemicu berbasis peristiwa (mis. peringatan pelanggaran SLA)." />
                        <ProblemCard title="Log Pengiriman" desc="Lacak tingkat keberhasilan, status baca, dan saluran pengiriman." />
                    </div>
                </section>
            </div>
        )
    },
    dashboard_analytics: {
        title: 'Dasbor & Analitik',
        icon: BarChart,
        description: 'Visualisasi data dan pusat komando operasional.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Dasbor</h3>
                    <ul className="space-y-2 mb-4">
                        <FeatureListItem text="Dasbor Pengguna: Difokuskan pada individu. Menampilkan jumlah tiket pribadi, aktivitas terkini, dan tindakan buat cepat." />
                        <FeatureListItem text="Dasbor Admin: Pusat komando. Menampilkan metrik tiket global, menyoroti tiket SLA yang mendesak/kritis, dan mengalirkan umpan aktivitas langsung." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Analitik & Laporan</h3>
                    <p className="text-neutral-700 mb-4">Didukung oleh Recharts dan diproses oleh ReportService, modul Analitik memberikan wawasan mendalam:</p>
                    <ul className="space-y-2">
                        <FeatureListItem text="Tren Volume: Grafik area memvisualisasikan masuknya tiket selama periode harian/mingguan/bulanan." />
                        <FeatureListItem text="Waktu Penyelesaian: Grafik garis melacak rata-rata waktu penyelesaian terhadap target SLA." />
                        <FeatureListItem text="Distribusi: Grafik pai/batang memetakan tiket menurut kategori, prioritas, dan status." />
                        <FeatureListItem text="Kepatuhan SLA: Metrik yang melacak persentase tiket yang diselesaikan dalam tenggat waktu." />
                    </ul>
                </section>
            </div>
        )
    },
    attachments_multilingual: {
        title: 'Lampiran, Profil & Pelokalan',
        icon: Layers,
        description: 'Penanganan file aman, peningkatan manajemen profil, dan dukungan dua bahasa.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Penanganan Lampiran Aman</h3>
                    <p className="text-neutral-700 mb-4">File yang dilampirkan ke tiket sangat sensitif dan tidak pernah diekspos ke URL publik.</p>
                    <ul className="space-y-2 mb-4">
                        <FeatureListItem text="Dilayani secara aman melalui rute /attachments/{id} yang memerlukan autentikasi aktif." />
                        <FeatureListItem text="Verifikasi kepemilikan: Hanya pemilik tiket dan Admin yang dapat mengakses file tersebut." />
                        <FeatureListItem text="Pratinjau Inline: Dukungan PDF.js dan Lightbox untuk tampilan langsung." />
                        <FeatureListItem text="Konteks MIME: UI menampilkan ikon yang sesuai (Gambar, Kode, Arsip, PDF) berdasarkan jenis file." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Foto Sampul Profil (Gaya LinkedIn)</h3>
                    <p className="text-neutral-700 mb-3">Setiap profil pengguna kini menampilkan spanduk foto sampul selebar halaman, serupa dengan LinkedIn.</p>
                    <ul className="space-y-2">
                        <FeatureListItem text="Klik atau arahkan kursor ke area sampul di halaman Profil untuk memunculkan tombol unggah dan hapus." />
                        <FeatureListItem text="Format yang diterima: JPEG, PNG, GIF, WebP — ukuran maksimum 5MB." />
                        <FeatureListItem text="Foto sampul disimpan di storage/covers dan dilayani melalui rute penyimpanan aman yang sama." />
                        <FeatureListItem text="Admin yang melihat halaman detail pengguna (Admin → Pengguna → Detail) juga dapat melihat foto sampul." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Validasi Nomor Telepon</h3>
                    <ul className="space-y-2">
                        <FeatureListItem text="Kolom telepon hanya menerima angka (0-9). Huruf dan simbol otomatis dihapus saat mengetik." />
                        <FeatureListItem text="Panjang minimum: 9 digit. Panjang maksimum: 15 digit." />
                        <FeatureListItem text="Divalidasi di frontend (pemfilteran input) dan backend (aturan regex: ^[0-9]{9,15}$)." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Departemen — Hanya Dapat Diubah oleh Admin</h3>
                    <p className="text-neutral-700 mb-3">Kolom Departemen ditampilkan sebagai hanya-baca di halaman profil pengguna. Hanya Admin yang dapat mengubahnya.</p>
                    <ul className="space-y-2">
                        <FeatureListItem text="Pengguna melihat departemen mereka di kolom terkunci dengan catatan informasi." />
                        <FeatureListItem text="Admin navigasi ke Admin → Pengguna → Detail → tab Departemen untuk mengubahnya." />
                        <FeatureListItem text="Semua perubahan departemen dicatat di Log Audit beserta nilai lama dan baru." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Sistem Profil Multibahasa</h3>
                    <ul className="space-y-2">
                        <FeatureListItem text="Bahasa Ganda: Dukungan penuh untuk Bahasa Indonesia (ID) dan Bahasa Inggris (EN)." />
                        <FeatureListItem text="Persistensi: Preferensi disimpan ke profil pengguna dan diterapkan saat masuk." />
                        <FeatureListItem text="Semua halaman manajemen pengguna baru (Admin → Pengguna → Detail) sepenuhnya bilingual." />
                    </ul>
                </section>
            </div>
        )
    },
    audit_security: {
        title: 'Log Audit & Keamanan',
        icon: ShieldAlert,
        description: 'Melacak tindakan sistem dan menjaga integritas data.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Log Audit Polimorfik</h3>
                    <p className="text-neutral-700 mb-4">Layanan `AuditService` mencatat semua tindakan penting ke dalam tabel `activity_logs` untuk menjamin nirpenyangkalan (non-repudiation).</p>
                    <ul className="space-y-2 mb-4">
                        <FeatureListItem text="Melacak pembuatan tiket, transisi status, penugasan, dan catatan solusi." />
                        <FeatureListItem text="Melacak tindakan administratif seperti perubahan peran dan perubahan pengaturan sistem." />
                        <FeatureListItem text="Payload mencakup aktor (ID Pengguna), entitas target, stempel waktu, IP, dan konteks Agen Pengguna." />
                        <FeatureListItem text="Admin melihat log melalui penampil Log Audit khusus." />
                    </ul>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Integritas Data (Soft Deletes)</h3>
                    <p className="text-neutral-700">Untuk mencegah hilangnya data yang tidak disengaja, entitas penting seperti Tiket dan Pengguna memanfaatkan Laravel Soft Deletes. Mereka disembunyikan dari kueri standar tetapi dipertahankan secara struktural untuk kepatuhan dan pemulihan.</p>
                </section>
            </div>
        )
    },
    troubleshooting: {
        title: 'Panduan Penyelesaian Masalah',
        icon: LifeBuoy,
        description: 'Masalah operasional umum dan jalur resolusinya.',
        content: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Masalah Umum</h3>
                    <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-white">
                            <h4 className="font-bold text-rose-700 mb-1">Masalah: Lampiran File Gagal</h4>
                            <p className="text-sm text-neutral-600"><strong>Penyebab:</strong> File melebihi batas 100MB atau direktori penyimpanan tidak memiliki izin tulis.<br/><strong>Solusi:</strong> Pastikan ukuran file di bawah 100MB atau hubungi Admin Sistem untuk memverifikasi izin `storage/app`.</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-white">
                            <h4 className="font-bold text-rose-700 mb-1">Masalah: Tidak Menerima Notifikasi</h4>
                            <p className="text-sm text-neutral-600"><strong>Penyebab:</strong> Preferensi notifikasi dimatikan di Pengaturan Profil.<br/><strong>Solusi:</strong> Navigasikan ke Profil → Preferensi dan pastikan saluran yang diinginkan aktif.</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-white">
                            <h4 className="font-bold text-rose-700 mb-1">Masalah: Tidak dapat melihat tiket tertentu</h4>
                            <p className="text-sm text-neutral-600"><strong>Penyebab:</strong> Batasan Policy ketat. Pengguna hanya dapat melihat tiket mereka sendiri.<br/><strong>Solusi:</strong> Verifikasi bahwa Anda masuk dengan akun yang membuat tiket tersebut, atau minta akses Admin.</p>
                        </div>
                    </div>
                </section>
            </div>
        )
    },
    glossary_faq: {
        title: 'Glosarium & FAQ',
        icon: FileText,
        description: 'Definisi terminologi dan Pertanyaan yang Sering Diajukan.',
        content: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Glosarium Istilah</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-neutral-50 rounded border">
                            <strong className="block text-primary-700">SLA (Service Level Agreement)</strong>
                            <span className="text-sm text-neutral-600">Batas waktu maksimal yang ditargetkan untuk menyelesaikan tiket berdasarkan prioritasnya.</span>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded border">
                            <strong className="block text-primary-700">Soft Delete</strong>
                            <span className="text-sm text-neutral-600">Menandai rekaman sebagai dihapus tanpa menghapusnya secara fisik dari basis data.</span>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded border">
                            <strong className="block text-primary-700">Respons Canned / Makro</strong>
                            <span className="text-sm text-neutral-600">Pesan pra-tulis yang digunakan oleh admin untuk menjawab masalah umum dengan cepat.</span>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded border">
                            <strong className="block text-primary-700">Hubungan Polimorfik</strong>
                            <span className="text-sm text-neutral-600">Struktur basis data yang memungkinkan satu model (seperti Log Audit) menjadi milik berbagai entitas berbeda (Tiket, Pengguna, dll) pada satu asosiasi tunggal.</span>
                        </div>
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">Pertanyaan yang Sering Diajukan (FAQ)</h3>
                    <div className="space-y-4">
        <div>
                            <h4 className="font-semibold text-neutral-800">T: Bisakah Pengguna mengubah Departemen sendiri?</h4>
                            <p className="text-sm text-neutral-600 mt-1">Tidak. Departemen adalah kolom hanya-baca di profil pengguna. Hanya Admin yang dapat mengubahnya melalui Admin → Pengguna → Detail → tab Departemen. Ini memastikan integritas struktur organisasi.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800">T: Dapatkah Pengguna menghapus tiket?</h4>
                            <p className="text-sm text-neutral-600 mt-1">Tidak. Untuk menjaga integritas audit yang lengkap, tiket tidak dapat dihapus oleh pengguna. Admin dapat menutup atau menghapus secara lunak (soft-delete) jika tidak sesuai.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800">T: Apa yang terjadi jika tiket melanggar SLA-nya?</h4>
                            <p className="text-sm text-neutral-600 mt-1">Tiket ditandai secara visual di dasbor Admin sebagai terlambat, yang memengaruhi metrik Kepatuhan SLA keseluruhan di modul Laporan. Aturan otomatisasi dapat diatur untuk memberi tahu supervisor.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-neutral-800">T: Apakah sistem dapat diakses melalui perangkat seluler?</h4>
                            <p className="text-sm text-neutral-600 mt-1">Ya, seluruh antarmuka dibangun secara responsif menggunakan Tailwind CSS, memungkinkan fungsionalitas penuh dari browser perangkat seluler.</p>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
};

// Helper Components
function FeatureListItem({ text }) {
    return (
        <li className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-neutral-700">{text}</span>
        </li>
    );
}

function TechItem({ name, desc }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
            <span className="font-bold text-primary-700 whitespace-nowrap min-w-[180px]">{name}</span>
            <span className="text-sm text-neutral-600">{desc}</span>
        </div>
    );
}

function ProblemCard({ title, desc }) {
    return (
        <div className="p-4 rounded-lg border border-neutral-200 bg-white shadow-sm">
            <h4 className="font-medium text-neutral-900 mb-1">{title}</h4>
            <p className="text-sm text-neutral-600">{desc}</p>
        </div>
    );
}

function StatusCard({ status, color, desc }) {
    const colorMap = {
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        amber: "bg-amber-50 text-amber-700 border-amber-200",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
        rose: "bg-rose-50 text-rose-700 border-rose-200"
    };
    
    return (
        <div className={cn("p-4 rounded-lg border flex flex-col md:flex-row md:items-center gap-4", colorMap[color])}>
            <div className="font-bold shrink-0 w-32 uppercase tracking-wide text-sm">{status}</div>
            <div className="text-sm opacity-90">{desc}</div>
        </div>
    );
}

function Alert({ type, title, children }) {
    const isInfo = type === 'info';
    return (
        <div className={cn("p-4 rounded-lg flex gap-3", isInfo ? "bg-blue-50 text-blue-800" : "bg-amber-50 text-amber-800")}>
            <div className="shrink-0 mt-0.5">
                {isInfo ? <Info className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            </div>
            <div>
                <h4 className="font-medium mb-1">{title}</h4>
                <div className="text-sm opacity-90">{children}</div>
            </div>
        </div>
    );
}

export default function DocumentationContent({ sectionId, language = 'en' }) {
    const data = language === 'id' ? docData_id[sectionId] : docData_en[sectionId];

    if (!data) {
        return (
            <div className="p-8 text-center text-neutral-500 flex flex-col items-center justify-center h-full">
                <FileText className="h-12 w-12 text-neutral-300 mb-4" />
                <p>{language === 'id' ? 'Bagian ini sedang dibangun atau tidak ditemukan.' : 'This section is currently under construction or not found.'}</p>
            </div>
        );
    }

    const Icon = data.icon || FileText;

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="px-6 py-8 border-b border-neutral-100 bg-neutral-50/50">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary-100 text-primary-700 rounded-lg">
                        <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">{data.title}</h2>
                </div>
                <p className="text-neutral-600 max-w-3xl leading-relaxed">
                    {data.description}
                </p>
            </div>
            
            <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                <div className="max-w-4xl pb-16">
                    {data.content}
                </div>
            </div>
        </div>
    );
}
