import { useForm, Link } from '@inertiajs/react';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ForgotPassword() {
    const { language } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <AuthLayout title={language === 'id' ? 'Lupa Kata Sandi' : 'Forgot Password'}>
            <h2 className="text-xl font-bold text-primary-900 mb-1">
                {language === 'id' ? 'Atur Ulang Kata Sandi' : 'Reset Password'}
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
                {language === 'id'
                    ? 'Masukkan alamat email Anda dan kami akan mengirimkan tautan reset kata sandi.'
                    : 'Enter your email address and we will send you a password reset link.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    id="email"
                    label={language === 'id' ? 'Alamat Email' : 'Email Address'}
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    placeholder="you@politekmitra.ac.id"
                    autoFocus
                    required
                />

                <Button
                    type="submit"
                    loading={processing}
                    disabled={processing}
                    className="w-full"
                >
                    {language === 'id' ? 'Kirim Tautan Reset' : 'Send Reset Link'}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-500">
                <Link href="/login" className="text-primary-700 hover:text-primary-900 font-medium">
                    {language === 'id' ? 'Kembali ke Login' : 'Back to Login'}
                </Link>
            </p>
        </AuthLayout>
    );
}
