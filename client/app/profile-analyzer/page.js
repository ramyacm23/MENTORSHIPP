'use client';

import { useState } from 'react';
import { safeApiFetch, API_URLS } from '@/lib/api';
import s from './roadmap.module.css';

const phases = {
    "Python":{
      colorClass: 'c1',name:"Python",duration: '4–6 weeks', level: 'Beginner',
      topics: ['Syntax & Data Types', 'Control Flow', 'Functions', 'OOP & Classes', 'Modules & Packages', 'File I/O', 'Error Handling', 'List Comprehensions'],
      resources: [
        <a className={s.courses} target="_blank" href="https://pll.harvard.edu/course/cs50s-introduction-programming-python">CS50P – Harvard Python Course (free)</a>,
        <a className={s.courses} target="_blank" href="https://automatetheboringstuff.com/">Automate the Boring Stuff with Python</a>,
        <a className={s.courses} target="_blank" href="https://docs.python.org/3/tutorial/">Python.org Official Tutorial</a>,
        <a className={s.courses} target="_blank" href="https://www.codecademy.com/learn/learn-python-3">Codecademy – Learn Python 3</a>
      ],
      outcomes: ['Write scripts to automate real tasks', 'Build OOP-based programs', 'Ready to use Python for DSA & APIs'],
      deps: [{ label: 'Unlocks →' }, { chip: 'Java' }, { chip: 'DSA' }, { chip: 'SQL' }, { chip: 'APIs' }],
    },
    "Java":{
     colorClass: 'c2',name : "Java", duration: '4–6 weeks', level: 'Beginner',
      topics: ['JVM & Types', 'OOP Principles', 'Interfaces & Generics', 'Collections Framework', 'Streams & Lambdas', 'Concurrency Basics', 'Maven / Gradle'],
      resources: [
        <a className={s.courses} target="_blank" href="https://java-programming.mooc.fi/">MOOC.fi – Java Programming (free, part 1+2)</a>,
        <a className={s.courses} target="_blank" href="https://www.codecademy.com/learn/learn-java">Codecademy – Learn Java</a>,
        <a className={s.courses} target="_blank" href="https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/">Effective Java – Joshua Bloch (book)</a>,
        <a className={s.courses} target="_blank" href="https://www.jetbrains.com/academy/">JetBrains Academy – Java track</a>
      ],
      outcomes: ['Implement strong OOP design patterns', 'Understand JVM memory model', 'Ready for Spring Boot API development'],
      deps: [{ label: 'Requires →' }, { chip: 'Python (Phase 1)' }, { label: 'Unlocks →' }, { chip: 'DSA' }, { chip: 'APIs (Spring Boot)' }],
    },
    "DSA":{
      colorClass: 'c3', name: 'Data Structures & Algorithms', duration: '8–10 weeks', level: 'Intermediate',
      topics: ['Arrays & Strings', 'Linked Lists', 'Stacks & Queues', 'Trees & Graphs', 'Heaps', 'Sorting Algorithms', 'Recursion & DP', 'Big-O Analysis'],
      resources: [
        <a className={s.courses} target="_blank" href="https://neetcode.io/roadmap">NeetCode 150 — neetcode.io (free)</a>,
        <a className={s.courses} target="_blank" href="https://www.manning.com/books/grokking-algorithms">Grokking Algorithms (book)</a>,
        <a className={s.courses} target="_blank" href="https://leetcode.com/problemset/">LeetCode – Easy → Medium grind</a>,
        <a className={s.courses} target="_blank" href="https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/">MIT 6.006 Intro to Algorithms (YouTube)</a>
      ],
      outcomes: ['Clear FAANG-style coding interviews', 'Pick the right data structure for any problem', 'Reason confidently about complexity'],
      deps: [{ label: 'Requires →' }, { chip: 'Python (Phase 1)' }, { chip: 'Java (Phase 2)' }, { label: 'Unlocks →' }, { chip: 'System Design' }],
    },
    "SQL":{
      colorClass: 'c4', name: 'SQL', duration: '4–5 weeks', level: 'Intermediate',
      topics: ['SELECT & JOINs', 'Aggregations', 'Subqueries & CTEs', 'Schema Design', 'Normalization', 'Indexes', 'ACID & Transactions', 'PostgreSQL'],
      resources: [
        <a className={s.courses} target="_blank" href="https://cs50.harvard.edu/sql/">CS50 SQL – Harvard (free)</a>,
        <a className={s.courses} target="_blank" href="https://sqlzoo.net/wiki/SQL_Tutorial">SQLZoo – interactive exercises</a>,
        <a className={s.courses} target="_blank" href="https://mode.com/sql-tutorial/">Mode Analytics SQL Tutorial</a>,
        <a className={s.courses} target="_blank" href="https://use-the-index-luke.com/">Use The Index, Luke – optimization</a>
      ],
      outcomes: ['Design normalized schemas from scratch', 'Write complex optimized queries', 'Connect a DB to Python / Java apps'],
      deps: [{ label: 'Requires →' }, { chip: 'Python (Phase 1)' }, { label: 'Unlocks →' }, { chip: 'APIs' }, { chip: 'System Design' }],
    },
    "APIs":{
      colorClass: 'c5', name: 'APIs', duration: '4–5 weeks', level: 'Intermediate',
      topics: ['REST Principles', 'HTTP Methods', 'FastAPI / Spring Boot', 'JWT & OAuth2', 'Request Validation', 'OpenAPI / Swagger', 'Rate Limiting'],
      resources: [
        <a className={s.courses} target="_blank" href="https://fastapi.tiangolo.com/">FastAPI Official Docs + Tutorial</a>,
        <a className={s.courses} target="_blank" href="https://www.baeldung.com/rest-with-spring-series">Baeldung – Spring Boot REST (free)</a>,
        <a className={s.courses} target="_blank" href="https://learning.postman.com/">Postman Learning Center</a>,
        <a className={s.courses} target="_blank" href="https://www.youtube.com/results?search_query=freecodecamp+rest+api+course">freeCodeCamp – REST API full course</a>
      ],
      outcomes: ['Build a production REST API with auth', 'Connect API to PostgreSQL via ORM', 'Auto-generate OpenAPI documentation'],
      deps: [{ label: 'Requires →' }, { chip: 'Python or Java' }, { chip: 'SQL (Phase 4)' }, { label: 'Unlocks →' }, { chip: 'React' }, { chip: 'Docker' }],
    },
    "React":{
      colorClass: 'c6', name: 'React', duration: '6–8 weeks', level: 'Intermediate',
      topics: ['Components & JSX', 'Props & State', 'Hooks (useState/useEffect)', 'React Router', 'Context / Zustand', 'Fetching your API', 'TypeScript Basics'],
      resources: [
      <a className={s.courses} target="_blank" href="https://react.dev/">React Official Docs – react.dev</a>,
      <a className={s.courses} target="_blank" href="https://scrimba.com/learn-react-c0e">Scrimba – Learn React for Free</a>,
      <a className={s.courses} target="_blank" href="https://www.youtube.com/results?search_query=Jack+Herrington+React+Hooks">Jack Herrington – React Hooks (YouTube)</a>,
      <a className={s.courses} target="_blank" href="https://www.udemy.com/course/react-the-complete-guide-incl-redux/">Academind – React Complete Guide (Udemy)</a>
    ],
      outcomes: ['Build a full-stack app (React + your API)', 'Manage complex application state', 'Ship a portfolio-worthy project live'],
      deps: [{ label: 'Requires →' }, { chip: 'APIs (Phase 5)' }, { chip: 'JS Basics' }, { label: 'Unlocks →' }, { chip: 'Docker' }],
    },
    "Docker":{
      colorClass: 'c7', name: 'Docker', duration: '3–4 weeks', level: 'Intermediate',
      topics: ['Images & Containers', 'Dockerfile', 'Docker Compose', 'Volumes & Networking', 'Multi-stage Builds', 'Docker Hub / ECR', 'Container Security'],
      resources: [
        <a className={s.courses} target="_blank" href="https://docs.docker.com/get-started/">Docker Official Getting Started</a>,
        <a className={s.courses} target="_blank" href="https://www.youtube.com/results?search_query=TechWorld+with+Nana+Docker">TechWorld with Nana – Docker (YouTube)</a>,
        <a className={s.courses} target="_blank" href="https://labs.play-with-docker.com/">Play with Docker – browser sandbox</a>,
        <a className={s.courses} target="_blank" href="https://www.udemy.com/course/docker-mastery/">Bret Fisher – Docker Mastery (Udemy)</a>
      ],
      outcomes: ['Containerise your full-stack app', 'Orchestrate services with Compose', 'Push production-ready images to a registry'],
      deps: [{ label: 'Requires →' }, { chip: 'APIs (Phase 5)' }, { chip: 'React (Phase 6)' }, { label: 'Unlocks →' }, { chip: 'AWS' }],
    },
    "AWS":{
      colorClass: 'c8', name: 'AWS', duration: '5–6 weeks', level: 'Advanced',
      topics: ['IAM & VPC', 'EC2 & S3', 'RDS & DynamoDB', 'ECS / Fargate', 'Lambda & API Gateway', 'CloudFront CDN', 'CloudWatch & CI/CD'],
      resources: ['AWS Cloud Practitioner Essentials (free)', 'Stephane Maarek – AWS SAA (Udemy)', 'freeCodeCamp – AWS CCP full course', 'AWS Well-Architected Framework docs'],
      outcomes: ['Deploy containerised app to production', 'Set up auto-scaling & monitoring', 'Optionally earn AWS Cloud Practitioner cert'],
      deps: [{ label: 'Requires →' }, { chip: 'Docker (Phase 7)' }, { label: 'Unlocks →' }, { chip: 'System Design' }],
    },
    "System Design":{
      colorClass: 'c9', name: 'System Design', duration: '6–8 weeks', level: 'Advanced',
      topics: ['Scalability Patterns', 'Load Balancers', 'Caching (Redis)', 'SQL vs NoSQL', 'Sharding & Replication', 'Message Queues', 'Microservices', 'CAP Theorem'],
      resources: [
        <a className={s.courses} target="_blank" href="https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials">AWS Cloud Practitioner Essentials (free)</a>,
        <a className={s.courses} target="_blank" href="https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/">Stephane Maarek – AWS SAA (Udemy)</a>,
        <a className={s.courses} target="_blank" href="https://www.youtube.com/results?search_query=freeCodeCamp+AWS+Cloud+Practitioner+full+course">freeCodeCamp – AWS CCP full course</a>,
        <a className={s.courses} target="_blank" href="https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html">AWS Well-Architected Framework docs</a>
      ],
      outcomes: ['Design systems like Twitter, YouTube, Uber', 'Ace senior / staff engineer interviews', 'Make confident architecture trade-offs'],
      deps: [{ label: 'Requires →' }, { chip: 'DSA (Phase 3)' }, { chip: 'SQL (Phase 4)' }, { chip: 'APIs (Phase 5)' }, { chip: 'AWS (Phase 8)' }],
    },
  };

function PhaseBlock({ num, colorClass, name, duration, level, topics, resources, outcomes, deps }) {
  return (
    <div className={`${s.phaseBlock} ${s[colorClass]}`}>
      <div className={s.phaseAccent} />

      <div className={s.phaseHeader}>
        <div className={s.phLeft}>
          <div className={s.phaseNum}>{num}</div>
          <div>
            <div className={s.phaseLabel}>Phase {num}</div>
            <div className={s.phaseName}>{name}</div>
          </div>
        </div>
        <div className={s.phRight}>
          <div className={`${s.badge} ${s.badgeDur}`}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>schedule</span>
            {duration}
          </div>
          <div className={`${s.badge} ${s.badgeLvl}`}>{level}</div>
        </div>
      </div>

      <div className={s.phaseBody}>
        {/* Topics */}
        <div className={s.pcol}>
          <div className={s.colLbl}>
            <span className="material-symbols-outlined">layers</span>Topics
          </div>
          <div className={s.topicTags}>
            {topics.map((t, i) => <span key={i} className={s.ttag}>{t}</span>)}
          </div>
        </div>

        {/* Resources */}
        <div className={s.pcol}>
          <div className={s.colLbl}>
            <span className="material-symbols-outlined">school</span>Resources
          </div>
          <ul className={s.resList}>
            {resources.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>

        {/* Outcomes */}
        <div className={s.pcol}>
          <div className={s.colLbl}>
            <span className="material-symbols-outlined">emoji_events</span>Outcomes
          </div>
          <div className={s.outList}>
            {outcomes.map((o, i) => (
              <div key={i} className={s.outItem}>
                <span className="material-symbols-outlined">check_circle</span>
                {o}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deps row */}
      <div className={s.depRow}>
        {deps.map((d, i) => (
          <span key={i}>
            {d.label
              ? <span className={s.depLbl}>{d.label}</span>
              : <span className={s.depChip}>{d.chip}</span>
            }
          </span>
        ))}
      </div>
    </div>
  );
}

function SkillsRoadmap({ onBack, skillGap=[] }) {
  const [downloading, setDownloading] = useState(false);
  function serializePhases(keys) {
    return keys
      .filter(key => phases[key])
      .map(key => {
        const p = phases[key];
        return {
          name: p.name,
          colorClass: p.colorClass,
          duration: p.duration,
          level: p.level,
          topics: p.topics,
          resources: p.resources.map(r =>
            typeof r === 'string'
              ? { text: r, href: null }
              : { text: r.props.children, href: r.props.href }
          ),
          outcomes: p.outcomes,
          deps: p.deps,
        };
      });
  }

async function downloadRoadmapPDF() {
    setDownloading(true);
    try {
      const serialized = serializePhases(skillGap);

      const response = await fetch(`${API_URLS.PYTHON}/download/roadmap/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phases: serialized, total_time: '30–40 weeks' }),
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'roadmap.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF download error:', error);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <div className={`${s.blob} ${s.b1}`} />
      <div className={`${s.blob} ${s.b2}`} />
      <div className={`${s.blob} ${s.b3}`} />

      <div className={s.wrap} id="roadmap-content">
        <button className={s.backBtn} onClick={onBack}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Back to Analyzer
        </button>

        <div className={s.eyebrow}>
          <span className={s.edot} />
          Software Engineering · 9 Skills
        </div>
        <h1 className={s.pageTitle}>Your <em>Skills</em> Roadmap</h1>
        <p className={s.subtitle}>
          One dedicated phase per skill — logically ordered so each one builds on the last.
          Topics, resources, and outcomes for every step.
        </p>

        
        <div className={s.actions}>
          <button
            className={`${s.btn} ${s.btnPrimary}`}
            onClick={downloadRoadmapPDF}
            disabled={downloading}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16, animation: downloading ? 'spin 1s linear infinite' : 'none' }}
            >
              {downloading ? 'autorenew' : 'download'}
            </span>
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>

        
        <div className={s.phasesGrid}>
          {skillGap.map((gap, idx) => <PhaseBlock key={idx} num={idx+1} {...phases[gap]} />)}
        </div>

        
        <div className={s.footer}>
          <h2 className={s.footerTitle}>All {skillGap.length} skills — fully mapped 🚀</h2>
          <p className={s.footerSub}>
            Total estimated time: <strong>~30–40 weeks</strong> at 1–2 hrs/day ·<br></br><br></br>
            {skillGap.map((gap, idx) => gap+" → ")} End Goal
          </p>
          <button
            className={`${s.btn} ${s.btnPrimary}`}
            onClick={downloadRoadmapPDF}
            disabled={downloading}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16, animation: downloading ? 'spin 1s linear infinite' : 'none' }}
            >
              {downloading ? 'autorenew' : 'download'}
            </span>
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </>
  );
}


export default function ProfileAnalyzer() {
  const [cgpa, setCgpa] = useState('');
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState('');
  const [experience, setExperience] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);

  const analyzeProfile = async () => {
    if (!cgpa || !skills || !projects || !experience) {
      alert('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const skillArray = skills.split(',').map(s => s.trim());
      const data = await safeApiFetch(`${API_URLS.PYTHON}/analyze/profile`, {
        method: 'POST',
        body: JSON.stringify({
          cgpa: parseFloat(cgpa),
          skills: skillArray,
          projects: parseInt(projects),
          years_experience: parseFloat(experience),
          target_role: targetRole,
        }),
      });
      setAnalysis(data ?? null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  
  if (showRoadmap) {
    return <SkillsRoadmap onBack={() => setShowRoadmap(false)} skillGap={analysis.skill_gap} />;
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight text-[#B9B9B9] mb-2">Smart Profile Analyzer</h1>
        <p className="text-[#b9c8de]">Analyze your profile and get placement probability predictions</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-[#000000] rounded-xl p-8 border border-slate-800/20 space-y-6 sticky top-8">
            <h2 className="text-xl font-bold text-[#B9B9B9]">Your Profile</h2>

            <div>
              <label className="block text-sm font-bold text-[#c2c6d6] uppercase tracking-widest mb-2">CGPA</label>
              <input value={cgpa} onChange={(e) => setCgpa(e.target.value)} type="number" placeholder="e.g., 8.5" step="0.1" min="0" max="10"
                className="w-full p-3 bg-[#000000] border border-slate-700 rounded-lg text-[#B9B9B9] placeholder-slate-500 focus:outline-none focus:border-[#adc6ff]" />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#c2c6d6] uppercase tracking-widest mb-2">Skills (comma separated)</label>
              <textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g., Python, DSA, React, SQL"
                className="w-full h-20 p-3 bg-[#000000] border border-slate-700 rounded-lg text-[#B9B9B9] placeholder-slate-500 focus:outline-none focus:border-[#adc6ff]" />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#c2c6d6] uppercase tracking-widest mb-2">Projects Completed</label>
              <input value={projects} onChange={(e) => setProjects(e.target.value)} type="number" placeholder="e.g., 5" min="0"
                className="w-full p-3 bg-[#000000] border border-slate-700 rounded-lg text-[#B9B9B9] placeholder-slate-500 focus:outline-none focus:border-[#adc6ff]" />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#c2c6d6] uppercase tracking-widest mb-2">Years of Experience</label>
              <input value={experience} onChange={(e) => setExperience(e.target.value)} type="number" placeholder="e.g., 2" step="0.5" min="0"
                className="w-full p-3 bg-[#000000] border border-slate-700 rounded-lg text-[#B9B9B9] placeholder-slate-500 focus:outline-none focus:border-[#adc6ff]" />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#c2c6d6] uppercase tracking-widest mb-2">Target Role</label>
              <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-3 bg-[#000000] border border-slate-700 rounded-lg text-[#B9B9B9] focus:outline-none focus:border-[#adc6ff]">
                <option>Software Engineer</option>
                <option>Product Manager</option>
                <option>Data Scientist</option>
                <option>DevOps Engineer</option>
              </select>
            </div>

            <button onClick={analyzeProfile} disabled={loading || !cgpa || !skills || !projects || !experience}
              className="w-full py-3 bg-[#4edea3] hover:brightness-110 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">{loading ? 'autorenew' : 'assessment'}</span>
              {loading ? 'Analyzing...' : 'Analyze Profile'}
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <div className="bg-[#000000] rounded-xl p-8 border border-slate-800/20">
              <h3 className="text-lg font-bold text-[#B9B9B9] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3]">trending_up</span>
                Placement Probability
              </h3>
              <div className="mb-6">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4d8eff] to-[#4edea3]">{analysis.placement_probability}%</span>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${analysis.placement_probability > 80 ? 'bg-[#4edea3]/20 text-[#4edea3]' : analysis.placement_probability > 60 ? 'bg-[#adc6ff]/20 text-[#adc6ff]' : 'bg-red-500/20 text-red-400'}`}>
                    {analysis.tier}
                  </span>
                </div>
                <div className="w-full bg-[#000000] rounded-full h-3 overflow-hidden border border-slate-700">
                  <div style={{ width: `${analysis.placement_probability}%` }} className="h-full bg-gradient-to-r from-[#4d8eff] to-[#4edea3] transition-all duration-500" />
                </div>
              </div>
              <p className="text-[#b9c8de] mb-4">{analysis.message}</p>
              <p className="text-sm text-[#adc6ff] font-semibold">Next: {analysis.next_milestone}</p>
            </div>

            <div className="bg-[#000000] rounded-xl p-8 border border-slate-800/20">
              <h3 className="text-lg font-bold text-[#B9B9B9] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#adc6ff]">grid_3x3</span>
                Skill Gap Analysis
              </h3>
              <div className="space-y-2 mb-6">
                {analysis.skill_gap && analysis.skill_gap.map((gap, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-[#000000] rounded-lg border border-red-500/20">
                    <span className="material-symbols-outlined text-red-400 text-sm">close</span>
                    <span className="text-[#B9B9B9]">{gap}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowRoadmap(true)}
                className="w-full py-2 bg-[#4d8eff]/20 hover:bg-[#4d8eff]/30 text-[#4d8eff] font-bold rounded-lg transition-all">
                Generate Learning Path
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#4edea3]/10 to-[#adc6ff]/10 rounded-xl p-8 border border-[#4edea3]/20">
              <h3 className="text-lg font-bold text-[#B9B9B9] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3]">lightbulb</span>
                AI Recommendations
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3"><span className="text-[#4edea3] font-bold">→</span><span className="text-[#B9B9B9]">Focus on System Design and DSA fundamentals</span></li>
                <li className="flex gap-3"><span className="text-[#4edea3] font-bold">→</span><span className="text-[#B9B9B9]">Build 2 more full-stack projects for portfolio</span></li>
                <li className="flex gap-3"><span className="text-[#4edea3] font-bold">→</span><span className="text-[#B9B9B9]">Join open-source to gain production experience</span></li>
              </ul>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!analysis && !loading && (
          <div className="col-span-12 lg:col-span-7">
            <div className="bg-[#000000] rounded-xl p-12 border border-slate-800/20 text-center">
              <span className="material-symbols-outlined text-6xl text-[#adc6ff] opacity-50 block mb-4">person</span>
              <p className="text-[#b9c8de] text-lg">Fill in your profile details to get AI-powered analysis and recommendations</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}