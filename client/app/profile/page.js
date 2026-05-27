'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useTheme } from '@/app/context/ThemeContext';
import { auth } from '@/lib/firebase';

export default function Profile() {
  const [profile, setProfile] = useState({ name: '', email: '', currentRole: '', targetRole: '', yearsExperience: '' });
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'User';
    const email = localStorage.getItem('userEmail') || '';
    const currentRole = localStorage.getItem('currentRole') || 'Mid-Level Engineer';
    const targetRole = localStorage.getItem('targetRole') || 'Senior Architect';
    const yearsExperience = localStorage.getItem('yearsExperience') || '8';
    setProfile({ name, email, currentRole, targetRole, yearsExperience });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem('userName', profile.name);
    localStorage.setItem('userEmail', profile.email);
    localStorage.setItem('currentRole', profile.currentRole);
    localStorage.setItem('targetRole', profile.targetRole);
    localStorage.setItem('yearsExperience', profile.yearsExperience);
    setEditing(false);
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
    router.push('/login');
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Profile Management</h1>
        <p className="text-on-surface-variant">Manage your account settings and preferences</p>
      </header>

      <div className="grid grid-cols-12 gap-8 max-w-6xl">
        {/* Profile Card */}
        <div className="col-span-12 lg:col-span-4">
          <div className="app-card p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary-container/20 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-5xl">person</span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface">{profile.name}</h2>
              <p className="text-on-surface-variant text-sm mt-1">{profile.email}</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-outline/20">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary">briefcase</span>
                <div>
                  <p className="text-xs text-on-surface-variant/70 uppercase">Current Role</p>
                  <p className="font-semibold">{profile.currentRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary">trending_up</span>
                <div>
                  <p className="text-xs text-on-surface-variant/70 uppercase">Target Role</p>
                  <p className="font-semibold">{profile.targetRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <div>
                  <p className="text-xs text-on-surface-variant/70 uppercase">Experience</p>
                  <p className="font-semibold">{profile.yearsExperience} years</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-outline/20">
              <button
                onClick={() => setEditing(!editing)}
                className="flex-1 py-2 bg-primary-container hover:brightness-110 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
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
            <div className="app-card p-8">
              <h3 className="text-xl font-bold text-on-surface mb-6">Edit Profile</h3>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="app-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="app-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-2">Current Role</label>
                  <input
                    type="text"
                    name="currentRole"
                    value={profile.currentRole}
                    onChange={handleChange}
                    className="app-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-2">Target Role</label>
                  <input
                    type="text"
                    name="targetRole"
                    value={profile.targetRole}
                    onChange={handleChange}
                    className="app-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-2">Years of Experience</label>
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
                    className="flex-1 py-3 bg-secondary hover:brightness-110 text-white font-bold rounded-lg transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex-1 rounded-lg bg-surface-container-high py-3 font-bold text-on-surface transition-all hover:bg-surface-container-highest"
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
          <div className="app-card space-y-6 p-8">
            <h3 className="text-xl font-bold text-on-surface">Account Settings</h3>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between rounded-lg bg-surface p-4 transition-all hover:bg-surface-container-high">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">notification_important</span>
                  <span className="text-on-surface font-semibold">Notifications</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant/70">chevron_right</span>
              </button>

              <button className="w-full flex items-center justify-between rounded-lg bg-surface p-4 transition-all hover:bg-surface-container-high">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">security</span>
                  <span className="text-on-surface font-semibold">Security & Privacy</span>
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

              <button className="w-full flex items-center justify-between rounded-lg bg-surface p-4 transition-all hover:bg-surface-container-high">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">help</span>
                  <span className="text-on-surface font-semibold">Help & Support</span>
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


