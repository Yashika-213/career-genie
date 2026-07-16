import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Map, ListChecks, GitBranch, Search, Sparkles } from 'lucide-react';
import { Button, Card, ProgressBar, EmptyState, SkeletonGrid, Input } from '../components/ui';
import { PageHeader } from '../components/ui/PageHeader';
import { TimelineView } from '../components/roadmap/TimelineView';
import { ChecklistView } from '../components/roadmap/ChecklistView';
import { getRoadmap, getRoadmaps, updateProgress } from '../api/endpoints';
import { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useActiveRoadmap } from '../hooks/useActiveRoadmap';
import { cn } from '../lib/cn';
import type { RoadmapDetail, SkillStatus } from '../types';

type View = 'timeline' | 'checklist';

export default function Roadmap() {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeId, setActiveId } = useActiveRoadmap();

  const [roadmap, setRoadmap] = useState<RoadmapDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('timeline');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        let id = params.id ? Number(params.id) : activeId;
        if (!id) {
          const list = await getRoadmaps();
          id = list[0]?.id ?? null;
        }
        if (!id) {
          if (!cancelled) setRoadmap(null);
          return;
        }
        const detail = await getRoadmap(id);
        if (!cancelled) {
          setRoadmap(detail);
          setActiveId(detail.id);
        }
      } catch (err) {
        if (!cancelled) toast(getErrorMessage(err), 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const categories = useMemo(() => {
    if (!roadmap) return ['All'];
    return ['All', ...Array.from(new Set(roadmap.skills.map((s) => s.category ?? 'Other')))];
  }, [roadmap]);

  const filteredSkills = useMemo(() => {
    if (!roadmap) return [];
    return roadmap.skills.filter((s) => {
      const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase());
      const matchesCat = category === 'All' || (s.category ?? 'Other') === category;
      return matchesQuery && matchesCat;
    });
  }, [roadmap, query, category]);

  const handleStatusChange = async (skillId: number, status: SkillStatus) => {
    if (!roadmap) return;
    // Optimistic update
    const prev = roadmap;
    const updatedSkills = roadmap.skills.map((s) =>
      s.id === skillId ? { ...s, status } : s,
    );
    setRoadmap({ ...roadmap, skills: updatedSkills });
    try {
      const res = await updateProgress(skillId, roadmap.id, status);
      setRoadmap((r) => (r ? { ...r, stats: res.stats } : r));
    } catch (err) {
      setRoadmap(prev); // rollback
      toast(getErrorMessage(err), 'error');
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Roadmap" subtitle="Your personalized learning path" />
        <SkeletonGrid count={4} />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div>
        <PageHeader title="Roadmap" subtitle="Your personalized learning path" />
        <EmptyState
          icon={<Map className="h-10 w-10" />}
          title="No roadmap yet"
          description="Get a career recommendation first, then generate a roadmap to start tracking your journey."
          action={
            <Button onClick={() => navigate('/recommend')} leftIcon={<Sparkles className="h-4 w-4" />}>
              Get my career match
            </Button>
          }
        />
      </div>
    );
  }

  const { stats, career } = roadmap;

  return (
    <div>
      <PageHeader
        title={
          <>
            {career.icon} {career.title}
          </>
        }
        subtitle={roadmap.title}
        action={
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            <ViewButton active={view === 'timeline'} onClick={() => setView('timeline')} icon={<GitBranch className="h-4 w-4" />}>
              Timeline
            </ViewButton>
            <ViewButton active={view === 'checklist'} onClick={() => setView('checklist')} icon={<ListChecks className="h-4 w-4" />}>
              Checklist
            </ViewButton>
          </div>
        }
      />

      {/* Progress summary */}
      <Card className="mb-6 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-600 dark:text-slate-300">Overall progress</span>
              <span className="font-semibold text-brand-600">{stats.percent}%</span>
            </div>
            <ProgressBar value={stats.percent} />
          </div>
          <div className="flex gap-4 text-center">
            <Stat label="Completed" value={`${stats.completed}/${stats.total}`} />
            <Stat label="Hours left" value={`${stats.remainingHours}h`} />
            <Stat label="In progress" value={stats.inProgress} />
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search skills…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-medium transition',
                category === c
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filteredSkills.length === 0 ? (
        <EmptyState title="No skills match your filters" description="Try clearing the search or category." />
      ) : view === 'timeline' ? (
        <TimelineView skills={filteredSkills} onStatusChange={handleStatusChange} />
      ) : (
        <ChecklistView skills={filteredSkills} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition',
        active ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200',
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-lg font-bold text-slate-800 dark:text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
