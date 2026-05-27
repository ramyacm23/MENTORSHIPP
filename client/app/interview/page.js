'use client';

import { useState, useRef, useEffect } from 'react';
import { safeApiFetch, API_URLS } from '@/lib/api';

export default function Interview() {
  const [stage, setStage] = useState('mode-selection'); // mode-selection, setup, interview, results
  const [selectedMode, setSelectedMode] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState(''); // Live transcript while speaking
  const [inputMode, setInputMode] = useState('voice'); // 'voice' or 'text'
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const [finalEvaluation, setFinalEvaluation] = useState(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [setupStep, setSetupStep] = useState(0);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  // Setup questions
  const setupQuestions = [
    { id: 'role', question: 'What is your target role?', placeholder: 'e.g., Senior Frontend Developer' },
    { id: 'experience', question: 'What is your experience level?', placeholder: 'e.g., 3-5 years' },
    { id: 'skills', question: 'What are your top 3 technical skills?', placeholder: 'e.g., React, Node.js, PostgreSQL' },
    { id: 'company', question: 'What is your target company/industry?', placeholder: 'e.g., FAANG, Startup' },
    { id: 'focus', question: 'What topics to focus on?', placeholder: 'e.g., System Design, DSA' },
    { id: 'goal', question: 'What is your main career goal?', placeholder: 'e.g., Get promoted, Switch roles' },
  ];

  const [setupAnswers, setSetupAnswers] = useState({
    role: '',
    experience: '',
    skills: '',
    company: '',
    focus: '',
    goal: '',
  });

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }
        // Update live interim transcript
        if (interim) {
          setInterimTranscript(interim);
        }
        // Update final transcript
        if (final) {
          setTranscript((prev) => prev + final);
          setInterimTranscript('');
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }

    synthesisRef.current = window.speechSynthesis;
  }, []);

  const getDefaultQuestions = () => {
    const questionsByMode = {
      hr: [
        'Tell me about yourself and your career journey.',
        'Why are you interested in this position?',
        'Describe a challenging situation you overcame.',
        'How do you handle conflict with team members?',
        'Give an example of a project you led.',
        'How do you stay updated with industry trends?',
        'Describe your approach to problem-solving.',
        'What are your key strengths and weaknesses?',
        'How do you balance multiple priorities?',
        'Where do you see yourself in 5 years?',
        'Tell me about a time you failed and learned.',
        'How do you handle feedback and criticism?',
        'Describe your ideal work environment.',
        'Why should we hire you over others?',
        'What questions do you have for us?',
      ],
      dsa: [
        'How would you reverse a linked list?',
        'Explain BFS vs DFS algorithms.',
        'What is the time complexity of merge sort?',
        'Find longest substring without repeating characters.',
        'How would you detect a cycle in a graph?',
        'Implement binary search and explain complexity.',
        'What is dynamic programming with example?',
        'Explain recursion with a practical example.',
        'Find intersection of two linked lists.',
        'Solve the two-sum problem.',
        'Explain hash tables and use cases.',
        'Implement stack using queue.',
        'What is a trie data structure?',
        'Difference between heap sort and quick sort?',
        'Solve longest palindromic substring?',
      ],
      system_design: [
        'Design a URL shortening service.',
        'Design a distributed cache system.',
        'How to architect a real-time notification system?',
        'Design a load balancer for web apps.',
        'How would you design a video streaming platform?',
        'Design a social media feed algorithm.',
        'How to architect a search engine?',
        'Design a rate limiting system.',
        'Design a database that scales horizontally.',
        'How to solve distributed transactions?',
        'Design a message queue system.',
        'Explain microservices architecture benefits.',
        'Design an authorization system.',
        'Design a recommendation engine.',
        'How to handle database replication?',
      ],
    };
    return questionsByMode[selectedMode] || questionsByMode.hr;
  };

  const generateInterviewQuestions = async () => {
    setIsLoadingQuestions(true);
    let questions = [];
    try {
      const prompt = `You are an expert interviewer. Generate exactly 15 tailored interview questions based on this profile:

**Candidate Profile:**
- Target Role: ${setupAnswers.role}
- Experience: ${setupAnswers.experience}
- Skills: ${setupAnswers.skills}
- Target Company: ${setupAnswers.company}
- Focus Areas: ${setupAnswers.focus}
- Career Goal: ${setupAnswers.goal}
- Interview Type: ${selectedMode?.replace('_', ' ').toUpperCase()}

Requirements:
1. Questions must be progressively harder
2. Customize based on their profile
3. Mix technical and soft skills
4. Exactly 15 questions

Respond ONLY as JSON: {"questions": ["Q1?", "Q2?", ...]}`;

      const data = await safeApiFetch(`${API_URLS.PYTHON}/mentor/context`, {
        method: 'POST',
        body: JSON.stringify({
          user_input: 'Generate interview questions',
          context: prompt,
        }),
      });

      if (data) {
        try {
          let text = data.suggestion || '';
          const match = text.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            questions = parsed.questions || [];
          }
        } catch (e) {
          // fall through to default
        }
      }
    } catch (error) {
      // fall through to default
    }

    if (questions.length === 0) {
      questions = getDefaultQuestions();
    }
    setGeneratedQuestions(questions);
    setIsLoadingQuestions(false);
    return questions;
  };

  const evaluateEntireInterview = async () => {
    setIsEvaluating(true);
    try {
      const qaText = generatedQuestions
        .map((q, idx) => `Q${idx + 1}: ${q}\nA${idx + 1}: ${allAnswers[idx]?.transcript || 'No answer'} (Score: ${allAnswers[idx]?.feedback?.score || 0}/100)`)
        .join('\n\n');

      const prompt = `You are an expert interview evaluator. Analyze this complete interview:

**Candidate Profile:**
- Role: ${setupAnswers.role}
- Experience: ${setupAnswers.experience}
- Skills: ${setupAnswers.skills}
- Target: ${setupAnswers.company}
- Focus: ${setupAnswers.focus}

**All Q&A:**
${qaText}

Provide detailed evaluation as JSON:
{
  "overall_score": 0-100,
  "strengths": ["str1", "str2", "str3"],
  "weaknesses": ["weak1", "weak2", "weak3"],
  "technical_skills": {"rating": 0-100, "comments": "..."},
  "communication": {"rating": 0-100, "comments": "..."},
  "problem_solving": {"rating": 0-100, "comments": "..."},
  "soft_skills": {"rating": 0-100, "comments": "..."},
  "recommendations": ["rec1", "rec2", "rec3", "rec4", "rec5"],
  "final_remarks": "Summary..."
}`;

      const data = await safeApiFetch(`${API_URLS.PYTHON}/mentor/context`, {
        method: 'POST',
        body: JSON.stringify({
          user_input: 'Evaluate interview',
          context: prompt,
        }),
      });

      if (data) {
        try {
          let text = data.suggestion || '';
          const match = text.match(/\{[\s\S]*\}/);
          if (match) {
            setFinalEvaluation(JSON.parse(match[0]));
          } else {
            setFinalEvaluation(getDefaultEvaluation());
          }
        } catch (e) {
          setFinalEvaluation(getDefaultEvaluation());
        }
      } else {
        setFinalEvaluation(getDefaultEvaluation());
      }
    } catch (error) {
      setFinalEvaluation(getDefaultEvaluation());
    }
    setIsEvaluating(false);
  };

  const getDefaultEvaluation = () => {
    const avgScore = allAnswers.length > 0
      ? Math.round(allAnswers.reduce((sum, a) => sum + (a.feedback?.score || 0), 0) / allAnswers.length)
      : 0;

    return {
      overall_score: avgScore,
      strengths: ['Good articulation', 'Logical thinking', 'Problem-solving ability'],
      weaknesses: ['Needs more examples', 'Could elaborate', 'Practice required'],
      technical_skills: { rating: avgScore, comments: 'Solid foundation' },
      communication: { rating: Math.min(100, avgScore + 10), comments: 'Clear and concise' },
      problem_solving: { rating: avgScore, comments: 'Logical approach' },
      soft_skills: { rating: Math.max(50, avgScore - 10), comments: 'Good basics' },
      recommendations: [
        'Practice more problems daily',
        'Work on real projects',
        'Study advanced patterns',
        'Improve with real examples',
        'Mock interviews weekly',
      ],
      final_remarks: `You showed ${avgScore > 75 ? 'excellent' : avgScore > 60 ? 'good' : 'promising'} performance!`,
    };
  };

  const speakQuestion = (question) => {
    if (synthesisRef.current) {
      const utterance = new SpeechSynthesisUtterance(question);
      utterance.rate = 1;
      synthesisRef.current.speak(utterance);
    }
  };

  const generateMockFeedback = (answer) => {
    const wordCount = answer.split(' ').length;
    return {
      score: Math.min(95, 55 + (wordCount > 20 ? 20 : 0) + (/example|like|specifically/i.test(answer) ? 20 : 0)),
      clarity: Math.min(100, 50 + wordCount),
      structure: /example|specifically/i.test(answer) ? 85 : 60,
      relevance: (Math.random() * 30 + 60).toFixed(0),
      suggestions: [
        wordCount > 20 ? 'Good detail' : 'More details needed',
        /example|specifically/i.test(answer) ? 'Good examples' : 'Add examples',
        answer.length > 100 ? 'Adequate length' : 'Could elaborate',
      ],
    };
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setInterimTranscript('');
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setInterimTranscript('');
      const fb = generateMockFeedback(transcript);
      setFeedback(fb);
      setScore(fb.score);
    }
  };

  const handleSetupNext = () => {
    if (setupStep < setupQuestions.length - 1) {
      setSetupStep(setupStep + 1);
    } else {
      startInterview();
    }
  };

  const handleSetupChange = (value) => {
    setSetupAnswers((prev) => ({ ...prev, [setupQuestions[setupStep].id]: value }));
  };

  const startInterview = async () => {
    setStage('interview');
    const questions = await generateInterviewQuestions();
    setQuestionIndex(0);
    if (questions.length > 0) {
      speakQuestion(questions[0]);
    }
  };

  const nextQuestion = async () => {
    if (!feedback) return;

    const newAnswers = [...allAnswers];
    newAnswers[questionIndex] = { transcript, feedback };
    setAllAnswers(newAnswers);

    if (questionIndex + 1 < generatedQuestions.length) {
      setQuestionIndex(questionIndex + 1);
      setTranscript('');
      setInterimTranscript('');
      setFeedback(null);
      speakQuestion(generatedQuestions[questionIndex + 1]);
    } else {
      setStage('results');
      await evaluateEntireInterview();
    }
  };

  const reset = () => {
    setStage('mode-selection');
    setSelectedMode(null);
    setSetupStep(0);
    setSetupAnswers({ role: '', experience: '', skills: '', company: '', focus: '', goal: '' });
    setGeneratedQuestions([]);
    setAllAnswers([]);
    setFinalEvaluation(null);
    setQuestionIndex(0);
    setTranscript('');
    setFeedback(null);
    setScore(0);
  };

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Interview Studio</h1>
        <p className="text-tertiary body-md">Groq-powered interviews: Setup -&gt; 15 Questions -&gt; Detailed Evaluation</p>
      </header>

      {/* MODE SELECTION */}
      {stage === 'mode-selection' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'hr', title: 'HR Interview', icon: 'person', desc: 'Behavioral & communication skills' },
            { id: 'dsa', title: 'DSA (Coding)', icon: 'code', desc: 'Algorithm & data structure problems' },
            { id: 'system_design', title: 'System Design', icon: 'architecture', desc: 'Architecture & scalability' },
          ].map((mode) => (
            <div
              key={mode.id}
              onClick={() => {
                setSelectedMode(mode.id);
                setStage('setup');
              }}
              className="bg-surface-container-low rounded-xl p-8 cursor-pointer hover:bg-surface-container-highest transition-all group"
            >
              <span className="material-symbols-outlined text-5xl text-primary mb-4 group-hover:scale-110 transition-transform">
                {mode.icon}
              </span>
              <h3 className="text-lg font-bold text-on-surface mb-2">{mode.title}</h3>
              <p className="text-sm text-on-surface-variant">{mode.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* SETUP STAGE */}
      {stage === 'setup' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-surface-container rounded-xl p-8 space-y-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-on-surface mb-2">
                Question {setupStep + 1} of {setupQuestions.length}
              </h2>
              <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${((setupStep + 1) / setupQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-lg font-semibold text-on-surface">
                {setupQuestions[setupStep].question}
              </label>
              <input
                type="text"
                placeholder={setupQuestions[setupStep].placeholder}
                value={setupAnswers[setupQuestions[setupStep].id]}
                onChange={(e) => handleSetupChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetupNext()}
                autoFocus
                className="w-full px-4 py-3 rounded-lg bg-surface-container-low border-2 border-outline text-on-surface placeholder-on-surface-variant focus:border-primary focus:outline-none transition"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={handleSetupNext}
                className="flex-1 px-6 py-3 rounded-lg bg-primary text-surface font-semibold hover:bg-primary-container transition-all"
              >
                {setupStep === setupQuestions.length - 1 ? 'Start Interview' : 'Next'}
              </button>
              {setupStep > 0 && (
                <button
                  onClick={() => setSetupStep(setupStep - 1)}
                  className="px-6 py-3 rounded-lg border-2 border-outline text-on-surface font-semibold hover:bg-surface-container-low transition-all"
                >
                  Back
                </button>
              )}
              {setupStep === 0 && (
                <button
                  onClick={reset}
                  className="px-6 py-3 rounded-lg border-2 border-outline text-on-surface font-semibold hover:bg-surface-container-low transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INTERVIEW STAGE */}
      {stage === 'interview' && (
        <div className="bg-surface-container rounded-xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-on-surface capitalize">
                {selectedMode.replace('_', ' ')} - Question {questionIndex + 1}/{generatedQuestions.length}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-on-surface-variant">Average Score</p>
              <p className="text-2xl font-bold text-primary">{score.toFixed(0)}%</p>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-lg p-6 border-l-4 border-primary">
            <p className="text-lg text-on-surface font-semibold">{generatedQuestions[questionIndex]}</p>
            <button
              onClick={() => speakQuestion(generatedQuestions[questionIndex])}
              className="mt-4 text-sm text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">volume_up</span>
              Repeat
            </button>
          </div>

          <div className="bg-surface-container-low rounded-lg p-8 space-y-6">
            {/* Input Mode Toggle */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setInputMode('voice');
                  setTranscript('');
                  setInterimTranscript('');
                  setFeedback(null);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  inputMode === 'voice'
                    ? 'bg-primary text-surface'
                    : 'bg-surface-container border-2 border-outline text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-base">mic</span>
                Voice
              </button>
              <button
                onClick={() => {
                  setInputMode('text');
                  setTranscript('');
                  setInterimTranscript('');
                  setFeedback(null);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  inputMode === 'text'
                    ? 'bg-primary text-surface'
                    : 'bg-surface-container border-2 border-outline text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-base">edit</span>
                Type
              </button>
            </div>

            {/* Voice Input Mode */}
            {inputMode === 'voice' && (
              <>
                <div className="text-center">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all mx-auto mb-4 ${
                      isRecording
                        ? 'bg-error animate-pulse'
                        : 'bg-primary hover:bg-primary-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-4xl text-surface">
                      {isRecording ? 'stop_circle' : 'mic'}
                    </span>
                  </button>
                  <p className="text-sm text-on-surface">
                    {isRecording ? 'Recording...' : 'Click to start recording'}
                  </p>
                </div>

                {/* Live Transcript */}
                {(transcript || interimTranscript || isRecording) && (
                  <div className="bg-surface-container rounded-lg p-4 space-y-2">
                    <p className="text-xs text-on-surface-variant uppercase tracking-wide">Live Transcript</p>
                    <div className="min-h-12 p-3 bg-surface-container-low rounded border-l-4 border-primary">
                      <p className="text-on-surface">
                        {transcript}
                        {interimTranscript && (
                          <span className="italic text-on-surface-variant opacity-70">
                            {interimTranscript}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Text Input Mode */}
            {inputMode === 'text' && (
              <>
                <textarea
                  placeholder="Type your answer here..."
                  value={transcript}
                  onChange={(e) => {
                    setTranscript(e.target.value);
                    if (!feedback && e.target.value.length > 0) {
                      const fb = generateMockFeedback(e.target.value);
                      setFeedback(fb);
                      setScore(fb.score);
                    }
                  }}
                  className="w-full h-32 px-4 py-3 rounded-lg bg-surface-container-low border-2 border-outline text-on-surface placeholder-on-surface-variant focus:border-primary focus:outline-none transition resize-none"
                  autoFocus
                />
              </>
            )}
          </div>

          {/* Final Response Summary - shown only after recording stops */}
          {transcript && !isRecording && feedback && (
            <div className="bg-surface-container rounded-lg p-6 border-l-4 border-secondary">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-on-surface-variant uppercase tracking-wide font-semibold">Final Response</p>
                <span className="text-xs bg-secondary text-surface px-2 py-1 rounded">Ready</span>
              </div>
              <p className="text-on-surface">{transcript}</p>
            </div>
          )}

          {feedback && (
            <div className="bg-surface-container-low rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-on-surface">Feedback</h3>
                <p className="text-2xl font-bold text-secondary">{feedback.score}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Clarity', value: feedback.clarity },
                  { label: 'Structure', value: feedback.structure },
                  { label: 'Relevance', value: feedback.relevance },
                ].map((metric) => (
                  <div key={metric.label} className="bg-surface-container rounded-lg p-4 text-center">
                    <p className="text-sm text-on-surface-variant">{metric.label}</p>
                    <p className="text-xl font-bold text-primary">{metric.value}</p>
                  </div>
                ))}
              </div>
              <ul className="space-y-2">
                {feedback.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">
                      {s.startsWith('Good') || s.startsWith('Adequate') ? 'check_circle' : 'info'}
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={nextQuestion}
              disabled={!feedback}
              className="flex-1 px-6 py-3 rounded-lg bg-primary text-surface font-semibold hover:bg-primary-container disabled:opacity-50 transition-all"
            >
              {questionIndex + 1 >= generatedQuestions.length ? 'Get Evaluation' : 'Next'}
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 rounded-lg border-2 border-outline text-on-surface font-semibold hover:bg-surface-container-low transition-all"
            >
              Exit
            </button>
          </div>
        </div>
      )}

      {/* RESULTS STAGE */}
      {stage === 'results' && finalEvaluation && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-primary to-primary-container rounded-xl p-8 text-surface text-center">
            <p className="text-sm uppercase opacity-90">Overall Performance</p>
            <p className="text-6xl font-bold mt-2">{finalEvaluation.overall_score}%</p>
            <p className="text-lg mt-4 opacity-90">{finalEvaluation.final_remarks}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Technical Skills', data: finalEvaluation.technical_skills },
              { title: 'Communication', data: finalEvaluation.communication },
              { title: 'Problem Solving', data: finalEvaluation.problem_solving },
              { title: 'Soft Skills', data: finalEvaluation.soft_skills },
            ].map((skill) => (
              <div key={skill.title} className="bg-surface-container rounded-xl p-6">
                <div className="flex justify-between mb-4">
                  <h3 className="font-bold text-on-surface">{skill.title}</h3>
                  <span className="text-2xl font-bold text-primary">{skill.data.rating}</span>
                </div>
                <p className="text-sm text-on-surface-variant">{skill.data.comments}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container rounded-xl p-6">
              <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                Strengths
              </h3>
              <ul className="space-y-2">
                {finalEvaluation.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-on-surface-variant flex items-start gap-2">
                    <span className="material-symbols-outlined text-xs text-primary mt-0.5">check</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface-container rounded-xl p-6">
              <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">priority_high</span>
                Weaknesses
              </h3>
              <ul className="space-y-2">
                {finalEvaluation.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-on-surface-variant flex items-start gap-2">
                    <span className="material-symbols-outlined text-xs text-secondary mt-0.5">warning</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-surface-container rounded-xl p-6">
            <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">lightbulb</span>
              Recommendations
            </h3>
            <ol className="space-y-2">
              {finalEvaluation.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-on-surface-variant flex items-start gap-3">
                  <span className="font-bold text-primary">{i + 1}.</span>
                  {rec}
                </li>
              ))}
            </ol>
          </div>

          <button
            onClick={reset}
            className="w-full px-6 py-3 rounded-lg bg-primary text-surface font-semibold hover:bg-primary-container transition-all"
          >
            New Interview
          </button>
        </div>
      )}

      {isEvaluating && (
        <div className="bg-surface-container rounded-xl p-12 text-center">
          <div className="inline-block animate-spin">
            <span className="material-symbols-outlined text-5xl text-primary">psychology</span>
          </div>
          <p className="mt-4 text-lg font-semibold text-on-surface">Evaluating your performance...</p>
        </div>
      )}
    </div>
  );
}


