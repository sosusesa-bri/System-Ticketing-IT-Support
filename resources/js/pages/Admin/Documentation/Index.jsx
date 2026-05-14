import { useState, useMemo } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Head } from '@inertiajs/react';
import AppLayout from '../../../layouts/AppLayout';
import DocumentationContent from './DocumentationContent';
import { 
    Book, 
    Search, 
    ChevronRight, 
    Layers, 
    Activity, 
    Users, 
    Database, 
    Settings,
    ShieldAlert,
    Network,
    GitCommit,
    FileText,
    MessageSquare,
    Cpu,
    LifeBuoy,
    Menu,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

// ERD Diagrams
import ERDCore from './Diagrams/ERDCore';
import ERDNotification from './Diagrams/ERDNotification';

// Flowchart Diagrams
import FlowchartAuth from './Diagrams/FlowchartAuth';
import FlowchartTicket from './Diagrams/FlowchartTicket';
import FlowchartAdmin from './Diagrams/FlowchartAdmin';

// Use Case Diagrams
import UseCaseUser from './Diagrams/UseCaseUser';
import UseCaseAdmin from './Diagrams/UseCaseAdmin';

const categories_en = [
    {
        title: 'General Reference',
        items: [
            { id: 'overview', label: 'System Overview', icon: Book },
            { id: 'tech_stack', label: 'Tech Stack & Libraries', icon: Cpu },
            { id: 'roles', label: 'User Roles & Boundaries', icon: Users },
        ]
    },
    {
        title: 'Workflows',
        items: [
            { id: 'auth_flow', label: 'Authentication Flow', icon: ShieldAlert },
            { id: 'ticket_workflow', label: 'Ticket Lifecycle', icon: Activity },
            { id: 'admin_workflow', label: 'Admin Operations', icon: Settings },
            { id: 'user_workflow', label: 'User Operations', icon: Users },
        ]
    },
    {
        title: 'System Features',
        items: [
            { id: 'notifications', label: 'Notification Center', icon: MessageSquare },
            { id: 'dashboard_analytics', label: 'Dashboard & Analytics', icon: Activity },
            { id: 'attachments_multilingual', label: 'Files & Localization', icon: Layers },
            { id: 'audit_security', label: 'Audit Log & Security', icon: ShieldAlert },
        ]
    },
    {
        title: 'Resources',
        items: [
            { id: 'troubleshooting', label: 'Troubleshooting Guide', icon: LifeBuoy },
            { id: 'glossary_faq', label: 'Glossary & FAQ', icon: FileText },
        ]
    },
    {
        title: 'Diagram Center - Flowchart',
        items: [
            { id: 'diagram_flow_auth', label: 'Authentication Flow', icon: GitCommit },
            { id: 'diagram_flow_ticket', label: 'Ticket Lifecycle', icon: GitCommit },
            { id: 'diagram_flow_admin', label: 'Admin Processing', icon: GitCommit },
        ]
    },
    {
        title: 'Diagram Center - Use case',
        items: [
            { id: 'diagram_uc_user', label: 'User Actor', icon: Network },
            { id: 'diagram_uc_admin', label: 'Admin Actor', icon: Network },
        ]
    },
    {
        title: 'Diagram Center - ERD',
        items: [
            { id: 'diagram_erd_core', label: 'Core System', icon: Database },
            { id: 'diagram_erd_notification', label: 'Notification System', icon: Database },
        ]
    }
];

const categories_id = [
    {
        title: 'Referensi Umum',
        items: [
            { id: 'overview', label: 'Ikhtisar Sistem', icon: Book },
            { id: 'tech_stack', label: 'Teknologi & Pustaka', icon: Cpu },
            { id: 'roles', label: 'Peran & Batasan Pengguna', icon: Users },
        ]
    },
    {
        title: 'Alur Kerja',
        items: [
            { id: 'auth_flow', label: 'Alur Autentikasi', icon: ShieldAlert },
            { id: 'ticket_workflow', label: 'Siklus Tiket', icon: Activity },
            { id: 'admin_workflow', label: 'Operasional Admin', icon: Settings },
            { id: 'user_workflow', label: 'Operasional Pengguna', icon: Users },
        ]
    },
    {
        title: 'Fitur Sistem',
        items: [
            { id: 'notifications', label: 'Pusat Notifikasi', icon: MessageSquare },
            { id: 'dashboard_analytics', label: 'Dasbor & Analitik', icon: Activity },
            { id: 'attachments_multilingual', label: 'Berkas & Pelokalan', icon: Layers },
            { id: 'audit_security', label: 'Log Audit & Keamanan', icon: ShieldAlert },
        ]
    },
    {
        title: 'Sumber Daya',
        items: [
            { id: 'troubleshooting', label: 'Panduan Penyelesaian Masalah', icon: LifeBuoy },
            { id: 'glossary_faq', label: 'Glosarium & FAQ', icon: FileText },
        ]
    },
    {
        title: 'Pusat Diagram - Flowchart',
        items: [
            { id: 'diagram_flow_auth', label: 'Alur Autentikasi', icon: GitCommit },
            { id: 'diagram_flow_ticket', label: 'Siklus Tiket', icon: GitCommit },
            { id: 'diagram_flow_admin', label: 'Pemrosesan Admin', icon: GitCommit },
        ]
    },
    {
        title: 'Pusat Diagram - Use Case',
        items: [
            { id: 'diagram_uc_user', label: 'Aktor Pengguna', icon: Network },
            { id: 'diagram_uc_admin', label: 'Aktor Admin', icon: Network },
        ]
    },
    {
        title: 'Pusat Diagram - ERD',
        items: [
            { id: 'diagram_erd_core', label: 'Sistem Inti', icon: Database },
            { id: 'diagram_erd_notification', label: 'Sistem Notifikasi', icon: Database },
        ]
    }
];

export default function Index() {
    const { language } = useLanguage();
    const categories = language === 'id' ? categories_id : categories_en;

    const [activeSection, setActiveSection] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const filteredCategories = useMemo(() => {
        if (!searchQuery) return categories;
        
        return categories.map(category => ({
            ...category,
            items: category.items.filter(item => 
                item.label.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(category => category.items.length > 0);
    }, [searchQuery, categories]);

    const renderContent = () => {
        if (activeSection.startsWith('diagram_')) {
            let DiagramComponent = null;
            switch(activeSection) {
                case 'diagram_erd_core': DiagramComponent = <ERDCore />; break;
                case 'diagram_erd_notification': DiagramComponent = <ERDNotification />; break;
                case 'diagram_flow_auth': DiagramComponent = <FlowchartAuth />; break;
                case 'diagram_flow_ticket': DiagramComponent = <FlowchartTicket />; break;
                case 'diagram_flow_admin': DiagramComponent = <FlowchartAdmin />; break;
                case 'diagram_uc_user': DiagramComponent = <UseCaseUser />; break;
                case 'diagram_uc_admin': DiagramComponent = <UseCaseAdmin />; break;
                default: DiagramComponent = <div className="p-8 text-neutral-500">{language === 'id' ? 'Komponen diagram tidak ditemukan.' : 'Diagram component not found.'}</div>;
            }
            return <div className="h-full w-full force-light">{DiagramComponent}</div>;
        }
        return <DocumentationContent sectionId={activeSection} language={language} />;
    };

    return (
        <AppLayout title={language === 'id' ? 'Dokumentasi & Panduan Sistem' : 'Documentation & System Guide'}>
            <Head title={language === 'id' ? 'Dokumentasi - Admin' : 'Documentation - Admin'} />
            
            <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-white relative">
                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-neutral-200 bg-white z-20">
                    <div className="font-medium text-neutral-900 flex items-center gap-2">
                        <Book className="w-5 h-5 text-primary-600" />
                        {language === 'id' ? 'Daftar Isi Dokumentasi' : 'Documentation Menu'}
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2 text-neutral-600 rounded-md hover:bg-neutral-100">
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <div className={cn(
                    "absolute md:relative z-30 w-80 h-full flex-shrink-0 border-r border-neutral-200 bg-white md:bg-neutral-50/30 flex flex-col transition-transform duration-300 ease-in-out",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}>
                    <div className="p-4 border-b border-neutral-200 bg-white">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <input
                                type="text"
                                placeholder={language === 'id' ? 'Cari dokumentasi...' : 'Search documentation...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-neutral-100 border-transparent rounded-md text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category, idx) => (
                                <div key={idx} className="space-y-1">
                                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 px-3">
                                        {category.title}
                                    </h3>
                                    <div className="space-y-0.5">
                                        {category.items.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setActiveSection(item.id);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                                                    activeSection === item.id
                                                        ? "bg-primary-50 text-primary-700 font-medium"
                                                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className={cn(
                                                        "h-4 w-4",
                                                        activeSection === item.id ? "text-primary-600" : "text-neutral-400"
                                                    )} />
                                                    {item.label}
                                                </div>
                                                {activeSection === item.id && (
                                                    <ChevronRight className="h-4 w-4 text-primary-500" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-neutral-500 text-sm">
                                {language === 'id' ? `Tidak ada dokumentasi untuk "${searchQuery}"` : `No documentation found for "${searchQuery}"`}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Backdrop */}
                {isMobileMenuOpen && (
                    <div 
                        className="absolute inset-0 bg-neutral-900/20 z-20 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto relative bg-white">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="h-full w-full"
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </AppLayout>
    );
}
