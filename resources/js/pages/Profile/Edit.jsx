import React, { useState, useRef, useCallback } from 'react';
import { useForm, router } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';
import { 
    User, Lock, Settings, Activity, Camera, X, Check,
    UserCircle, Mail, Phone, Briefcase, CalendarClock, Shield, Clock
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileEdit({ user, recentActivity }) {
    const { t, setLanguage } = useLanguage();
    
    // Forms
    const profileForm = useForm({
        name: user.name,
        phone: user.phone || '',
        department: user.department,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const preferencesForm = useForm({
        language: user.language || 'en',
        notification_preferences: user.notification_preferences || {
            email: true,
            in_app: true
        },
    });

    // Handlers
    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.put('/profile');
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put('/profile/password', {
            onSuccess: () => passwordForm.reset(),
        });
    };

    const handlePreferencesSubmit = (e) => {
        e.preventDefault();
        preferencesForm.put('/profile/preferences', {
            onSuccess: () => {
                setLanguage(preferencesForm.data.language);
            }
        });
    };

    const handlePreferenceToggle = (key) => {
        preferencesForm.setData('notification_preferences', {
            ...preferencesForm.data.notification_preferences,
            [key]: !preferencesForm.data.notification_preferences[key]
        });
    };

    // Avatar state
    const [avatarPreview, setAvatarPreview] = useState(user.avatar_path ? `/storage/${user.avatar_path}` : null);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            let imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
            setCropModalOpen(true);
            e.target.value = ''; // Reset input
        }
    };

    const handleSaveCrop = async () => {
        try {
            setUploadingAvatar(true);
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
            
            // Create a File from Blob
            const file = new File([croppedImageBlob], "avatar.jpg", { type: "image/jpeg" });
            
            // Show preview immediately
            setAvatarPreview(URL.createObjectURL(croppedImageBlob));
            setCropModalOpen(false);

            // Upload
            router.post('/profile/photo', {
                _method: 'post',
                photo: file
            }, {
                preserveScroll: true,
                onFinish: () => setUploadingAvatar(false)
            });
            
        } catch (e) {
            console.error(e);
            setUploadingAvatar(false);
        }
    };

    const handleRemovePhoto = () => {
        router.delete('/profile/photo', {
            preserveScroll: true,
            onSuccess: () => setAvatarPreview(null)
        });
    };

    return (
        <AppLayout title={t('profile')}>
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">{t('profileSettings')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{t('profileSettingsDesc')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Summary & Avatar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-primary-600 to-primary-800"></div>
                        <div className="px-6 pb-6 pt-0 relative flex flex-col items-center text-center">
                            {/* Avatar Wrapper */}
                            <div className="relative -mt-12 mb-4 group">
                                <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
                                    <div className="h-full w-full rounded-full overflow-hidden bg-primary-100 flex items-center justify-center border border-neutral-200">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <UserCircle className="h-12 w-12 text-primary-300" strokeWidth={1.5} />
                                        )}
                                    </div>
                                </div>
                                
                                {/* Avatar Action Buttons */}
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingAvatar}
                                        className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-colors mr-2"
                                        title={t('uploadPhoto')}
                                    >
                                        <Camera className="h-4 w-4" />
                                    </button>
                                    {avatarPreview && (
                                        <button
                                            onClick={handleRemovePhoto}
                                            disabled={uploadingAvatar}
                                            className="p-1.5 bg-danger-500/80 hover:bg-danger-600 rounded-full text-white backdrop-blur-sm transition-colors"
                                            title={t('removePhoto')}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={onFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            
                            <h2 className="text-xl font-bold text-neutral-900">{user.name}</h2>
                            <p className="text-sm font-medium text-primary-600 capitalize">{user.role}</p>
                            
                            <div className="w-full mt-6 space-y-3 text-sm text-left">
                                <div className="flex items-center text-neutral-600">
                                    <Mail className="h-4 w-4 mr-3 text-neutral-400" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center text-neutral-600">
                                    <Phone className="h-4 w-4 mr-3 text-neutral-400" />
                                    <span>{user.phone || '-'}</span>
                                </div>
                                <div className="flex items-center text-neutral-600">
                                    <Briefcase className="h-4 w-4 mr-3 text-neutral-400" />
                                    <span>{user.department}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                    
                    <Card>
                        <h3 className="text-sm font-semibold text-neutral-900 mb-4">{t('accountSummary')}</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500 flex items-center gap-2"><Shield className="h-4 w-4" /> {t('roleLabel')}</span>
                                <span className="font-medium capitalize text-neutral-900">{user.role}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500 flex items-center gap-2"><CalendarClock className="h-4 w-4" /> {t('joinedLabel')}</span>
                                <span className="font-medium text-neutral-900">{new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500 flex items-center gap-2"><Clock className="h-4 w-4" /> {t('lastLoginLabel')}</span>
                                <span className="font-medium text-neutral-900">
                                    {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : t('never')}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Tabs */}
                <div className="lg:col-span-8">
                    <Tabs.Root defaultValue="profile" className="flex flex-col w-full">
                        <Tabs.List className="flex border-b border-neutral-200 mb-6 px-1 overflow-x-auto scrollbar-hide">
                            <Tabs.Trigger
                                value="profile"
                                className="px-4 py-2.5 text-sm font-medium text-neutral-500 border-b-2 border-transparent hover:text-neutral-700 data-[state=active]:text-primary-700 data-[state=active]:border-primary-700 transition-all flex items-center gap-2 whitespace-nowrap"
                            >
                                <User className="h-4 w-4" /> {t('profileInformation')}
                            </Tabs.Trigger>
                            <Tabs.Trigger
                                value="preferences"
                                className="px-4 py-2.5 text-sm font-medium text-neutral-500 border-b-2 border-transparent hover:text-neutral-700 data-[state=active]:text-primary-700 data-[state=active]:border-primary-700 transition-all flex items-center gap-2 whitespace-nowrap"
                            >
                                <Settings className="h-4 w-4" /> {t('preferences')}
                            </Tabs.Trigger>
                            <Tabs.Trigger
                                value="security"
                                className="px-4 py-2.5 text-sm font-medium text-neutral-500 border-b-2 border-transparent hover:text-neutral-700 data-[state=active]:text-primary-700 data-[state=active]:border-primary-700 transition-all flex items-center gap-2 whitespace-nowrap"
                            >
                                <Lock className="h-4 w-4" /> {t('security')}
                            </Tabs.Trigger>
                            <Tabs.Trigger
                                value="activity"
                                className="px-4 py-2.5 text-sm font-medium text-neutral-500 border-b-2 border-transparent hover:text-neutral-700 data-[state=active]:text-primary-700 data-[state=active]:border-primary-700 transition-all flex items-center gap-2 whitespace-nowrap"
                            >
                                <Activity className="h-4 w-4" /> {t('activity')}
                            </Tabs.Trigger>
                        </Tabs.List>

                        <AnimatePresence mode="wait">
                            <Tabs.Content value="profile" asChild>
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <Card>
                                        <div className="mb-6">
                                            <h2 className="text-lg font-semibold text-neutral-900">{t('personalInfo')}</h2>
                                            <p className="text-sm text-neutral-500">{t('personalInfoDesc')}</p>
                                        </div>
                                        <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
                                            <Input
                                                id="name"
                                                label={t('fullName')}
                                                type="text"
                                                value={profileForm.data.name}
                                                onChange={(e) => profileForm.setData('name', e.target.value)}
                                                error={profileForm.errors.name}
                                                required
                                            />
                                            <Input
                                                id="email"
                                                label={t('email')}
                                                type="email"
                                                value={user.email}
                                                disabled
                                                helpText={t('contactAdminToChange')}
                                            />
                                            <Input
                                                id="phone"
                                                label={t('phoneNumber')}
                                                type="text"
                                                value={profileForm.data.phone}
                                                onChange={(e) => profileForm.setData('phone', e.target.value)}
                                                error={profileForm.errors.phone}
                                                placeholder={t('phonePlaceholder')}
                                            />
                                            <div className="space-y-1">
                                                <label htmlFor="profile_department" className="block text-xs font-medium text-neutral-500">{t('department')}</label>
                                                <select
                                                    id="profile_department"
                                                    value={profileForm.data.department}
                                                    onChange={(e) => profileForm.setData('department', e.target.value)}
                                                    className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-950 focus:outline-none focus:ring-2 focus:ring-primary-700"
                                                    required
                                                >
                                                    <option value="Administrasi">Administrasi</option>
                                                    <option value="Akademik">Akademik</option>
                                                    <option value="Keuangan">Keuangan</option>
                                                    <option value="IT Department">IT Department</option>
                                                    <option value="Kemahasiswaan">Kemahasiswaan</option>
                                                    <option value="Perpustakaan">Perpustakaan</option>
                                                    <option value="Lainnya">Lainnya</option>
                                                </select>
                                                {profileForm.errors.department && <p className="text-xs text-danger-600 mt-1">{profileForm.errors.department}</p>}
                                            </div>
                                            <div className="pt-4 flex justify-end">
                                                <Button type="submit" loading={profileForm.processing}>
                                                    {profileForm.processing ? t('saving') : t('saveChanges')}
                                                </Button>
                                            </div>
                                        </form>
                                    </Card>
                                </motion.div>
                            </Tabs.Content>

                            <Tabs.Content value="preferences" asChild>
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <Card>
                                        <div className="mb-6">
                                            <h2 className="text-lg font-semibold text-neutral-900">{t('preferences')}</h2>
                                        </div>
                                        <form onSubmit={handlePreferencesSubmit} className="space-y-8 max-w-xl">
                                            
                                            {/* Language Preference */}
                                            <div className="space-y-3">
                                                <h3 className="text-sm font-medium text-neutral-900 border-b border-neutral-100 pb-2">{t('languagePref')}</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${preferencesForm.data.language === 'en' ? 'border-primary-600 bg-primary-50' : 'border-neutral-200 hover:bg-neutral-50'}`}>
                                                        <input type="radio" name="language" value="en" checked={preferencesForm.data.language === 'en'} onChange={e => preferencesForm.setData('language', e.target.value)} className="text-primary-600 focus:ring-primary-600" />
                                                        <span className="text-sm font-medium text-neutral-900">{t('english')}</span>
                                                    </label>
                                                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${preferencesForm.data.language === 'id' ? 'border-primary-600 bg-primary-50' : 'border-neutral-200 hover:bg-neutral-50'}`}>
                                                        <input type="radio" name="language" value="id" checked={preferencesForm.data.language === 'id'} onChange={e => preferencesForm.setData('language', e.target.value)} className="text-primary-600 focus:ring-primary-600" />
                                                        <span className="text-sm font-medium text-neutral-900">{t('indonesian')}</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Notification Preference */}
                                            <div className="space-y-3">
                                                <h3 className="text-sm font-medium text-neutral-900 border-b border-neutral-100 pb-2">{t('notificationPref')}</h3>
                                                <div className="space-y-2">
                                                    <label className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                                                        <input type="checkbox" checked={preferencesForm.data.notification_preferences?.email} onChange={() => handlePreferenceToggle('email')} className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-600" />
                                                        <div>
                                                            <p className="text-sm font-medium text-neutral-900">{t('emailNotifications')}</p>
                                                            <p className="text-xs text-neutral-500">{t('receiveEmailUpdates')}</p>
                                                        </div>
                                                    </label>
                                                    <label className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                                                        <input type="checkbox" checked={preferencesForm.data.notification_preferences?.in_app} onChange={() => handlePreferenceToggle('in_app')} className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-600" />
                                                        <div>
                                                            <p className="text-sm font-medium text-neutral-900">{t('appNotifications')}</p>
                                                            <p className="text-xs text-neutral-500">{t('receiveAppUpdates')}</p>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="pt-4 flex justify-end">
                                                <Button type="submit" loading={preferencesForm.processing}>
                                                    {preferencesForm.processing ? t('saving') : t('saveChanges')}
                                                </Button>
                                            </div>
                                        </form>
                                    </Card>
                                </motion.div>
                            </Tabs.Content>

                            <Tabs.Content value="security" asChild>
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <Card>
                                        <div className="mb-6">
                                            <h2 className="text-lg font-semibold text-neutral-900">{t('security')}</h2>
                                            <p className="text-sm text-neutral-500">{t('securityDesc')}</p>
                                        </div>
                                        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
                                            <Input
                                                id="current_password"
                                                label={t('currentPassword')}
                                                type="password"
                                                value={passwordForm.data.current_password}
                                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                error={passwordForm.errors.current_password}
                                                required
                                            />
                                            <Input
                                                id="new_password"
                                                label={t('newPassword')}
                                                type="password"
                                                value={passwordForm.data.password}
                                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                error={passwordForm.errors.password}
                                                helpText={t('min8chars')}
                                                required
                                            />
                                            <Input
                                                id="confirm_password"
                                                label={t('confirmPassword')}
                                                type="password"
                                                value={passwordForm.data.password_confirmation}
                                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                required
                                            />
                                            <div className="pt-4 flex justify-end">
                                                <Button type="submit" loading={passwordForm.processing}>
                                                    {passwordForm.processing ? t('saving') : t('updatePassword')}
                                                </Button>
                                            </div>
                                        </form>
                                    </Card>
                                </motion.div>
                            </Tabs.Content>

                            <Tabs.Content value="activity" asChild>
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <Card>
                                        <div className="mb-6">
                                            <h2 className="text-lg font-semibold text-neutral-900">{t('auditHistory')}</h2>
                                        </div>
                                        <div className="space-y-6">
                                            {recentActivity && recentActivity.length > 0 ? (
                                                <div className="relative border-l border-neutral-200 ml-3 space-y-6">
                                                    {recentActivity.map((activity, index) => (
                                                        <div key={activity.id} className="relative pl-6">
                                                            <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-neutral-200 border-2 border-white ring-1 ring-neutral-200"></div>
                                                            <p className="text-sm font-medium text-neutral-900">{activity.description}</p>
                                                            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                                                                <Clock className="h-3 w-3" />
                                                                <span>{new Date(activity.created_at).toLocaleString()}</span>
                                                                {activity.ip_address && (
                                                                    <>
                                                                        <span>&bull;</span>
                                                                        <span>{activity.ip_address}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-10">
                                                    <Activity className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
                                                    <p className="text-sm text-neutral-500">{t('noActivityLogs')}</p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            </Tabs.Content>
                        </AnimatePresence>
                    </Tabs.Root>
                </div>
            </div>

            {/* Avatar Crop Modal */}
            <Dialog.Root open={cropModalOpen} onOpenChange={setCropModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm z-50 animate-in fade-in" />
                    <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-white rounded-xl shadow-xl z-50 animate-in zoom-in-95 p-0 overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-white z-10">
                            <Dialog.Title className="text-lg font-semibold text-neutral-900">{t('cropPhoto')}</Dialog.Title>
                            <Dialog.Close asChild>
                                <button className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </Dialog.Close>
                        </div>
                        <div className="relative h-80 bg-neutral-900 w-full">
                            {imageSrc && (
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    cropShape="round"
                                    showGrid={false}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            )}
                        </div>
                        <div className="p-4 bg-white z-10 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-neutral-500">{t('zoom')}</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(e.target.value)}
                                    className="w-full accent-primary-600"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="secondary" onClick={() => setCropModalOpen(false)}>
                                    {t('cancelCrop')}
                                </Button>
                                <Button onClick={handleSaveCrop} loading={uploadingAvatar}>
                                    {t('applyCrop')}
                                </Button>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

        </AppLayout>
    );
}

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result), false);
        reader.readAsDataURL(file);
    });
}
