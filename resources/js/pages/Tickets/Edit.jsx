import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { 
    ChevronRight, AlertCircle, ExternalLink, UploadCloud, X, 
    File as FileIcon, FileText, Image as ImageIcon, CheckCircle2, 
    Clock, Info, ShieldAlert, Cpu, Globe, Key, FilePlus, ChevronDown, 
    Lightbulb, HelpCircle, Activity, Briefcase, Check
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

export default function TicketEdit({ ticket, categories }) {
    const { t } = useLanguage();
    
    const initialData = {
        title: ticket.title || '',
        category_id: ticket.category_id || '',
        priority: ticket.priority || 'medium',
        description: ticket.description || '',
        dynamic_fields: ticket.dynamic_fields || {}
    };
    
    const { data, setData, post, processing, errors, transform } = useForm({
        _method: 'PUT',
        title: initialData.title,
        category_id: initialData.category_id,
        priority: initialData.priority,
        description: initialData.description,
        dynamic_fields: initialData.dynamic_fields || {},
        attachments: [],
        remove_attachments: [],
        status: ticket.status || 'draft',
    });
    const [removeAttachmentIds, setRemoveAttachmentIds] = useState([]);
    const existingAttachments = (ticket.attachments || []).filter(
        (a) => !removeAttachmentIds.includes(a.id)
    );
    const removeExistingAttachment = (id) => {
        const updated = [...removeAttachmentIds, id];
        setRemoveAttachmentIds(updated);
        setData('remove_attachments', updated);
    };

    const [similarTickets, setSimilarTickets] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [previews, setPreviews] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdTicketId, setCreatedTicketId] = useState(null);
    const [smartSuggestion, setSmartSuggestion] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);

    const fileInputRef = useRef(null);

    // Draft saving
    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.title || data.description) {
                
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [data]);

    // Smart priority & related articles heuristic
    useEffect(() => {
        if (!data.title && !data.description) {
            setSmartSuggestion(null);
            setRelatedArticles([]);
            return;
        }

        const text = (data.title + " " + data.description).toLowerCase();
        let suggPriority = null;
        let suggCategory = null;
        let articles = [];

        if (text.includes("mati total") || text.includes("down") || text.includes("bluescreen") || text.includes("hack") || text.includes("ransomware")) {
            suggPriority = "critical";
        } else if (text.includes("error") || text.includes("crash") || text.includes("gagal login") || text.includes("cannot access")) {
            suggPriority = "high";
        }

        if (text.includes("wifi") || text.includes("internet") || text.includes("jaringan") || text.includes("vpn") || text.includes("network")) {
            suggCategory = "Network";
            articles = [
                { id: 1, title: 'How to troubleshoot VPN connection', type: 'Guide' },
                { id: 2, title: 'Resetting office Wi-Fi password', type: 'FAQ' }
            ];
        } else if (text.includes("password") || text.includes("login") || text.includes("akun") || text.includes("akses")) {
            suggCategory = "Account";
            articles = [
                { id: 3, title: 'Self-service Password Reset Guide', type: 'Tutorial' }
            ];
        } else if (text.includes("printer") || text.includes("laptop") || text.includes("monitor") || text.includes("keyboard") || text.includes("hardware") || text.includes("mouse") || text.includes("pc")) {
            suggCategory = "Hardware";
            articles = [
                { id: 4, title: 'Connecting to Office Network Printer', type: 'Guide' }
            ];
        } else if (text.includes("aplikasi") || text.includes("software") || text.includes("word") || text.includes("excel")) {
            suggCategory = "Software";
        }

        if (suggPriority || suggCategory) {
            setSmartSuggestion({ priority: suggPriority, category: suggCategory });
        } else {
            setSmartSuggestion(null);
        }
        
        setRelatedArticles(articles);

    }, [data.title, data.description]);

    // Check duplicates
    useEffect(() => {
        if (!data.title || data.title.length < 5) {
            setSimilarTickets([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await axios.get('/tickets-search/duplicates', {
                    params: {
                        title: data.title,
                        category_id: data.category_id || null
                    }
                });
                setSimilarTickets(response.data);
            } catch (error) {
                console.error("Failed to check similar tickets", error);
            } finally {
                setIsSearching(false);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [data.title, data.category_id]);

    // Handle File Uploads
    const handleFiles = (files) => {
        const newFiles = Array.from(files);
        // Validation: size up to 100MB
        const validFiles = newFiles.filter(f => {
            if (f.size > 100 * 1024 * 1024) {
                alert(t('tc_maxFiles'));
                return false;
            }
            return true;
        });

        const updatedAttachments = [...data.attachments, ...validFiles];
        setData('attachments', updatedAttachments);

        // Create previews
        const newPreviews = validFiles.map(file => {
            const isImage = file.type.startsWith('image/');
            return {
                file,
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                type: file.type,
                url: isImage ? URL.createObjectURL(file) : null
            };
        });
        
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeFile = (index) => {
        const newAttachments = [...data.attachments];
        newAttachments.splice(index, 1);
        setData('attachments', newAttachments);

        const newPreviews = [...previews];
        if (newPreviews[index].url) {
            URL.revokeObjectURL(newPreviews[index].url);
        }
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, [data.attachments, previews]);

    const handleSubmit = (e) => {
        e.preventDefault();
        transform((currentData) => ({
            ...currentData,
            status: 'open' // ensure normal submit sets status back to open
        }));
        post(`/tickets/${ticket.id}`, {
            forceFormData: true,
            onSuccess: (page) => {
                
                setCreatedTicketId(page.props.flash?.success_id || 'TCK-NEW');
                setShowSuccess(true);
            }
        });
    };

    // Derived SLA
    const getSLAPreview = () => {
        if (data.priority === 'critical') return { response: t('tc_sla_critical_resp'), resolution: t('tc_sla_critical_res'), color: 'text-danger-700', bg: 'bg-danger-50', border: 'border-danger-200' };
        if (data.priority === 'high') return { response: t('tc_sla_high_resp'), resolution: t('tc_sla_high_res'), color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
        if (data.priority === 'medium') return { response: t('tc_sla_medium_resp'), resolution: t('tc_sla_medium_res'), color: 'text-primary-700', bg: 'bg-primary-50', border: 'border-primary-200' };
        return { response: t('tc_sla_low_resp'), resolution: t('tc_sla_low_res'), color: 'text-neutral-700', bg: 'bg-neutral-50', border: 'border-neutral-200' };
    };

    const sla = getSLAPreview();

    // Get selected category name
    const selectedCategoryName = categories.find(c => c.id == data.category_id)?.name || '';
    const isHardware = selectedCategoryName.toLowerCase().includes('hardware') || selectedCategoryName.toLowerCase().includes('perangkat keras');
    const isSoftware = selectedCategoryName.toLowerCase().includes('software') || selectedCategoryName.toLowerCase().includes('perangkat lunak');
    const isNetwork = selectedCategoryName.toLowerCase().includes('network') || selectedCategoryName.toLowerCase().includes('jaringan');
    const isAccount = selectedCategoryName.toLowerCase().includes('account') || selectedCategoryName.toLowerCase().includes('akses');


    return (
        <AppLayout title={`${t('td_editDraft')} - ${ticket.ticket_number}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header */}
                <div className="mb-8">
                    <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
                        <Link href="/dashboard" className="hover:text-primary-700 transition-colors">{t('dashboard')}</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/tickets" className="hover:text-primary-700 transition-colors">{t('tickets')}</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-neutral-900 font-medium">{t('td_editDraft')}</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">{t('td_editDraft')} - {ticket.ticket_number}</h1>
                    <p className="mt-2 text-neutral-500 max-w-2xl text-lg">
                        {t('tc_issueInfo')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Form Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Section 1: Issue Info */}
                            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                                <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">1</div>
                                    <h2 className="text-lg font-semibold text-neutral-900">{t('tc_issueInfo')}</h2>
                                </div>
                                <div className="p-6 space-y-6">
                                    <Input
                                        id="title"
                                        label={t('title')}
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        error={errors.title}
                                        helpText={t('tc_titleHelp')}
                                        placeholder={t('tc_titlePlaceholder')}
                                        autoFocus
                                        required
                                        className="text-lg"
                                    />

                                    {/* Duplicates Warning */}
                                    <AnimatePresence>
                                        {similarTickets.length > 0 && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mt-2">
                                                    <div className="flex gap-3">
                                                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-semibold text-amber-900">{t('tc_possibleSimilarTickets')}</h4>
                                                            <p className="text-sm text-amber-700 mt-1 mb-4">{t('similarTicketsDesc')}</p>
                                                            <div className="space-y-2 mb-4">
                                                                {similarTickets.map(ticket => (
                                                                    <div key={ticket.id} className="bg-white rounded-md p-3 border border-amber-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                                        <div>
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <span className="text-xs font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">{ticket.ticket_number}</span>
                                                                                <span className="text-xs font-medium text-amber-800">{ticket.status}</span>
                                                                            </div>
                                                                            <p className="text-sm font-medium text-neutral-900">{ticket.title}</p>
                                                                        </div>
                                                                        <a href={`/tickets/${ticket.id}`} target="_blank" rel="noopener noreferrer" className="shrink-0 text-primary-600 hover:text-primary-800 flex items-center gap-1.5 text-sm font-medium bg-primary-50 px-3 py-1.5 rounded-md transition-colors">
                                                                            {t('tc_viewTicket')} <ExternalLink className="h-3.5 w-3.5" />
                                                                        </a>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex gap-3 items-center">
                                                                <button type="button" onClick={() => setSimilarTickets([])} className="text-sm font-medium text-amber-800 hover:text-amber-900 transition-colors">
                                                                    {t('tc_continueAnyway')}
                                                                </button>
                                                                <span className="text-amber-300">•</span>
                                                                <Link href="/knowledge-base" className="text-sm font-medium text-amber-800 hover:text-amber-900 transition-colors">
                                                                    {t('tc_useExistingSolution')}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="space-y-2">
                                        <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
                                            {t('tc_issueDescription')} <span className="text-danger-500">*</span>
                                        </label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full min-h-[160px] rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow resize-y"
                                            placeholder={t('tc_descPlaceholder')}
                                            required
                                        />
                                        {errors.description && <p className="text-sm text-danger-600">{errors.description}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Classification */}
                            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                                <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">2</div>
                                        <h2 className="text-lg font-semibold text-neutral-900">{t('tc_ticketClassification')}</h2>
                                    </div>
                                    {smartSuggestion && (
                                        <div className="flex items-center gap-2 text-xs font-medium text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
                                            <Lightbulb className="h-3.5 w-3.5" />
                                            {t('tc_smartRecommendations')} active
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 relative">
                                            <label htmlFor="category_id" className="block text-sm font-medium text-neutral-700">
                                                {t('category')} <span className="text-danger-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="category_id"
                                                    value={data.category_id}
                                                    onChange={(e) => setData('category_id', e.target.value)}
                                                    className={`w-full h-11 rounded-lg border ${smartSuggestion?.category && !data.category_id ? 'border-primary-400 ring-4 ring-primary-50' : 'border-neutral-300'} bg-white px-4 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none transition-all`}
                                                    required
                                                >
                                                    <option value="" disabled>{t('selectCategory')}</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>
                                                            {cat.name} {smartSuggestion?.category && cat.name.toLowerCase().includes(smartSuggestion.category.toLowerCase()) ? ` ${t('tc_recommended')}` : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none" />
                                            </div>
                                            {errors.category_id && <p className="text-sm text-danger-600">{errors.category_id}</p>}
                                        </div>

                                        <div className="space-y-2 relative">
                                            <label htmlFor="priority" className="block text-sm font-medium text-neutral-700">
                                                {t('priority')} <span className="text-danger-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="priority"
                                                    value={data.priority}
                                                    onChange={(e) => setData('priority', e.target.value)}
                                                    className={`w-full h-11 rounded-lg border ${smartSuggestion?.priority && data.priority !== smartSuggestion.priority ? 'border-amber-400 ring-4 ring-amber-50' : 'border-neutral-300'} bg-white px-4 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none transition-all`}
                                                    required
                                                >
                                                    <option value="low">{t('low')} {smartSuggestion?.priority === 'low' ? ` ${t('tc_recommended')}` : ''}</option>
                                                    <option value="medium">{t('medium')} {smartSuggestion?.priority === 'medium' ? ` ${t('tc_recommended')}` : ''}</option>
                                                    <option value="high">{t('high')} {smartSuggestion?.priority === 'high' ? ` ${t('tc_recommended')}` : ''}</option>
                                                    <option value="critical">{t('critical')} {smartSuggestion?.priority === 'critical' ? ` ${t('tc_recommended')}` : ''}</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none" />
                                            </div>
                                            {errors.priority && <p className="text-sm text-danger-600">{errors.priority}</p>}
                                        </div>
                                    </div>

                                    {/* Dynamic Fields Section */}
                                    <AnimatePresence mode="wait">
                                        {isHardware && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 border-t border-neutral-100 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
                                                <Input id="deviceType" label={t('tc_deviceType')} placeholder="e.g. Laptop, Monitor" value={data.dynamic_fields?.device_type || ''} onChange={(e) => setData('dynamic_fields', {...data.dynamic_fields, device_type: e.target.value})} />
                                                <Input id="assetNumber" label={t('tc_assetNumber')} placeholder="e.g. INV-2023-001" value={data.dynamic_fields?.asset_number || ''} onChange={(e) => setData('dynamic_fields', {...data.dynamic_fields, asset_number: e.target.value})} />
                                            </motion.div>
                                        )}
                                        {isSoftware && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 border-t border-neutral-100 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
                                                <Input id="appName" label={t('tc_applicationName')} placeholder="e.g. Microsoft Excel" value={data.dynamic_fields?.app_name || ''} onChange={(e) => setData('dynamic_fields', {...data.dynamic_fields, app_name: e.target.value})} />
                                                <Input id="os" label={t('tc_operatingSystem')} placeholder="e.g. Windows 11" value={data.dynamic_fields?.os || ''} onChange={(e) => setData('dynamic_fields', {...data.dynamic_fields, os: e.target.value})} />
                                            </motion.div>
                                        )}
                                        {isNetwork && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 border-t border-neutral-100 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
                                                <Input id="location" label={t('tc_affectedLocation')} placeholder="e.g. 3rd Floor Meeting Room" value={data.dynamic_fields?.location || ''} onChange={(e) => setData('dynamic_fields', {...data.dynamic_fields, location: e.target.value})} />
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-neutral-700">{t('tc_internetStatus')}</label>
                                                    <select className="w-full h-11 rounded-lg border border-neutral-300 bg-white px-4 text-sm focus:ring-2 focus:ring-primary-500 appearance-none" onChange={(e) => setData('dynamic_fields', {...data.dynamic_fields, connection: e.target.value})} value={data.dynamic_fields?.connection || ''}>
                                                        <option value="">Select status</option>
                                                        <option value="offline">Completely Offline</option>
                                                        <option value="slow">Slow/Intermittent</option>
                                                        <option value="cant_connect">Cannot Connect to Wi-Fi</option>
                                                    </select>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Section 3: Attachments */}
                            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                                <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">3</div>
                                        <h2 className="text-lg font-semibold text-neutral-900">{t('tc_attachments')}</h2>
                                    </div>
                                    <span className="text-sm text-neutral-500">Optional</span>
                                </div>
                                <div className="p-6">
                                    <div 
                                        onDragOver={onDragOver}
                                        onDragLeave={onDragLeave}
                                        onDrop={onDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'}`}
                                    >
                                        <input
                                            type="file"
                                            multiple
                                            ref={fileInputRef}
                                            onChange={(e) => handleFiles(e.target.files)}
                                            className="hidden"
                                        />
                                        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <UploadCloud className="h-8 w-8" />
                                        </div>
                                        <p className="text-base font-medium text-neutral-900 mb-1">
                                            {t('tc_dragDropFiles')} <span className="text-primary-600 hover:text-primary-700">{t('tc_browseFiles')}</span>
                                        </p>
                                        <p className="text-sm text-neutral-500">
                                            {t('tc_maxFiles')}
                                        </p>
                                    </div>
                                    {errors['attachments.0'] && <p className="text-sm text-danger-600 mt-2">{errors['attachments.0']}</p>}

                                    {/* Preview Area */}
                                    {previews.length > 0 && (
                                        <div className="mt-6 space-y-3">
                                            <h4 className="text-sm font-medium text-neutral-700">Attached Files ({previews.length})</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {previews.map((preview, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-lg shadow-sm group hover:border-primary-300 transition-colors">
                                                        <div className="h-10 w-10 shrink-0 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden relative border border-neutral-200">
                                                            {preview.url ? (
                                                                <img src={preview.url} alt="preview" className="h-full w-full object-cover" />
                                                            ) : preview.type.includes('pdf') ? (
                                                                <FileText className="h-5 w-5 text-danger-500" />
                                                            ) : (
                                                                <FileIcon className="h-5 w-5 text-neutral-500" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-neutral-900 truncate">{preview.name}</p>
                                                            <p className="text-xs text-neutral-500">{preview.size}</p>
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                                            className="p-1.5 text-neutral-400 hover:text-danger-600 hover:bg-danger-50 rounded-md transition-colors"
                                                            title={t('tc_remove')}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                                <Button 
                                    type="button" 
                                    variant="secondary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        transform((currentData) => ({
                                            ...currentData,
                                            status: 'draft'
                                        }));
                                        post(`/tickets/${ticket.id}`, {
                                            forceFormData: true,
                                            onSuccess: () => {
                                                
                                                window.location.href = '/tickets'; // Redirect to My Tickets
                                            }
                                        });
                                    }}
                                    disabled={processing}
                                >
                                    {t('tc_saveAsDraft')}
                                </Button>
                                <div className="flex items-center gap-3">
                                    <Link href="/tickets" className="px-5 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                                        {t('cancel')}
                                    </Link>
                                    <Button type="submit" size="lg" loading={processing} disabled={processing} className="px-8 shadow-sm">
                                        {t('submitTicket')}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Operational Sidebar */}
                    <div className="space-y-6">
                        
                        {/* SLA Preview Card */}
                        <div className={`bg-white rounded-xl shadow-sm border ${sla.border} overflow-hidden transition-colors duration-300`}>
                            <div className={`px-5 py-4 border-b ${sla.border} ${sla.bg} flex items-center gap-2`}>
                                <Activity className={`h-5 w-5 ${sla.color}`} />
                                <h3 className={`font-semibold ${sla.color}`}>{t('tc_slaWorkflowInfo')}</h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">{t('tc_responseTarget')}</p>
                                    <p className="text-lg font-semibold text-neutral-900">{sla.response}</p>
                                </div>
                                <div className="h-px bg-neutral-100"></div>
                                <div>
                                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">{t('tc_estimatedResolution')}</p>
                                    <p className="text-lg font-semibold text-neutral-900">{sla.resolution}</p>
                                </div>
                                <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                                    <p className="text-xs text-neutral-600 flex items-start gap-2">
                                        <Info className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
                                        <span>
                                            {data.priority === 'critical' ? t('tc_severityCritical') : 
                                             data.priority === 'high' ? t('tc_severityHigh') : 
                                             data.priority === 'medium' ? t('tc_severityMedium') : 
                                             t('tc_severityLow')}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Knowledge Base Recommendations */}
                        {relatedArticles.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-primary-200 overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4">
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                    </span>
                                </div>
                                <div className="px-5 py-4 border-b border-primary-100 bg-primary-50/50 flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-primary-600" />
                                    <h3 className="font-semibold text-primary-900">{t('tc_relatedArticles')}</h3>
                                </div>
                                <div className="p-0 divide-y divide-neutral-100">
                                    {relatedArticles.map(article => (
                                        <a key={article.id} href={`/knowledge-base/${article.id}`} target="_blank" rel="noopener noreferrer" className="block p-4 hover:bg-neutral-50 transition-colors group">
                                            <p className="text-sm font-medium text-primary-700 group-hover:text-primary-800 mb-1">{article.title}</p>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-600">
                                                {article.type}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Workflow Preview */}
                        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50 flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-neutral-600" />
                                <h3 className="font-semibold text-neutral-900">{t('tc_workflowPreview')}</h3>
                            </div>
                            <div className="p-5">
                                <div className="space-y-4">
                                    {[
                                        { label: t('tc_ticketSubmitted'), active: true },
                                        { label: t('tc_underInvestigation'), active: false },
                                        { label: t('tc_resolutionApplied'), active: false },
                                        { label: t('tc_ticketClosed'), active: false }
                                    ].map((step, idx, arr) => (
                                        <div key={idx} className="flex items-start gap-3 relative">
                                            {idx !== arr.length - 1 && (
                                                <div className="absolute top-6 bottom-[-16px] left-2.5 w-0.5 bg-neutral-200"></div>
                                            )}
                                            <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 z-10 ${step.active ? 'bg-primary-500 ring-4 ring-primary-50' : 'bg-neutral-200'}`}>
                                                {step.active && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                            <p className={`text-sm font-medium ${step.active ? 'text-primary-700' : 'text-neutral-500'}`}>{step.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Support Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5">
                            <h3 className="font-semibold text-neutral-900 mb-3">{t('tc_operationalGuidance')}</h3>
                            <ul className="space-y-3 text-sm text-neutral-600">
                                <li className="flex items-start gap-2">
                                    <Clock className="h-4 w-4 shrink-0 mt-0.5 text-neutral-400" />
                                    <span>{t('tc_supportHoursVal')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Briefcase className="h-4 w-4 shrink-0 mt-0.5 text-neutral-400" />
                                    <span>{t('tc_outsideHoursMsg')}</span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
                        >
                            <div className="p-8 text-center">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success-100 mb-6">
                                    <CheckCircle2 className="h-8 w-8 text-success-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-neutral-900 mb-2">{t('tc_ticketSubmitted')}</h3>
                                <p className="text-neutral-500 mb-6">{t('tc_ticketSuccessSummary')}</p>
                                
                                <div className="bg-neutral-50 rounded-lg p-4 mb-6 border border-neutral-100 text-left">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-neutral-500">Ticket ID</p>
                                            <p className="font-semibold text-neutral-900">{createdTicketId || 'PENDING'}</p>
                                        </div>
                                        <div>
                                            <p className="text-neutral-500">Priority</p>
                                            <p className="font-semibold text-neutral-900 capitalize">{data.priority}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-neutral-500">SLA Target</p>
                                            <p className="font-semibold text-neutral-900">{sla.resolution}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Link href="/dashboard" className="flex-1">
                                        <Button variant="secondary" className="w-full">{t('dashboard')}</Button>
                                    </Link>
                                    <Link href="/tickets" className="flex-1">
                                        <Button className="w-full">{t('tc_viewTicket')}</Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AppLayout>
    );
}
