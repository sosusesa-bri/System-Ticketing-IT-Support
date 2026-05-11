import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Send, FileText, Zap, BarChart3, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useLanguage } from '../../../contexts/LanguageContext';

function NavCard({ href, icon: Icon, label, description, isActive = false, delay = 0 }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
            <Link
                href={href}
                className={cn(
                    'flex items-center gap-4 p-4 rounded-xl border transition-all group',
                    isActive
                        ? 'bg-primary-50 border-primary-200 text-primary-700'
                        : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300',
                )}
            >
                <div className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                    isActive ? 'bg-primary-100' : 'bg-neutral-100 group-hover:bg-neutral-200',
                )}>
                    <Icon className={cn('h-5 w-5', isActive ? 'text-primary-600' : 'text-neutral-500')} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{label}</p>
                    <p className={cn('text-xs mt-0.5', isActive ? 'text-primary-500' : 'text-neutral-400')}>{description}</p>
                </div>
                <ChevronRight className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary-400' : 'text-neutral-300')} />
            </Link>
        </motion.div>
    );
}

export default function NavCards({ currentPath, stats }) {
    const { t } = useLanguage();
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <NavCard 
                href="/admin/notifications/dashboard" 
                icon={BarChart3} 
                label={t('overview')} 
                description={t('nda_overviewDesc')} 
                isActive={currentPath === 'dashboard'} 
                delay={0} 
            />
            <NavCard 
                href="/admin/notifications/broadcasts" 
                icon={Send} 
                label={t('broadcasts')} 
                description={t('nda_broadcastsDesc')} 
                isActive={currentPath === 'broadcasts'} 
                delay={0.05} 
            />
            <NavCard 
                href="/admin/notifications/templates" 
                icon={FileText} 
                label={t('templates')} 
                description={`${stats?.active_templates ?? 0} ${t('active')}`} 
                isActive={currentPath === 'templates'} 
                delay={0.1} 
            />
            <NavCard 
                href="/admin/notifications/automation" 
                icon={Zap} 
                label={t('automation')} 
                description={`${stats?.active_rules ?? 0} ${t('nda_rulesActive')}`} 
                isActive={currentPath === 'automation'} 
                delay={0.15} 
            />
        </div>
    );
}
