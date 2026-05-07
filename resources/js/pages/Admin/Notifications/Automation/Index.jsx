import AppLayout from '../../../../layouts/AppLayout';
import Card from '../../../../components/ui/Card';

export default function AutomationIndex({ rules }) {
    return (
        <AppLayout title="Notification Automation">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">Automation</h1>
                    <p className="text-sm text-neutral-500 mt-1">Configure automated notification rules.</p>
                </div>
            </div>
            <Card>
                <div className="p-8 text-center text-neutral-500">
                    Automation engine configuration is coming soon.
                </div>
            </Card>
        </AppLayout>
    );
}
