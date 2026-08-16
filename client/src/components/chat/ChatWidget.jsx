import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sparkles, X, Send, Trash2, Download, Copy, Check, Bot, User, FileText, ChevronUp, ChevronDown as ChevronDownIcon,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext.jsx';
import { useChatWidget } from '../../context/ChatContext.jsx';
import { sendChatMessage } from '../../services/api.js';
import { CHAT_FAQ, matchFaq } from '../../data/chatFaq.js';

const GREETING = {
  role: 'assistant',
  text: "Hi! I'm the ResumeIQ assistant \u2014 ask me anything about resumes, ATS scoring, interviews, or how to use this app. Tap a quick question below, or type your own.",
};

// A handful of chips shown by default; "more" reveals the rest of CHAT_FAQ.
const DEFAULT_CHIP_IDS = ['ats-score', 'ats-friendly', 'upload-help', 'improve'];

const randomDelay = () => 500 + Math.random() * 500;
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-ink/40 dark:bg-paper/40 animate-pulseSoft"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
          isUser ? 'bg-scan/20 text-scan-strong dark:text-scan' : 'bg-ink dark:bg-scan text-paper dark:text-ink'
        }`}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>
      <div className={`group relative max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-ink dark:bg-scan text-paper dark:text-ink rounded-tr-sm'
              : 'surface rounded-tl-sm'
          }`}
        >
          {msg.text}
        </div>
        {!isUser && msg.text && (
          <button
            onClick={handleCopy}
            className="self-start text-[11px] text-ink/40 dark:text-paper/40 hover:text-scan-strong dark:hover:text-scan flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity px-1"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const { resumeText, jobDescription, targetRole, hasResume } = useResume();
  const { isOpen, setIsOpen, pendingPrompt, clearPendingPrompt, hasUnread, setHasUnread } = useChatWidget();

  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showAllChips, setShowAllChips] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending, isOpen]);

  useEffect(() => {
    if (isOpen) setHasUnread(false);
  }, [isOpen, setHasUnread]);

  // Global Cmd/Ctrl+K shortcut to open the assistant from anywhere.
  useEffect(() => {
    function handleKeydown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((o) => !o);
      }
    }
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [setIsOpen]);

  const pushAssistant = (text) => setMessages((prev) => [...prev, { role: 'assistant', text }]);

  // Every reply path goes through here: (1) an exact quick-question chip
  // click always resolves locally and instantly; (2) free-typed text is
  // checked against the same FAQ via keyword matching before touching the
  // network, so common questions work even if the backend/API key isn't
  // set up; (3) anything unmatched goes to the real AI, with a friendly
  // local fallback (not a raw error) if that call fails too.
  const doSend = async (text, { faqId } = {}) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');

    const canned = faqId ? CHAT_FAQ.find((f) => f.id === faqId) : matchFaq(trimmed);
    if (canned) {
      setSending(true);
      await wait(randomDelay());
      pushAssistant(canned.answer);
      setSending(false);
      if (!isOpen) setHasUnread(true);
      return;
    }

    const history = messages
      .filter((m) => m !== GREETING)
      .map((m) => ({ role: m.role, text: m.text }));

    setSending(true);
    try {
      const { reply } = await sendChatMessage({
        message: trimmed,
        history,
        resumeText,
        jobDescription,
        targetRole,
      });
      pushAssistant(reply);
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      pushAssistant(
        "I couldn't reach the AI service just now (the backend may not have an API key configured). Here's what I can still help with \u2014 try one of the quick questions below."
      );
    } finally {
      setSending(false);
    }
  };

  // Pages can call askAI(text) via ChatContext to open the widget with a
  // pre-filled, auto-sent question (e.g. "Explain my ATS score").
  useEffect(() => {
    if (pendingPrompt && isOpen) {
      doSend(pendingPrompt.text);
      clearPendingPrompt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPrompt, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    doSend(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      doSend(input);
    }
  };

  const handleClear = () => {
    setMessages([GREETING]);
    setShowAllChips(false);
  };

  const handleExport = () => {
    const lines = messages.map((m) => `${m.role === 'user' ? 'You' : 'ResumeIQ AI'}: ${m.text}`);
    const blob = new Blob([lines.join('\n\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resumeiq-chat.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Floating launcher button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-ink dark:bg-scan text-paper dark:text-ink shadow-glow flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.15 }}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </motion.span>
        </AnimatePresence>
        {hasUnread && !isOpen && (
          <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-flag ring-2 ring-paper dark:ring-ink animate-pulseSoft" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed z-50 bottom-24 right-5 w-[calc(100vw-2.5rem)] max-w-sm h-[70vh] max-h-[600px] surface shadow-xl flex flex-col overflow-hidden"
            role="dialog"
            aria-label="Ask ResumeIQ AI assistant"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-paper-line dark:border-ink-line shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-ink dark:bg-scan text-paper dark:text-ink flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold font-display truncate">Ask ResumeIQ</p>
                  <p className="text-[11px] text-ink/50 dark:text-paper/50 truncate flex items-center gap-1">
                    {hasResume ? (
                      <>
                        <FileText className="w-3 h-3 shrink-0" /> Personalized to your resume
                      </>
                    ) : (
                      'General career assistant'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleExport}
                  title="Download transcript"
                  className="p-1.5 rounded-lg hover:bg-paper-line dark:hover:bg-ink-line text-ink/60 dark:text-paper/60"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleClear}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg hover:bg-paper-line dark:hover:bg-ink-line text-ink/60 dark:text-paper/60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="p-1.5 rounded-lg hover:bg-paper-line dark:hover:bg-ink-line text-ink/60 dark:text-paper/60"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((m, i) => (
                <MessageBubble key={i} msg={m} />
              ))}
              {sending && (
                <div className="flex gap-2">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-ink dark:bg-scan text-paper dark:text-ink flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="surface rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                    <TypingDots />
                  </div>
                </div>
              )}
            </div>

            {/* Quick-question chips — always available, resolve instantly and
                locally (no network call), so the widget is never a dead end
                even if the AI backend isn't configured. */}
            <div className="px-3 pt-2 pb-1 border-t border-paper-line dark:border-ink-line shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] uppercase tracking-wide font-medium text-ink/40 dark:text-paper/40">
                  Quick questions
                </p>
                <button
                  onClick={() => setShowAllChips((s) => !s)}
                  className="text-[10px] font-medium text-scan-strong dark:text-scan flex items-center gap-0.5"
                >
                  {showAllChips ? 'Less' : 'More'}
                  {showAllChips ? <ChevronUp className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {(showAllChips ? CHAT_FAQ : CHAT_FAQ.filter((f) => DEFAULT_CHIP_IDS.includes(f.id))).map((f) => (
                  <button
                    key={f.id}
                    disabled={sending}
                    onClick={() => doSend(f.chip, { faqId: f.id })}
                    className="chip-pass hover:bg-scan/20 transition-colors text-left disabled:opacity-40"
                  >
                    {f.chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-paper-line dark:border-ink-line shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  maxLength={1200}
                  placeholder="Ask about resumes, ATS, interviews..."
                  className="flex-1 resize-none rounded-xl border border-paper-line dark:border-ink-line bg-paper-panel dark:bg-ink-panel px-3 py-2.5 text-sm outline-none focus:border-scan max-h-24"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  aria-label="Send message"
                  className="w-10 h-10 shrink-0 rounded-xl bg-ink dark:bg-scan text-paper dark:text-ink flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-ink/35 dark:text-paper/35 mt-1.5 px-0.5">
                Enter to send &middot; Shift+Enter for a new line &middot; Cmd/Ctrl+K to toggle
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
