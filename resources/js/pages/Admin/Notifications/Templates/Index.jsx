import AppLayout from '../../../../layouts/AppLayout';
import Card from '../../../../components/ui/Card';

export default function TemplatesIndex({ templates }) {
    return (
        <AppLayout title="Notification Templates">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">Templates</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage reusable notification templates.</p>
                </div>
            </div>
            <Card>
                <div className="p-8 text-center text-neutral-500">
                    Template management is coming soon.
                </div>
            </Card>
        </AppLayout>
    );
}
