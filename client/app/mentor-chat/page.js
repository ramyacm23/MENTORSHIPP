'use client';

import { useState, useRef, useEffect } from 'react';
import { safeApiFetch, API_URLS } from '@/lib/api';

export default function MentorChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'mentor',
      text: "Hey! I'm your AI Mentor. I've been tracking your progress and I want to help you succeed. What would you like to focus on today?",
      timestamp: null,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    await handleSendMessageWithText(input);
    setInput('');
  };

  const generateMentorResponse = (userInput) => {
    const responses = {
      dsa: "Great question! DSA is crucial. Let's start with fundamentals: Arrays, Linked Lists, and Trees. I recommend solving 50 LeetCode problems focusing on these topics first.",
      interview:
        "Interviews test your problem-solving ability under pressure. Practice with mock interviews in our Interview Studio. Record yourself and review for clarity, pacing, and confidence.",
      projects:
        "Building projects is excellent for learning. Try creating a full-stack app - it covers frontend, backend, and database. This looks amazing on resumes and in interviews.",
      motivation:
        "I see you've improved from 32% â†’ 48% in placement probability. You're making great progress! Keep pushing - you're on the right track. The key is consistency.",
      default:
        'That\'s a great point! Focus on implementing it step-by-step. Would you like me to break this down into smaller milestones? I can help create a personalized plan for you.',
    };

    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes('dsa') || lowerInput.includes('algorithm')) return responses.dsa;
    if (lowerInput.includes('interview')) return responses.interview;
    if (lowerInput.includes('project')) return responses.projects;
    if (lowerInput.includes('motivation') || lowerInput.includes('stuck')) return responses.motivation;
    return responses.default;
  };

  const handleSendMessageWithText = async (messageText) => {
    if (!messageText.trim()) return;

    console.log('Sending message:', messageText);

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => {
      console.log('Adding user message, current messages:', prev.length);
      return [...prev, userMessage];
    });
    setLoading(true);

    try {
      console.log('Fetching from backend...');
      const data = await safeApiFetch(`${API_URLS.PYTHON}/mentor/context`, {
        method: 'POST',
        body: JSON.stringify({
          user_input: messageText,
          context: 'user is preparing for interviews and DSA',
        }),
      });

      console.log('Backend response data:', data);

      if (data) {
        // Build message from Groq response
        let mentorText = data.suggestion || generateMentorResponse(messageText);
        
        // Add action if available and is a string
        if (data.action && typeof data.action === 'string' && data.action.trim()) {
          mentorText += `\n\nðŸ’¡ ${data.action}`;
        }
        
        // Add motivation if available
        if (data.motivation && typeof data.motivation === 'string' && data.motivation.trim()) {
          mentorText += `\n\n${data.motivation}`;
        }
        
        const mentorMessage = {
          id: Date.now(),
          type: 'mentor',
          text: mentorText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, mentorMessage]);
      } else {
        console.log('Backend error, using fallback response');
        const mentorMessage = {
          id: Date.now(),
          type: 'mentor',
          text: generateMentorResponse(messageText),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, mentorMessage]);
      }
    } catch (error) {
      console.log('Fetch error:', error.message);
      const mentorMessage = {
        id: Date.now(),
        type: 'mentor',
        text: generateMentorResponse(messageText),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, mentorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    handleSendMessageWithText(action.label);
  };

  const quickActions = [
    { label: 'DSA Help', emoji: 'ðŸ“Š' },
    { label: 'Interview Tips', emoji: 'ðŸŽ¯' },
    { label: 'Project Ideas', emoji: 'ðŸš€' },
    { label: 'Motivation', emoji: 'ðŸ’ª' },
  ];

  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">AI Mentor Chat</h1>
        <p className="text-on-surface-variant">Context-aware mentoring with memory and personalized guidance</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Chat Section */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-surface rounded-xl border border-outline/20 overflow-hidden flex flex-col h-96 lg:h-[600px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-secondary text-white rounded-br-none'
                        : 'bg-surface text-on-surface rounded-bl-none border border-outline'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-surface text-on-surface px-4 py-3 rounded-lg rounded-bl-none border border-outline">
                    <div className="flex gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-outline/20 p-4 bg-surface">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask your mentor anything..."
                  className="flex-1 p-3 bg-surface border border-outline rounded-lg text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="px-4 py-3 bg-secondary hover:brightness-110 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-surface rounded-xl p-6 border border-outline/20">
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">touch_app</span>
              Quick Actions
            </h3>

            <div className="space-y-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action)}
                  className="w-full px-4 py-3 bg-surface hover:bg-surface-container-high border border-outline rounded-lg text-on-surface transition-all text-left flex items-center gap-3"
                >
                  <span className="text-xl">{action.emoji}</span>
                  <span className="text-sm font-semibold">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Context */}
          <div className="bg-surface rounded-xl p-6 border border-outline/20">
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">memory</span>
              Your Context
            </h3>

            <div className="space-y-3 text-sm text-on-surface-variant">
              <div>
                <p className="font-semibold text-on-surface mb-1">Last Session</p>
                <p>Worked on System Design</p>
              </div>

              <div>
                <p className="font-semibold text-on-surface mb-1">Weak Topics</p>
                <p>Dynamic Programming, Heaps</p>
              </div>

              <div>
                <p className="font-semibold text-on-surface mb-1">Achievements</p>
                <p>5-day streak â­</p>
              </div>
            </div>
          </div>

          {/* Motivation */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
            <p className="text-sm text-on-surface">
              <span className="font-bold">ðŸ’¡ Did you know?</span> Students who practice with structured mentoring improve their placement chances by 3x. Keep grinding!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}


