import { useForm } from '@inertiajs/react';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ResetPassword({ token, email }) {
    const { t, language } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <AuthLayout title={language === 'id' ? 'Reset Kata Sandi' : 'Reset Password'}>
            <div className="mb-8 flex flex-col items-center text-center">
                <img src="/images/Logo_POLMIND.png" alt="POLMIND Logo" className="h-14 w-auto mb-6 hidden lg:block" />
                <h2 className="text-2xl font-extrabold text-primary-950 mb-2 tracking-tight">
                    {language === 'id' ? 'Reset Kata Sandi' : 'Reset Password'}
                </h2>
                <p className="text-sm text-neutral-500 font-medium">
                    {language === 'id' ? 'Silakan masukkan kata sandi baru Anda.' : 'Please enter your new password.'}
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
                    className="dark:bg-white dark:text-neutral-900 dark:border-neutral-200 dark:placeholder:text-neutral-400 dark:focus:ring-primary-600/30 dark:focus:border-primary-600"
                    readOnly
                    required
                />

                <Input
                    id="password"
                    label={t('password')}
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    placeholder={language === 'id' ? "Kata sandi baru" : "New password"}
                    className="dark:bg-white dark:text-neutral-900 dark:border-neutral-200 dark:placeholder:text-neutral-400 dark:focus:ring-primary-600/30 dark:focus:border-primary-600"
                    autoFocus
                    required
                />

                <Input
                    id="password_confirmation"
                    label={t('confirmPassword')}
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation}
                    placeholder={language === 'id' ? "Konfirmasi sandi baru" : "Confirm new password"}
                    className="dark:bg-white dark:text-neutral-900 dark:border-neutral-200 dark:placeholder:text-neutral-400 dark:focus:ring-primary-600/30 dark:focus:border-primary-600"
                    required
                />

                <Button
                    type="submit"
                    loading={processing}
                    disabled={processing}
                    className="w-full justify-center py-2.5 text-sm font-semibold rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                    {language === 'id' ? 'Simpan Kata Sandi' : 'Save Password'}
                </Button>
            </form>
        </AuthLayout>
    );
}
