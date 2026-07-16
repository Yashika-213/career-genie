import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, GitCompare, Map } from 'lucide-react';
import { Card, Badge, Button, Select, EmptyState, Skeleton } from '../components/ui';
import { PageHeader } from '../components/ui/PageHeader';
import { getCareers, getCareer, createRoadmap } from '../api/endpoints';
import { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useActiveRoadmap } from '../hooks/useActiveRoadmap';
import type { Career, CareerDetail } from '../types';

const demandTone: Record<string, 'green' | 'amber' | 'cyan'> = {
  'Very High': 'green',
  High: 'cyan',
  Medium: 'amber',
};

export default function Compare() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setActiveId } = useActiveRoadmap();

  const [careers, setCareers] = useState<Career[]>([]);
  const [selected, setSelected] = useState<CareerDetail[]>([]);
  const [adding, setAdding] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await getCareers();
        setCareers(list);
        // Pre-load two popular careers for an immediate comparison.
        const initial = await Promise.all(
          ['ai-engineer', 'data-scientist'].map((s) => getCareer(s)),
        );
        setSelected(initial);
      } catch (err) {
        toast(getErrorMessage(err), 'error');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addCareer = async (slug: string) => {
    if (!slug || selected.some((c) => c.slug === slug) || selected.length >= 3) return;
    try {
      const detail = await getCareer(slug);
      setSelected((prev) => [...prev, detail]);
      setAdding('');
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    }
  };

  const remove = (slug: string) => setSelected((prev) => prev.filter((c) => c.slug !== slug));

  const start = async (slug: string) => {
    try {
      const roadmap = await createRoadmap(slug);
      setActiveId(roadmap.id);
      toast('Roadmap created!', 'success');
      navigate(`/roadmap/${roadmap.id}`);
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    }
  };

  const available = careers.filter((c) => !selected.some((s) => s.slug === c.slug));

  if (loading) {
    return (
      <div>
        <PageHeader title="Compare Careers" subtitle="See careers side by side" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Compare Careers"
        subtitle="Weigh up to three tech careers side by side, then start a roadmap."
        action={
          selected.length < 3 && available.length > 0 ? (
            <div className="flex items-center gap-2">
              <Select value={adding} onChange={(e) => addCareer(e.target.value)} className="w-52">
                <option value="">+ Add a career…</option>
                {available.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.icon} {c.title}
                  </option>
                ))}
              </Select>
            </div>
          ) : undefined
        }
      />

      {selected.length === 0 ? (
        <EmptyState
          icon={<GitCompare className="h-10 w-10" />}
          title="Pick careers to compare"
          description="Add up to three careers using the selector above."
        />
      ) : (
        <div className={`grid gap-4 ${selected.length === 1 ? 'sm:grid-cols-1 max-w-md' : selected.length === 2 ? 'sm:grid-cols-2' : 'lg:grid-cols-3 sm:grid-cols-2'}`}>
          {selected.map((c) => (
            <Card key={c.slug} className="flex flex-col overflow-hidden">
              <div className="relative bg-gradient-to-br from-brand-600 to-accent-500 p-5 text-white">
                <button
                  onClick={() => remove(c.slug)}
                  className="absolute right-3 top-3 rounded-lg p-1 text-white/80 hover:bg-white/20"
                  aria-label="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="text-4xl">{c.icon}</div>
                <h3 className="mt-2 text-xl font-bold">{c.title}</h3>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-5">
                <p className="text-sm text-slate-500 dark:text-slate-400">{c.description}</p>

                <Row label="Avg. salary" value={c.avg_salary ?? '—'} />
                <Row
                  label="Demand"
                  value={<Badge tone={demandTone[c.demand_level ?? ''] ?? 'slate'}>{c.demand_level}</Badge>}
                />
                <Row label="Skills to learn" value={`${c.skills.length}`} />
                <Row label="Est. total hours" value={`${c.skills.reduce((s, k) => s + k.estimated_hours, 0)}h`} />
                <Row label="Project ideas" value={`${c.projects.length}`} />

                <div>
                  <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Starting skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.skills.slice(0, 5).map((s) => (
                      <Badge key={s.id} tone="brand">
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="mt-auto w-full" onClick={() => start(c.slug)} leftIcon={<Map className="h-4 w-4" />}>
                  Start this roadmap
                </Button>
              </div>
            </Card>
          ))}

          {selected.length < 3 && available.length > 0 && (
            <button
              onClick={() => addCareer(available[0].slug)}
              className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-brand-400 hover:text-brand-500 dark:border-slate-700"
            >
              <Plus className="h-8 w-8" />
              <span className="mt-2 text-sm font-medium">Add another</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-sm dark:border-slate-800">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-slate-700 dark:text-slate-200">{value}</span>
    </div>
  );
}
