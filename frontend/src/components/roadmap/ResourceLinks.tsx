import { FileText, Youtube, FlaskConical, ExternalLink } from 'lucide-react';
import type { Resource, ResourceType } from '../../types';

const meta: Record<ResourceType, { icon: typeof FileText; label: string; cls: string }> = {
  doc: { icon: FileText, label: 'Docs', cls: 'text-sky-600 dark:text-sky-400' },
  video: { icon: Youtube, label: 'Video', cls: 'text-rose-600 dark:text-rose-400' },
  practice: { icon: FlaskConical, label: 'Practice', cls: 'text-emerald-600 dark:text-emerald-400' },
};

export function ResourceLinks({ resources }: { resources: Resource[] }) {
  if (!resources?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {resources.map((r) => {
        const m = meta[r.type];
        const Icon = m.icon;
        return (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <Icon className={`h-3.5 w-3.5 ${m.cls}`} />
            <span className="max-w-[180px] truncate">{r.title}</span>
            <ExternalLink className="h-3 w-3 opacity-0 transition group-hover:opacity-60" />
          </a>
        );
      })}
    </div>
  );
}
