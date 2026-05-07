import { useForm, Link } from '@inertiajs/react';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <AuthLayout title="Forgot Password">
            <h2 className="text-xl font-bold text-primary-900 mb-1">Reset Password</h2>
            <p className="text-sm text-neutral-500 mb-6">
                Enter your email address and we will send you a password reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    id="email"
                    label="Email Address"
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
                    Send Reset Link
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-500">
                <Link href="/login" className="text-primary-700 hover:text-primary-900 font-medium">
                    Back to Login
                </Link>
            </p>
        </AuthLayout>
    );
}
