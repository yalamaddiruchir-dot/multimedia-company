import { useUI } from '../../lib/uiStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Send, X, ArrowRight, Lightbulb } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const suggestions = [
  'Find all delayed weddings',
  'Show projects due this week',
  "Summarize today's production",
  'Why is Project Alpha delayed?',
  'Generate production report',
  'Which team member is overloaded?',
];

type Msg = { role: 'user' | 'assistant'; content: string };

export function AIAssistant() {
  const { aiOpen, setAiOpen } = useUI();
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: "Hi Aarav 👋 I'm your ReelLine AI assistant. Ask me anything about your studio's production workflow, projects, or team." },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aiOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, aiOpen]);

  const handleSend = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content }]);
    setTyping(true);
    setTimeout(() => {
      const responses = [
        "I found 2 delayed projects — Vogue Editorial (3 days behind) and Redwood Charity Gala (locked). Would you like me to draft a catch-up plan?",
        "Based on last month's data, the Lightroom team is at 92% utilization. Ishita has 6 active projects. Consider rebalancing load to Priya.",
        "Here's the breakdown: 8 active projects, $284K monthly revenue (↑12.4%), 2 delays, average completion time 6.2 days. Shall I generate a full report?",
        "Project Alpha is delayed because 247 RAW files from Day 2 are awaiting verification in the Data Copy stage. Rohan is on it — ETA 4 hours.",
      ];
      setMessages((m) => [...m, { role: 'assistant', content: responses[Math.floor(Math.random() * responses.length)] }]);
      setTyping(false);
    }, 900);
  };

  return (
    <AnimatePresence>
      {aiOpen && (
        <>
          <div className="fixed inset-0 z-[55] bg-black/30 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-0" onClick={() => setAiOpen(false)} />
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed right-0 top-0 bottom-0 z-[60] w-full sm:w-[420px] bg-[var(--surface)] border-l border-[var(--border)] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="h-16 px-4 border-b border-[var(--border)] flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-violet-500/10 to-pink-500/10">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-md">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">ReelLine AI</div>
                  <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-soft" />
                    Online · Ready
                  </div>
                </div>
              </div>
              <button onClick={() => setAiOpen(false)} className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {m.role === 'assistant' && (
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[var(--primary)] text-white rounded-tr-md'
                        : 'bg-[var(--surface-2)] text-[var(--text)] rounded-tl-md'
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="bg-[var(--surface-2)] rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] pulse-soft" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] pulse-soft" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] pulse-soft" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {messages.length <= 1 && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-[var(--text-subtle)] mb-2 px-1">
                    <Lightbulb className="h-3 w-3" />
                    Try asking
                  </div>
                  <div className="space-y-1.5">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--border)] text-xs text-[var(--text)] text-left transition-colors group"
                      >
                        <span>{s}</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[var(--border)] flex-shrink-0">
              <div className="flex items-center gap-2 bg-[var(--surface-2)] rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[var(--ring)] focus-within:bg-[var(--surface)] border border-transparent focus-within:border-[var(--primary)] transition-all">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--text-subtle)]"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="h-7 w-7 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center disabled:opacity-50 transition-all btn-press"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-[var(--text-subtle)] text-center mt-2">
                AI can make mistakes. Verify important information.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
