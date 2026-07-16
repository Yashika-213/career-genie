import { motion } from 'framer-motion';
import { Bot, User, Volume2 } from 'lucide-react';
import { FormattedMessage } from './FormattedMessage';
import { cn } from '../../lib/cn';

export interface ChatMessage {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

export function MessageBubble({
  message,
  onSpeak,
}: {
  message: ChatMessage;
  onSpeak?: (text: string) => void;
}) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-end gap-2.5', isUser && 'flex-row-reverse')}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow',
          isUser ? 'bg-slate-500' : 'bg-gradient-to-br from-brand-500 to-accent-500',
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          'group relative max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm',
          isUser
            ? 'rounded-br-sm bg-brand-600 text-white'
            : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200',
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.text}</p>
        ) : (
          <FormattedMessage text={message.text} />
        )}
        {!isUser && onSpeak && (
          <button
            onClick={() => onSpeak(message.text)}
            aria-label="Read aloud"
            className="absolute -right-2 -top-2 rounded-full border border-slate-200 bg-white p-1.5 text-slate-400 opacity-0 shadow-sm transition hover:text-brand-500 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800"
          >
            <Volume2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
