import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { StatusControl } from './StatusControl';
import { ResourceLinks } from './ResourceLinks';
import { Badge } from '../ui';
import { STATUS_META } from '../../lib/constants';
import type { RoadmapSkill, SkillStatus } from '../../types';
import { cn } from '../../lib/cn';

export function TimelineView({
  skills,
  onStatusChange,
}: {
  skills: RoadmapSkill[];
  onStatusChange: (skillId: number, status: SkillStatus) => void;
}) {
  return (
    <div className="relative pl-2">
      {/* vertical line */}
      <div className="absolute bottom-4 left-[26px] top-4 w-0.5 bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-5">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="relative flex gap-4"
          >
            <div className="z-10">
              <StatusControl status={skill.status} onChange={(s) => onStatusChange(skill.id, s)} />
            </div>
            <div
              className={cn(
                'flex-1 rounded-2xl border bg-white p-4 shadow-sm dark:bg-slate-900',
                skill.status === 'completed'
                  ? 'border-emerald-200 dark:border-emerald-900/60'
                  : skill.status === 'in_progress'
                    ? 'border-amber-200 dark:border-amber-900/60'
                    : 'border-slate-200 dark:border-slate-800',
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-brand-500">STEP {i + 1}</span>
                <h3 className="font-semibold text-slate-800 dark:text-white">{skill.name}</h3>
                {skill.category && <Badge tone="brand">{skill.category}</Badge>}
                <Badge tone={STATUS_META[skill.status].tone}>{STATUS_META[skill.status].label}</Badge>
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" /> {skill.estimated_hours}h
                </span>
              </div>
              {skill.description && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{skill.description}</p>
              )}
              <div className="mt-3">
                <ResourceLinks resources={skill.resources} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
