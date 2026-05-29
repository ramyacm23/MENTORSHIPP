'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useTheme } from '@/app/context/ThemeContext';
import { auth } from '@/lib/firebase';
import { API_URLS, safeApiFetch } from '@/lib/api';

const EMPTY_PROFILE = {
  name: '',
  email: '',
  currentRole: '',
  targetRole: '',
  yearsExperience: ''
};

const normalizeField = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

const getCachedProfile = () => ({
  name: localStorage.getItem('userName') || 'User',
  email: localStorage.getItem('userEmail') || '',
  currentRole: localStorage.getItem('currentRole') || '',
  targetRole: localStorage.getItem('targetRole') || '',
  yearsExperience: localStorage.getItem('yearsExperience') || ''
});

const cacheProfile = (profile) => {
  localStorage.setItem('userName', profile.name || 'User');
  localStorage.setItem('userEmail', profile.email || '');
  localStorage.setItem('currentRole', profile.currentRole || '');
  localStorage.setItem('targetRole', profile.targetRole || '');
  localStorage.setItem('yearsExperience', profile.yearsExperience || '');
};

export default function Profile() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const cachedProfile = getCachedProfile();
      const token = localStorage.getItem('userToken');

      if (token) {
        const data = await safeApiFetch(`${API_URLS.NODE}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data && data.name) {
          const nextProfile = {
            name: normalizeField(data.name) || cachedProfile.name,
            email: normalizeField(data.email) || cachedProfile.email,
            currentRole: normalizeField(data.currentRole) || cachedProfile.currentRole,
            targetRole: normalizeField(data.targetRole) || cachedProfile.targetRole,
            yearsExperience: normalizeField(data.yearsExperience) || cachedProfile.yearsExperience
          };

          setProfile(nextProfile);
          cacheProfile(nextProfile);
          setLoading(false);
          return;
        }
      }

      setProfile(cachedProfile);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    cacheProfile(profile);
    const token = localStorage.getItem('userToken');

    if (token) {
      try {
        const response = await fetch(`${API_URLS.NODE}/api/user/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: profile.name,
            currentRole: profile.currentRole,
            targetRole: profile.targetRole,
            yearsExperience: profile.yearsExperience
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to save profile');
        }

        const updatedData = await response.json();
        const nextProfile = {
          name: updatedData.name || profile.name,
          email: updatedData.email || profile.email,
          currentRole: updatedData.currentRole || '',
          targetRole: updatedData.targetRole || '',
          yearsExperience: updatedData.yearsExperience === null || updatedData.yearsExperience === undefined
            ? ''
            : String(updatedData.yearsExperience)
        };

        setProfile(nextProfile);
        cacheProfile(nextProfile);
      } catch (err) {
        console.error('Profile save error:', err);
        setError(err.message || 'Failed to save profile. Please try again.');
        setSaving(false);
        return;
      }
    }

    setEditing(false);
    setSaving(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (logoutError) {
      console.error('Logout error:', logoutError);
    }

    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentRole');
    localStorage.removeItem('targetRole');
    localStorage.removeItem('yearsExperience');
    router.push('/login');
  };

  if (loading) {
    return (
      <>
        <header className="mb-8">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-on-surface font-headline">Profile Management</h1>
          <p className="text-on-surface-variant">Manage your account settings and preferences</p>
        </header>
        <div className="grid max-w-6xl grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-4">
            <div className="app-card animate-pulse p-8">
              <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 h-20 w-20 rounded-full bg-primary/10"></div>
                <div className="mb-2 h-6 w-32 rounded bg-surface-container-high"></div>
                <div className="h-4 w-48 rounded bg-surface-container-high"></div>
              </div>
              <div className="space-y-4 border-t border-outline/20 pt-6">
                <div className="h-12 rounded bg-surface-container-high"></div>
                <div className="h-12 rounded bg-surface-container-high"></div>
                <div className="h-12 rounded bg-surface-container-high"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-on-surface font-headline">Profile Management</h1>
        <p className="text-on-surface-variant">Manage your account settings and preferences</p>
      </header>

      <div className="grid max-w-6xl grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4">
          <div className="app-card p-8">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-container/20">
                <span className="material-symbols-outlined text-5xl text-primary">person</span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface">{profile.name}</h2>
              <p className="mt-1 text-sm text-on-surface-variant">{profile.email}</p>
            </div>

            <div className="space-y-4 border-t border-outline/20 pt-6">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary">briefcase</span>
                <div>
                  <p className="text-xs uppercase text-on-surface-variant/70">Current Role</p>
                  <p className="font-semibold">{profile.currentRole || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary">trending_up</span>
                <div>
                  <p className="text-xs uppercase text-on-surface-variant/70">Target Role</p>
                  <p className="font-semibold">{profile.targetRole || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <div>
                  <p className="text-xs uppercase text-on-surface-variant/70">Experience</p>
                  <p className="font-semibold">{profile.yearsExperience ? `${profile.yearsExperience} years` : '—'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3 border-t border-outline/20 pt-6">
              <button
                onClick={() => {
                  setEditing(!editing);
                  setError('');
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-container py-2 font-bold text-white transition-all hover:brightness-110"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit
              </button>
              <button
                onClick={handleLogout}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500/20 py-2 font-bold text-red-400 transition-all hover:bg-red-500/30"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Logout
              </button>
            </div>
          </div>
        </div>

        {editing && (
          <div className="col-span-12 lg:col-span-8">
            <div className="app-card p-8">
              <h3 className="mb-6 text-xl font-bold text-on-surface">Edit Profile</h3>

              {error && (
                <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              <form className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-on-surface-variant">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="app-input"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-on-surface-variant">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="app-input cursor-not-allowed opacity-70"
                  />
                  <p className="mt-1 text-xs text-on-surface-variant/70">Email is managed by your authentication provider</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-on-surface-variant">Current Role</label>
                  <input
                    type="text"
                    name="currentRole"
                    value={profile.currentRole}
                    onChange={handleChange}
                    className="app-input"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-on-surface-variant">Target Role</label>
                  <input
                    type="text"
                    name="targetRole"
                    value={profile.targetRole}
                    onChange={handleChange}
                    className="app-input"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-on-surface-variant">Years of Experience</label>
                  <input
                    type="number"
                    name="yearsExperience"
                    value={profile.yearsExperience}
                    onChange={handleChange}
                    className="app-input"
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 rounded-lg bg-secondary py-3 font-bold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setError('');
                    }}
                    disabled={saving}
                    className="flex-1 rounded-lg bg-surface-container-high py-3 font-bold text-on-surface transition-all hover:bg-surface-container-highest disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="col-span-12 lg:col-span-8">
          <div className="app-card space-y-6 p-8">
            <h3 className="text-xl font-bold text-on-surface">Account Settings</h3>

            <div className="space-y-4">
              <button className="flex w-full items-center justify-between rounded-lg bg-surface p-4 transition-all hover:bg-surface-container-high">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">notification_important</span>
                  <span className="font-semibold text-on-surface">Notifications</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant/70">chevron_right</span>
              </button>

              <button className="flex w-full items-center justify-between rounded-lg bg-surface p-4 transition-all hover:bg-surface-container-high">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">security</span>
                  <span className="font-semibold text-on-surface">Security & Privacy</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant/70">chevron_right</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="w-full rounded-lg border border-primary/15 bg-primary/5 p-4 text-left transition-all hover:border-primary/30 hover:bg-primary/10"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">palette</span>
                    <div>
                      <span className="block font-semibold text-on-surface">Appearance</span>
                      <span className="text-sm text-on-surface-variant">
                        {theme === 'light' ? 'Light mode is active.' : 'Dark mode is active.'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <span className="text-sm font-semibold">
                      {theme === 'light' ? 'Switch to dark' : 'Switch to light'}
                    </span>
                    <span className="material-symbols-outlined">chevron_right</span>
                  </div>
                </div>
              </button>

              <button className="flex w-full items-center justify-between rounded-lg bg-surface p-4 transition-all hover:bg-surface-container-high">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">help</span>
                  <span className="font-semibold text-on-surface">Help & Support</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant/70">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
