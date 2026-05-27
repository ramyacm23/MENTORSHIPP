'use client';

import { useState } from 'react';
import { safeApiFetch, API_URLS } from '@/lib/api';

const companies = [
  { name: 'Google', badge: 'G', difficulty: 9 },
  { name: 'Amazon', badge: 'A', difficulty: 8 },
  { name: 'Meta', badge: 'M', difficulty: 9 },
  { name: 'Microsoft', badge: 'MS', difficulty: 7 },
  { name: 'Apple', badge: 'AP', difficulty: 8 },
  { name: 'TCS', badge: 'TCS', difficulty: 4 },
  { name: 'Infosys', badge: 'INF', difficulty: 4 },
];

export default function CompanyIntelligence() {
  const [selectedCompany, setSelectedCompany] = useState('Google');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [intelligence, setIntelligence] = useState(null);
  const [loading, setLoading] = useState(false);

  const getIntelligence = async (company) => {
    setSelectedCompany(company);
    setLoading(true);
    try {
      const data = await safeApiFetch(`${API_URLS.PYTHON}/intelligence/company`, {
        method: 'POST',
        body: JSON.stringify({
          company_name: company,
          target_role: targetRole,
        }),
      });

      if (data) {
        setIntelligence(data);
      } else {
        setIntelligence(null);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Company Intelligence</h1>
        <p className="text-on-surface-variant">Hiring patterns, interview difficulty, and preparation paths</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Company Selector */}
        <div className="col-span-12">
          <div className="bg-surface rounded-xl p-6 border border-outline/20">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Select Company</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {companies.map((company) => (
                <button
                  key={company.name}
                  onClick={() => getIntelligence(company.name)}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    selectedCompany === company.name
                      ? 'border-secondary bg-secondary/10'
                      : 'border-outline hover:border-primary'
                  }`}
                >
                  <span className="flex h-10 min-w-10 items-center justify-center rounded-full bg-surface-container-high px-2 text-xs font-bold text-primary">
                    {company.badge}
                  </span>
                  <span className="text-xs font-bold text-on-surface">{company.name}</span>
                  <span className={`text-xs font-semibold ${company.difficulty > 7 ? 'text-red-400' : company.difficulty > 5 ? 'text-yellow-400' : 'text-secondary'}`}>
                    {company.difficulty}/10
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Target Role Selector */}
        <div className="col-span-12">
          <div className="bg-surface rounded-xl p-6 border border-outline/20">
            <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-3">Target Role</label>
            <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="w-full md:w-64 p-3 bg-surface border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary">
              <option>Software Engineer</option>
              <option>Senior Engineer</option>
              <option>Product Manager</option>
              <option>Data Scientist</option>
              <option>DevOps Engineer</option>
            </select>
          </div>
        </div>

        {/* Company Intelligence Display */}
        {intelligence && (
          <>
            {/* Difficulty Meter */}
            <div className="col-span-12 md:col-span-6">
              <div className="bg-surface rounded-xl p-8 border border-outline/20">
                <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">speed</span>
                  Difficulty Level
                </h3>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-on-surface-variant">Interview Difficulty</span>
                    <span className="text-2xl font-black text-primary-container">{intelligence.difficulty}/10</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden border border-outline">
                    <div style={{ width: `${intelligence.difficulty * 10}%` }} className={`h-full transition-all duration-500 ${intelligence.difficulty > 7 ? 'bg-red-500' : intelligence.difficulty > 5 ? 'bg-yellow-500' : 'bg-secondary'}`}></div>
                  </div>
                </div>

                <p className="text-on-surface-variant text-sm">{intelligence.pattern}</p>
              </div>
            </div>

            {/* Hiring Rate */}
            <div className="col-span-12 md:col-span-6">
              <div className="bg-surface rounded-xl p-8 border border-outline/20">
                <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">trending_up</span>
                  Hiring Metrics
                </h3>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-on-surface-variant font-semibold block mb-2">Hiring Rate</span>
                    <span className="text-3xl font-black text-secondary">{intelligence.hiring_rate}</span>
                  </div>
                  <div>
                    <span className="text-sm text-on-surface-variant font-semibold block mb-2">Match Score</span>
                    <span className="text-2xl font-bold text-primary">{intelligence.match_score}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prep Roadmap */}
            <div className="col-span-12">
              <div className="bg-surface rounded-xl p-8 border border-outline/20">
                <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container">map</span>
                  Preparation Roadmap for {selectedCompany}
                </h3>

                <div className="space-y-4">
                  {[
                    { week: 'Week 1-2', focus: 'Foundation: Data Structures & Algorithms', tasks: ['Learn arrays, linked lists', 'Practice 20 LeetCode problems'] },
                    { week: 'Week 3-4', focus: intelligence.pattern.includes('DSA') ? 'DSA Deep Dive' : 'System Design Fundamentals', tasks: ['Master complex problems', 'Study design patterns'] },
                    { week: 'Week 5-6', focus: intelligence.pattern.includes('DSA') ? 'System Design' : 'Behavioral Prep', tasks: ['Design Twitter/YouTube', 'Mock interviews'] },
                    { week: 'Week 7-8', focus: 'Final Prep & Mock Interviews', tasks: ['Full mock interviews', 'Review weak areas', 'Company-specific prep'] },
                  ].map((stage, idx) => (
                    <div key={idx} className="p-6 bg-surface rounded-lg border border-primary/20 hover:border-primary/40 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-primary text-white flex items-center justify-center font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{stage.week}</p>
                          <h4 className="text-lg font-bold text-on-surface mb-2">{stage.focus}</h4>
                          <ul className="space-y-1">
                            {stage.tasks.map((task, tIdx) => (
                              <li key={tIdx} className="text-sm text-on-surface-variant flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="col-span-12">
              <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl p-8 border border-secondary/20">
                <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">recommendation</span>
                  AI Recommendation
                </h3>
                <p className="text-on-surface-variant">{intelligence.recommendation}</p>
              </div>
            </div>
          </>
        )}

        {loading && (
          <div className="col-span-12">
            <div className="bg-surface rounded-xl p-12 border border-outline/20 text-center">
              <span className="material-symbols-outlined text-4xl text-primary animate-spin block mb-4">autorenew</span>
              <p className="text-on-surface-variant">Fetching company intelligence...</p>
            </div>
          </div>
        )}

        {!intelligence && !loading && (
          <div className="col-span-12">
            <div className="bg-surface rounded-xl p-12 border border-outline/20 text-center">
              <span className="material-symbols-outlined text-6xl text-primary opacity-50 block mb-4">business</span>
              <p className="text-on-surface-variant text-lg">Select a company to view detailed intelligence and preparation roadmap</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}



