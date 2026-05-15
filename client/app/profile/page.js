'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Profile() {
  const [profile, setProfile] = useState({ name: '', email: '', currentRole: '', targetRole: '', yearsExperience: '' });
  const [editing, setEditing] = useState(false);
  const router = useRouter();

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
                  <p className="font-semibold">{profile.currentRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#c2c6d6]">
                <span className="material-symbols-outlined text-[#adc6ff]">trending_up</span>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Target Role</p>
                  <p className="font-semibold">{profile.targetRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#c2c6d6]">
                <span className="material-symbols-outlined text-[#adc6ff]">schedule</span>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Experience</p>
                  <p className="font-semibold">{profile.yearsExperience} years</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-slate-800/20">
              <button
                onClick={() => setEditing(!editing)}
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
                    onChange={handleChange}
                    className="w-full p-3 bg-[#000000] border border-slate-700 rounded-lg text-[#B9B9B9] focus:outline-none focus:border-[#adc6ff]"
                  />
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
                    className="flex-1 py-3 bg-[#4edea3] hover:brightness-110 text-white font-bold rounded-lg transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all"
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
