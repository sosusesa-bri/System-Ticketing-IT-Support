import { useForm, Link } from '@inertiajs/react';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Register() {
    const { t, language } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        department: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <AuthLayout title={t('createAccount')}>
            <div className="mb-8 flex flex-col items-center text-center">
                <img src="/images/Logo_POLMIND.png" alt="POLMIND Logo" className="h-14 w-auto mb-6 hidden lg:block" />
                <h2 className="text-2xl font-extrabold text-primary-950 mb-2 tracking-tight">{t('createAccount')}</h2>
                <p className="text-sm text-neutral-500 font-medium">
                    {t('registerDesc')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    id="name"
                    label={t('fullName')}
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                    placeholder={language === 'id' ? "Masukkan nama lengkap Anda" : "Enter your full name"}
                    autoFocus
                    required
                />

                <Input
                    id="email"
                    label={t('email')}
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    placeholder="you@politekmitra.ac.id"
                    required
                />

                <div>
                    <label htmlFor="department" className="block text-xs font-medium text-neutral-500 mb-1">
                        {language === 'id' ? 'Departemen' : 'Department'}
                    </label>
                    <select
                        id="department"
                        value={data.department}
                        onChange={(e) => setData('department', e.target.value)}
                        className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-950 focus:outline-none focus:ring-2 focus:ring-primary-700"
                        required
                    >
                        <option value="">{language === 'id' ? 'Pilih departemen' : 'Select department'}</option>
                        <option value="Administrasi">Administrasi</option>
                        <option value="Akademik">Akademik</option>
                        <option value="Keuangan">Keuangan</option>
                        <option value="IT Department">IT Department</option>
                        <option value="Kemahasiswaan">Kemahasiswaan</option>
                        <option value="Perpustakaan">Perpustakaan</option>
                        <option value="Lainnya">{language === 'id' ? 'Lainnya' : 'Other'}</option>
                    </select>
                    {errors.department && (
                        <p className="text-xs text-danger-600 mt-1">{errors.department}</p>
                    )}
                </div>

                <Input
                    id="password"
                    label={t('password')}
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    helpText={language === 'id' ? "Minimal 8 karakter" : "Minimum 8 characters"}
                    placeholder={language === 'id' ? "Buat kata sandi" : "Create a password"}
                    required
                />

                <Input
                    id="password_confirmation"
                    label={t('confirmPassword')}
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    placeholder={language === 'id' ? "Konfirmasi kata sandi Anda" : "Confirm your password"}
                    required
                />

                <Button
                    type="submit"
                    loading={processing}
                    disabled={processing}
                    className="w-full"
                >
                    {t('registerHere')}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-500">
                {language === 'id' ? 'Sudah memiliki akun?' : 'Already have an account?'} {' '}
                <Link href="/login" className="text-primary-700 hover:text-primary-900 font-medium">
                    {t('signIn')}
                </Link>
            </p>
        </AuthLayout>
    );
}
