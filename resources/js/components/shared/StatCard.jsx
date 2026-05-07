import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, accent = 'primary' }) {
    const accents = {
        primary: 'text-primary-600 bg-primary-50',
        success: 'text-success-600 bg-success-50',
        warning: 'text-warning-600 bg-warning-50',
        danger: 'text-danger-600 bg-danger-50',
        info: 'text-info-600 bg-info-50',
        neutral: 'text-neutral-600 bg-neutral-100',
    };

    return (
        <motion.div 
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group bg-white border border-neutral-200 rounded-xl shadow-sm p-6 hover:shadow-md hover:border-primary-200 transition-all relative overflow-hidden"
        >
            <div className="flex items-center justify-between mb-4 relative z-10">
                <p className="text-sm font-medium text-neutral-500 tracking-wide">
                    {label}
                </p>
                {Icon && (
                    <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110 duration-300", accents[accent])}>
                        <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                )}
            </div>
            <p className="text-3xl font-bold text-neutral-900 relative z-10">
                {value}
            </p>
        </motion.div>
    );
}
