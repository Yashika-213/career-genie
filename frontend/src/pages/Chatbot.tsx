import { useEffect, useRef, useState } from 'react';
import { Send, Mic, MicOff, Bot, Sparkles } from 'lucide-react';
import { MessageBubble, type ChatMessage } from '../components/chat/MessageBubble';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { Card } from '../components/ui';
import { sendChat } from '../api/endpoints';
import { getErrorMessage } from '../api/client';
import { useSpeech } from '../hooks/useSpeech';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useActiveRoadmap } from '../hooks/useActiveRoadmap';
import { cn } from '../lib/cn';

const SUGGESTIONS = [
  'What should I learn next?',
  'Which skills am I missing?',
  'How is my progress?',
  'Suggest projects',
  'Recommend free resources',
  'Tell me about Data Scientist',
];

const GREETING =
  "Hi! I'm CareerGenie 🧞 — your AI career guide. Ask me what to learn next, which skills you're missing, for project ideas, or about any tech career. You can also use the mic to talk to me!";

let msgId = 1;

export default function Chatbot() {
  const { voiceEnabled } = useTheme();
  const { toast } = useToast();
  const { activeId } = useActiveRoadmap();

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: 'bot', text: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { listening, startListening, stopListening, speak, recognitionSupported } = useSpeech({
    enabled: voiceEnabled,
    onResult: (transcript) => {
      setInput(transcript);
      void send(transcript);
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;

    setMessages((prev) => [...prev, { id: msgId++, role: 'user', text }]);
    setInput('');
    setTyping(true);

    try {
      const res = await sendChat(text, activeId ?? undefined);
      // Small delay for a natural typing feel.
      await new Promise((r) => setTimeout(r, 450));
      setMessages((prev) => [...prev, { id: msgId++, role: 'bot', text: res.reply }]);
      if (voiceEnabled) speak(res.reply);
    } catch (err) {
      const message = getErrorMessage(err);
      setMessages((prev) => [...prev, { id: msgId++, role: 'bot', text: `⚠️ ${message}` }]);
      toast(message, 'error');
    } finally {
      setTyping(false);
    }
  };

  const onMic = () => {
    if (listening) stopListening();
    else startListening();
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-600/30">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white">AI Assistant</h1>
          <p className="text-sm text-slate-400">
            {voiceEnabled ? 'Voice on · replies read aloud' : 'Voice off'}
          </p>
        </div>
      </div>

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} onSpeak={voiceEnabled ? speak : undefined} />
          ))}
          {typing && (
            <div className="flex items-end gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 px-5 pb-3">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <Sparkles className="h-3 w-3" /> {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="flex items-center gap-2"
          >
            {recognitionSupported && (
              <button
                type="button"
                onClick={onMic}
                aria-label={listening ? 'Stop listening' : 'Start voice input'}
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition',
                  listening
                    ? 'animate-pulse bg-rose-500 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300',
                )}
              >
                {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            )}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={listening ? 'Listening…' : 'Ask me anything about your career…'}
              className="h-11 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
