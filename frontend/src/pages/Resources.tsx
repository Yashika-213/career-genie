import { useEffect, useMemo, useState } from 'react';
import {
  FileText,
  Youtube,
  FlaskConical,
  ExternalLink,
  Heart,
  Search,
  BookOpen,
} from 'lucide-react';
import { Card, Badge, Input, SkeletonGrid, EmptyState } from '../components/ui';
import { PageHeader } from '../components/ui/PageHeader';
import { getResources, getFavorites, toggleFavorite } from '../api/endpoints';
import { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/cn';
import type { Resource, ResourceType } from '../types';

const typeMeta: Record<ResourceType, { icon: typeof FileText; label: string; cls: string }> = {
  doc: { icon: FileText, label: 'Docs', cls: 'text-sky-500' },
  video: { icon: Youtube, label: 'Video', cls: 'text-rose-500' },
  practice: { icon: FlaskConical, label: 'Practice', cls: 'text-emerald-500' },
};

const FILTERS: { key: 'all' | ResourceType | 'favorites'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'doc', label: 'Docs' },
  { key: 'video', label: 'Videos' },
  { key: 'practice', label: 'Practice' },
  { key: 'favorites', label: '★ Favorites' },
];

export default function Resources() {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all');
  const [query, setQuery] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [all, favs] = await Promise.all([getResources(), getFavorites()]);
      const favIds = new Set(favs.map((f) => f.id));
      setResources(all.map((r) => ({ ...r, favorite: favIds.has(r.id) })));
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onToggleFav = async (id: number) => {
    // optimistic
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)));
    try {
      await toggleFavorite(id);
    } catch (err) {
      setResources((prev) => prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)));
      toast(getErrorMessage(err), 'error');
    }
  };

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchesFilter =
        filter === 'all' ? true : filter === 'favorites' ? r.favorite : r.type === filter;
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        (r.skill_name ?? '').toLowerCase().includes(q) ||
        (r.career_title ?? '').toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [resources, filter, query]);

  return (
    <div>
      <PageHeader
        title="Learning Resources"
        subtitle="Free docs, videos and practice sites for every skill. Save your favorites."
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search resources, skills or careers…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-medium transition',
                filter === f.key
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonGrid count={9} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-10 w-10" />}
          title="No resources found"
          description={filter === 'favorites' ? 'You have no favorites yet — tap the heart on any resource.' : 'Try a different search or filter.'}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => {
            const m = typeMeta[r.type];
            const Icon = m.icon;
            return (
              <Card key={r.id} hover className="flex flex-col p-5">
                <div className="flex items-start justify-between">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800', m.cls)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <button
                    onClick={() => onToggleFav(r.id)}
                    aria-label="Toggle favorite"
                    className="rounded-lg p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Heart className={cn('h-5 w-5', r.favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300 dark:text-slate-600')} />
                  </button>
                </div>
                <h3 className="mt-3 font-semibold leading-snug text-slate-800 dark:text-white">{r.title}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge tone="brand">{r.skill_name}</Badge>
                  <Badge tone="slate">{m.label}</Badge>
                  {r.is_free && <Badge tone="green">Free</Badge>}
                </div>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  Open resource <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
