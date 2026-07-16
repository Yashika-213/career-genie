import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

export function ProgressBar({
  value,
  className,
  showLabel = false,
}: {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <span className="w-10 text-right text-sm font-semibold text-slate-600 dark:text-slate-300">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
