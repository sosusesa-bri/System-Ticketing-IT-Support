import { useForm, Link } from '@inertiajs/react';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Login() {
    const { t } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <AuthLayout title={t('signIn')}>
            <div className="mb-8 flex flex-col items-center text-center">
                <img src="/images/Logo_POLMIND.png" alt="POLMIND Logo" className="h-14 w-auto mb-6 hidden lg:block" />
                <h2 className="text-2xl font-extrabold text-primary-950 mb-2 tracking-tight">{t('signIn')}</h2>
                <p className="text-sm text-neutral-500 font-medium">
                    {t('enterCredentials')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    id="email"
                    label={t('email')}
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    placeholder="you@politekmitra.ac.id"
                    autoFocus
                    required
                />

                <Input
                    id="password"
                    label={t('password')}
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    placeholder="••••••••"
                    required
                />

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-700"
                        />
                        <span className="text-sm text-neutral-500">{t('rememberMe')}</span>
                    </label>

                    <Link
                        href="/forgot-password"
                        className="text-sm text-primary-700 hover:text-primary-900 font-medium"
                    >
                        {t('forgotPassword')}
                    </Link>
                </div>

                <Button
                    type="submit"
                    loading={processing}
                    disabled={processing}
                    className="w-full"
                >
                    {t('signIn')}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-500">
                {t('noAccount')}{' '}
                <Link href="/register" className="text-primary-700 hover:text-primary-900 font-medium">
                    {t('registerHere')}
                </Link>
            </p>
        </AuthLayout>
    );
}
