'use client';

import { useState } from 'react';

const leaderboardData = [
  { rank: 1, name: 'Alex Chen', xp: 4500, level: 'Elite', streak: 45 },
  { rank: 2, name: 'Sarah Johnson', xp: 4200, level: 'Pro', streak: 38 },
  { rank: 3, name: 'Priya Sharma', xp: 3950, level: 'Advanced', streak: 32 },
  { rank: 4, name: 'You', xp: 2850, level: 'Intermediate', streak: 12, isUser: true },
  { rank: 5, name: 'James Cooper', xp: 2600, level: 'Intermediate', streak: 18 },
  { rank: 6, name: 'Lisa Wang', xp: 2300, level: 'Beginner', streak: 8 },
];

export default function Gamification() {
  const [activeTab, setActiveTab] = useState('leaderboard');

  const userStats = {
    xp: 2850,
    level: 'Intermediate',
    streak: 12,
    nextLevelXp: 3500,
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Gamification & Achievements</h1>
        <p className="text-on-surface-variant">Track progress, earn XP, climb levels, and compete on the leaderboard</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* User Stats */}
        <div className="col-span-12">
          <div className="bg-gradient-to-r from-primary-container/20 to-secondary/20 rounded-xl p-8 border border-primary/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Total XP</p>
                <p className="text-4xl font-black text-primary">{userStats.xp}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Level</p>
                <p className="text-3xl font-black text-secondary">{userStats.level}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Current Streak</p>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">{userStats.streak}d</p>
              </div>

              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Progress to Next</p>
                <p className="text-lg font-bold text-on-surface">{userStats.xp}/{userStats.nextLevelXp}</p>
                <div className="w-full bg-surface-container-highest rounded-full h-2 mt-2 overflow-hidden">
                  <div style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }} className="h-full bg-gradient-to-r from-primary-container to-secondary"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="col-span-12">
          <div className="flex border-b border-outline/20 bg-surface rounded-t-xl overflow-hidden">
            {[
              { id: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
              { id: 'achievements', label: 'Achievements', icon: 'trophy' },
              { id: 'levels', label: 'Levels & XP', icon: 'auto_awesome' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-surface rounded-b-xl border border-t-0 border-outline/20 p-6">
            {/* Leaderboard */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-3">
                {leaderboardData.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      user.isUser
                        ? 'bg-secondary/10 border-secondary/40'
                        : 'bg-surface border-outline hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${user.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' : user.rank === 2 ? 'bg-slate-500/20 text-on-surface-variant/90' : user.rank === 3 ? 'bg-orange-500/20 text-orange-400' : 'bg-secondary/10 text-secondary'}`}>
                        {user.rank}
                      </div>

                      <div className="flex-1">
                        <p className="font-bold text-on-surface">{user.name}</p>
                        <p className="text-xs text-on-surface-variant">{user.level}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <p className="text-2xl font-black text-primary">{user.xp}</p>
                        <p className="text-xs text-on-surface-variant">XP</p>
                      </div>

                      <div>
                        <p className="text-lg font-bold text-orange-400">{user.streak}d</p>
                        <p className="text-xs text-on-surface-variant">streak</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Achievements */}
            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[ 
                  { icon: 'ads_click', title: 'First Interview', desc: 'Complete your first mock interview' },
                  { icon: 'trending_up', title: 'Rising Star', desc: 'Reach 50% placement probability' },
                  { icon: 'local_fire_department', title: '7-Day Warrior', desc: 'Maintain a 7-day activity streak' },
                  { icon: 'workspace_premium', title: 'ATS Master', desc: 'Achieve 85+ ATS score on resume' },
                  { icon: 'military_tech', title: 'Leaderboard Top 10', desc: 'Reach top 10 on leaderboard', locked: true },
                  { icon: 'rocket_launch', title: 'Rocket Start', desc: 'Earn 1000 XP in first week', locked: true },
                ].map((achievement, idx) => (
                  <div key={idx} className={`p-6 rounded-lg border ${achievement.locked ? 'bg-surface/50 border-outline/50 opacity-50' : 'bg-surface border-secondary/20'}`}>
                    <span className="material-symbols-outlined mb-2 block text-4xl text-primary">{achievement.icon}</span>
                    <p className="font-bold text-on-surface mb-1">{achievement.title}</p>
                    <p className="text-xs text-on-surface-variant">{achievement.desc}</p>
                    {achievement.locked && <p className="mt-2 text-xs text-on-surface-variant/70">Locked</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Levels */}
            {activeTab === 'levels' && (
              <div className="space-y-6">
                {[
                  { level: 'Beginner', range: '0-1000 XP', color: 'from-green-400 to-emerald-500', current: false },
                  { level: 'Intermediate', range: '1000-3000 XP', color: 'from-blue-400 to-cyan-500', current: true },
                  { level: 'Advanced', range: '3000-6000 XP', color: 'from-purple-400 to-pink-500', current: false },
                  { level: 'Pro', range: '6000-10000 XP', color: 'from-orange-400 to-red-500', current: false },
                  { level: 'Elite', range: '10000+ XP', color: 'from-yellow-400 to-orange-500', current: false },
                ].map((item, idx) => (
                  <div key={idx} className={`p-6 rounded-lg border ${item.current ? 'bg-secondary/10 border-secondary/40' : 'bg-surface border-outline'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className={`font-bold text-lg bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>{item.level}</p>
                        <p className="text-xs text-on-surface-variant">{item.range}</p>
                      </div>
                      {item.current && <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs font-bold rounded-full">Your Level</span>}
                    </div>

                    <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                      <div style={{ width: item.current ? '85%' : '0%' }} className={`h-full bg-gradient-to-r ${item.color}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* XP Sources */}
        <div className="col-span-12">
          <div className="bg-surface rounded-xl p-8 border border-outline/20">
            <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">stars</span>
              How to Earn XP
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { action: 'Daily Login', xp: '+10 XP', icon: 'calendar_month' },
                { action: 'Complete Task', xp: '+50 XP', icon: 'task_alt' },
                { action: 'Mock Interview', xp: '+150 XP', icon: 'mic' },
                { action: 'Resume Analysis', xp: '+75 XP', icon: 'description' },
                { action: 'Top Leaderboard', xp: '+500 XP', icon: 'military_tech' },
                { action: 'Streak Bonus', xp: '+20 XP/day', icon: 'local_fire_department' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-surface rounded-lg border border-outline">
                  <span className="material-symbols-outlined mb-2 block text-2xl text-primary">{item.icon}</span>
                  <p className="font-bold text-on-surface mb-1">{item.action}</p>
                  <p className="text-lg font-bold text-secondary">{item.xp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


