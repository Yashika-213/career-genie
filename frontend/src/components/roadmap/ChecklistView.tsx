import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { StatusControl } from './StatusControl';
import { ResourceLinks } from './ResourceLinks';
import { Badge } from '../ui';
import { STATUS_META } from '../../lib/constants';
import type { RoadmapSkill, SkillStatus } from '../../types';
import { cn } from '../../lib/cn';

export function ChecklistView({
  skills,
  onStatusChange,
}: {
  skills: RoadmapSkill[];
  onStatusChange: (skillId: number, status: SkillStatus) => void;
}) {
  return (
    <div className="space-y-3">
      {skills.map((skill, i) => (
        <motion.div
          key={skill.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className={cn(
            'rounded-2xl border bg-white p-4 shadow-sm transition-colors dark:bg-slate-900',
            skill.status === 'completed'
              ? 'border-emerald-200 dark:border-emerald-900/60'
              : 'border-slate-200 dark:border-slate-800',
          )}
        >
          <div className="flex items-start gap-3">
            <StatusControl
              status={skill.status}
              onChange={(s) => onStatusChange(skill.id, s)}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={cn(
                    'font-semibold text-slate-800 dark:text-white',
                    skill.status === 'completed' && 'text-slate-400 line-through dark:text-slate-500',
                  )}
                >
                  {i + 1}. {skill.name}
                </h3>
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
          </div>
        </motion.div>
      ))}
    </div>
  );
}
