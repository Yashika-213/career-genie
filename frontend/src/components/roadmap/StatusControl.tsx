import { Check, Circle, CircleDashed } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { SkillStatus } from '../../types';

const NEXT: Record<SkillStatus, SkillStatus> = {
  not_started: 'in_progress',
  in_progress: 'completed',
  completed: 'not_started',
};

/** A round button that cycles a skill through not_started → in_progress → completed. */
export function StatusControl({
  status,
  onChange,
  size = 'md',
}: {
  status: SkillStatus;
  onChange: (next: SkillStatus) => void;
  size?: 'sm' | 'md';
}) {
  const dim = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';
  const icon = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <button
      type="button"
      onClick={() => onChange(NEXT[status])}
      title={`Mark as ${NEXT[status].replace('_', ' ')}`}
      aria-label={`Status: ${status.replace('_', ' ')}. Click to change.`}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full border-2 transition-all active:scale-90',
        dim,
        status === 'completed' && 'border-emerald-500 bg-emerald-500 text-white',
        status === 'in_progress' && 'border-amber-500 text-amber-500',
        status === 'not_started' && 'border-slate-300 text-slate-300 dark:border-slate-600 dark:text-slate-600',
      )}
    >
      {status === 'completed' && <Check className={icon} />}
      {status === 'in_progress' && <CircleDashed className={icon} />}
      {status === 'not_started' && <Circle className={cn(icon, 'opacity-0')} />}
    </button>
  );
}
