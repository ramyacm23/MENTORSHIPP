'use client';

import { useState } from 'react';

export default function ProgressIntelligence() {
  const [tasksCompleted, setTasksCompleted] = useState('8');
  const [totalTasks, setTotalTasks] = useState('10');
  const [daysActive, setDaysActive] = useState('5');
  const [totalDays, setTotalDays] = useState('7');
  const [prediction, setPrediction] = useState(null);
  const [risks, setRisks] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzePrediction = async () => {
    console.log('Get Prediction button clicked');
    setLoading(true);
    
    // First, set demo prediction immediately
    const demoPrediction = {
      current_placement_chance: 72.5,
      trend: 'Improving',
      completion_rate: '80%',
      consistency_rate: '71%',
      prediction: 'At this rate, 73% placement chance by target date',
    };
    const demoRisks = {
      risk_level: 'low',
      alerts: [],
    };
    
    setPrediction(demoPrediction);
    setRisks(demoRisks);
    setLoading(false);
    
    // Then try to fetch from backend
    try {
      console.log('Fetching prediction from backend...');
      const data = await safeApiFetch(`${API_URLS.PYTHON}/progress/predict`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: 'demo-user',
          tasks_completed: parseInt(tasksCompleted),
          total_tasks: parseInt(totalTasks),
          days_active: parseInt(daysActive),
          total_days: parseInt(totalDays),
        }),
      });

      if (data) {
        console.log('Prediction data:', data);
        setPrediction(data);
      }

      // Get risk analysis
      const riskData = await safeApiFetch(`${API_URLS.PYTHON}/risk/detect`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: 'demo-user',
          tasks_completed: parseInt(tasksCompleted),
          total_tasks: parseInt(totalTasks),
          days_active: parseInt(daysActive),
          total_days: parseInt(totalDays),
        }),
      });

      if (riskData) {
        console.log('Risk data:', riskData);
        setRisks(riskData);
      }
    } catch (error) {
      console.log('Error fetching from backend:', error.message);
    }
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Progress Intelligence</h1>
        <p className="text-on-surface-variant">Real-time placement prediction and predictive analytics</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-surface rounded-xl p-8 border border-outline/20 space-y-6 sticky top-24">
            <h2 className="text-xl font-bold text-on-surface">Track Progress</h2>

            <div>
              <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-2">Tasks Completed</label>
              <input
                value={tasksCompleted}
                onChange={(e) => setTasksCompleted(e.target.value)}
                type="number"
                className="w-full p-3 bg-surface border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-2">Total Tasks</label>
              <input
                value={totalTasks}
                onChange={(e) => setTotalTasks(e.target.value)}
                type="number"
                className="w-full p-3 bg-surface border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-2">Days Active This Week</label>
              <input
                value={daysActive}
                onChange={(e) => setDaysActive(e.target.value)}
                type="number"
                className="w-full p-3 bg-surface border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-2">Total Days in Period</label>
              <input
                value={totalDays}
                onChange={(e) => setTotalDays(e.target.value)}
                type="number"
                className="w-full p-3 bg-surface border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <button
              onClick={analyzePrediction}
              disabled={loading}
              className="w-full py-3 bg-secondary hover:brightness-110 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">{loading ? 'autorenew' : 'analytics'}</span>
              {loading ? 'Analyzing...' : 'Get Prediction'}
            </button>
          </div>
        </div>

        {/* Results */}
        {prediction && (
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Placement Prediction */}
            <div className="bg-surface rounded-xl p-8 border border-outline/20">
              <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">target</span>
                Placement Prediction
              </h3>

              <div className="mb-6">
                <div className="flex items-end justify-between mb-3">
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-secondary">{prediction.current_placement_chance}%</span>
                  <span className="text-lg font-bold text-secondary">{prediction.trend}</span>
                </div>

                <div className="w-full bg-surface-container-highest rounded-full h-4 overflow-hidden border border-outline">
                  <div style={{ width: `${prediction.current_placement_chance}%` }} className="h-full bg-gradient-to-r from-primary-container to-secondary transition-all duration-500"></div>
                </div>
              </div>

              <p className="text-on-surface-variant">{prediction.prediction}</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface rounded-xl p-6 border border-outline/20">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Completion Rate</p>
                <p className="text-4xl font-black text-primary">{prediction.completion_rate}</p>
              </div>

              <div className="bg-surface rounded-xl p-6 border border-outline/20">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Consistency Rate</p>
                <p className="text-4xl font-black text-secondary">{prediction.consistency_rate}</p>
              </div>
            </div>

            {/* Risk Assessment */}
            {risks && (
              <div className={`bg-surface rounded-xl p-8 border ${risks.risk_level === 'high' ? 'border-red-500/40' : risks.risk_level === 'medium' ? 'border-yellow-500/40' : 'border-secondary/40'}`}>
                <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className={`material-symbols-outlined ${risks.risk_level === 'high' ? 'text-red-400' : risks.risk_level === 'medium' ? 'text-yellow-400' : 'text-secondary'}`}>
                    {risks.risk_level === 'high' ? 'warning' : risks.risk_level === 'medium' ? 'info' : 'verified'}
                  </span>
                  Risk Assessment: <span className="capitalize">{risks.risk_level}</span>
                </h3>

                {risks.alerts && risks.alerts.length > 0 ? (
                  <ul className="space-y-2">
                    {risks.alerts.map((alert, idx) => (
                      <li key={idx} className="text-sm text-on-surface">
                        {alert}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-secondary">You're on track! Keep up the great work.</p>
                )}
              </div>
            )}

            {/* Tips */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8 border border-primary/20">
              <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                Recommendations
              </h3>

              <ul className="space-y-2">
                <li className="text-sm text-on-surface">-&gt; Maintain consistency - 6+ active days per week</li>
                <li className="text-sm text-on-surface">-&gt; Focus on System Design topics this week</li>
                <li className="text-sm text-on-surface">-&gt; Complete at least 10 mock interviews before deadline</li>
              </ul>
            </div>
          </div>
        )}

        {!prediction && !loading && (
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-surface rounded-xl p-12 border border-outline/20 text-center">
              <span className="material-symbols-outlined text-6xl text-primary opacity-50 block mb-4">trending_up</span>
              <p className="text-on-surface-variant text-lg">Enter your progress metrics to get AI-powered placement predictions</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


