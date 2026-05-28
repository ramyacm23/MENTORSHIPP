'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { API_URLS, safeApiFetch } from '@/lib/api';

export default function Profile() {
  const [profile, setProfile] = useState({ name: '', email: '', currentRole: '', targetRole: '', yearsExperience: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem('userToken');

      if (token) {
        // Fetch profile from backend API
        const data = await safeApiFetch(`${API_URLS.NODE}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data && data.name) {
          setProfile({
            name: data.name,
            email: data.email || '',
            currentRole: data.currentRole || '',
            targetRole: data.targetRole || '',
            yearsExperience: data.yearsExperience || ''
          });
          // Cache in localStorage for offline/fallback use
          localStorage.setItem('userName', data.name);
          localStorage.setItem('userEmail', data.email || '');
          localStorage.setItem('currentRole', data.currentRole || '');
          localStorage.setItem('targetRole', data.targetRole || '');
          localStorage.setItem('yearsExperience', data.yearsExperience || '');
          setLoading(false);
          return;
        }
      }

      // Fallback to localStorage if API is unavailable or user is unauthenticated
      const name = localStorage.getItem('userName') || 'User';
      const email = localStorage.getItem('userEmail') || '';
      const currentRole = localStorage.getItem('currentRole') || '';
      const targetRole = localStorage.getItem('targetRole') || '';
      const yearsExperience = localStorage.getItem('yearsExperience') || '';
      setProfile({ name, email, currentRole, targetRole, yearsExperience });
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

        // Update local state with server response
        setProfile({
          name: updatedData.name,
          email: updatedData.email || profile.email,
          currentRole: updatedData.currentRole || '',
          targetRole: updatedData.targetRole || '',
          yearsExperience: updatedData.yearsExperience || ''
        });

        // Update localStorage cache
        localStorage.setItem('userName', updatedData.name);
        localStorage.setItem('currentRole', updatedData.currentRole || '');
        localStorage.setItem('targetRole', updatedData.targetRole || '');
        localStorage.setItem('yearsExperience', updatedData.yearsExperience || '');

        setEditing(false);
        setSaving(false);
        return;
      } catch (err) {
        console.error('Profile save error:', err);
        setError(err.message || 'Failed to save profile. Please try again.');
        setSaving(false);
        return;
      }
    }

    // Fallback: save to localStorage only if no token available
    localStorage.setItem('userName', profile.name);
    localStorage.setItem('userEmail', profile.email);
    localStorage.setItem('currentRole', profile.currentRole);
    localStorage.setItem('targetRole', profile.targetRole);
    localStorage.setItem('yearsExperience', profile.yearsExperience);
    setEditing(false);
    setSaving(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
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
          <h1 className="text-4xl font-extrabold font-headline tracking-tight text-[#B9B9B9] mb-2">Profile Management</h1>
          <p className="text-[#b9c8de]">Manage your account settings and preferences</p>
        </header>
        <div className="grid grid-cols-12 gap-8 max-w-6xl">
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-[#000000] rounded-xl p-8 border border-slate-800/20 animate-pulse">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-[#4d8eff]/10 mb-4"></div>
                <div className="h-6 w-32 bg-slate-700/50 rounded mb-2"></div>
                <div className="h-4 w-48 bg-slate-700/30 rounded"></div>
              </div>
              <div className="space-y-4 pt-6 border-t border-slate-800/20">
                <div className="h-12 bg-slate-700/20 rounded"></div>
                <div className="h-12 bg-slate-700/20 rounded"></div>
                <div className="h-12 bg-slate-700/20 rounded"></div>
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
        <h1 className="text-4xl font-extrabold font-headline tracking-tight text-[#B9B9B9] mb-2">Profile Management</h1>
        <p className="text-[#b9c8de]">Manage your account settings and preferences</p>
      </header>

      <div className="grid grid-cols-12 gap-8 max-w-6xl">
        {/* Profile Card */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-[#000000] rounded-xl p-8 border border-slate-800/20">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-[#4d8eff]/20 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#adc6ff] text-5xl">person</span>
              </div>
              <h2 className="text-2xl font-bold text-[#B9B9B9]">{profile.name}</h2>
              <p className="text-[#b9c8de] text-sm mt-1">{profile.email}</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-800/20">
              <div className="flex items-center gap-3 text-[#c2c6d6]">
                <span className="material-symbols-outlined text-[#adc6ff]">briefcase</span>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Current Role</p>
                  <p className="font-semibold">{profile.currentRole || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#c2c6d6]">
                <span className="material-symbols-outlined text-[#adc6ff]">trending_up</span>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Target Role</p>
                  <p className="font-semibold">{profile.targetRole || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#c2c6d6]">
                <span className="material-symbols-outlined text-[#adc6ff]">schedule</span>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Experience</p>
                  <p className="font-semibold">{profile.yearsExperience ? `${profile.yearsExperience} years` : '—'}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-slate-800/20">
              <button
                onClick={() => { setEditing(!editing); setError(''); }}
                className="flex-1 py-2 bg-[#4d8eff] hover:brightness-110 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {editing && (
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-[#000000] rounded-xl p-8 border border-slate-800/20">
              <h3 className="text-xl font-bold text-[#B9B9B9] mb-6">Edit Profile</h3>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm mb-6">
                  {error}
                </div>
              )}

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#c2c6d6] uppercase tracking-widest mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#000000] border border-slate-700 rounded-lg text-[#B9B9B9] focus:outline-none focus:border-[#adc6ff]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#c2c6d6] uppercase tracking-widest mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="w-full p-3 bg-[#000000] border border-slate-700 rounded-lg text-[#B9B9B9]/50 focus:outline-none cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">Email is managed by your authentication provider</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#c2c6d6] uppercase tracking-widest mb-2">Current Role</label>
                  <input
                    type="text"
                    name="currentRole"
                    value={profile.currentRole}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#000000] border border-slate-700 rounded-lg text-[#B9B9B9] focus:outline-none focus:border-[#adc6ff]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#c2c6d6] uppercase tracking-widest mb-2">Target Role</label>
                  <input
                    type="text"
                    name="targetRole"
                    value={profile.targetRole}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#000000] border border-slate-700 rounded-lg text-[#B9B9B9] focus:outline-none focus:border-[#adc6ff]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#c2c6d6] uppercase tracking-widest mb-2">Years of Experience</label>
                  <input
                    type="number"
                    name="yearsExperience"
                    value={profile.yearsExperience}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#000000] border border-slate-700 rounded-lg text-[#B9B9B9] focus:outline-none focus:border-[#adc6ff]"
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-3 bg-[#4edea3] hover:brightness-110 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditing(false); setError(''); }}
                    disabled={saving}
                    className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Account Settings */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-[#000000] rounded-xl p-8 border border-slate-800/20 space-y-6">
            <h3 className="text-xl font-bold text-[#B9B9B9]">Account Settings</h3>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-[#000000] hover:bg-[#222a3d] rounded-lg transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#adc6ff]">notification_important</span>
                  <span className="text-[#B9B9B9] font-semibold">Notifications</span>
                </div>
                <span className="material-symbols-outlined text-slate-500">chevron_right</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-[#000000] hover:bg-[#222a3d] rounded-lg transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#adc6ff]">security</span>
                  <span className="text-[#B9B9B9] font-semibold">Security & Privacy</span>
                </div>
                <span className="material-symbols-outlined text-slate-500">chevron_right</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-[#000000] hover:bg-[#222a3d] rounded-lg transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#adc6ff]">palette</span>
                  <span className="text-[#B9B9B9] font-semibold">Appearance</span>
                </div>
                <span className="material-symbols-outlined text-slate-500">chevron_right</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-[#000000] hover:bg-[#222a3d] rounded-lg transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#adc6ff]">help</span>
                  <span className="text-[#B9B9B9] font-semibold">Help & Support</span>
                </div>
                <span className="material-symbols-outlined text-slate-500">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
