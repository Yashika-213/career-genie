import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target,
  CheckCircle2,
  ListTodo,
  Clock,
  TrendingUp,
  Map,
  Sparkles,
} from 'lucide-react';
import { Button, Card, EmptyState, Skeleton, Select } from '../components/ui';
import { PageHeader } from '../components/ui/PageHeader';
import { ProgressDonut } from '../components/charts/ProgressDonut';
import { CategoryBarChart } from '../components/charts/CategoryBarChart';
import { getRoadmap, getRoadmaps } from '../api/endpoints';
import { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useActiveRoadmap } from '../hooks/useActiveRoadmap';
import type { RoadmapDetail, RoadmapSummary } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeId, setActiveId } = useActiveRoadmap();

  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
  const [detail, setDetail] = useState<RoadmapDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await getRoadmaps();
        if (cancelled) return;
        setRoadmaps(list);
        if (list.length === 0) {
          setDetail(null);
          return;
        }
        const id = list.find((r) => r.id === activeId)?.id ?? list[0].id;
        const d = await getRoadmap(id);
        if (!cancelled) {
          setDetail(d);
          setActiveId(d.id);
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
  }, []);

  const switchRoadmap = async (id: number) => {
    setLoading(true);
    try {
      const d = await getRoadmap(id);
      setDetail(d);
      setActiveId(id);
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !detail) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Track your progress" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Track your progress" />
        <EmptyState
          icon={<Map className="h-10 w-10" />}
          title="Nothing to track yet"
          description="Generate a roadmap from a career recommendation to unlock your progress dashboard."
          action={
            <Button onClick={() => navigate('/recommend')} leftIcon={<Sparkles className="h-4 w-4" />}>
              Get started
            </Button>
          }
        />
      </div>
    );
  }

  const { stats, career } = detail;
  const cards = [
    { icon: Target, label: 'Career Goal', value: career.title, tone: 'from-brand-500 to-brand-600' },
    { icon: CheckCircle2, label: 'Completed Skills', value: `${stats.completed} / ${stats.total}`, tone: 'from-emerald-500 to-emerald-600' },
    { icon: ListTodo, label: 'Remaining Skills', value: stats.remaining, tone: 'from-amber-500 to-orange-500' },
    { icon: Clock, label: 'Hours Remaining', value: `${stats.remainingHours}h`, tone: 'from-cyan-500 to-accent-600' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Your learning progress at a glance"
        action={
          roadmaps.length > 1 ? (
            <Select value={detail.id} onChange={(e) => switchRoadmap(Number(e.target.value))} className="w-56">
              {roadmaps.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.career.icon} {r.title}
                </option>
              ))}
            </Select>
          ) : undefined
        }
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="p-5">
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.tone} text-white shadow-lg`}>
                <c.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 truncate text-xl font-extrabold text-slate-800 dark:text-white">{c.value}</div>
              <div className="text-sm text-slate-400">{c.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-6">
          <h3 className="mb-4 self-start text-sm font-semibold uppercase tracking-wide text-slate-400">
            Overall Progress
          </h3>
          <ProgressDonut percent={stats.percent} />
          <p className="mt-4 text-center text-sm text-slate-500">
            {stats.completed} of {stats.total} skills complete · {stats.completedHours}h logged
          </p>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Progress by category
            </h3>
          </div>
          <CategoryBarChart data={stats.byCategory} />
        </Card>
      </div>

      <div className="mt-6 flex justify-center">
        <Button variant="outline" onClick={() => navigate(`/roadmap/${detail.id}`)} leftIcon={<Map className="h-4 w-4" />}>
          View full roadmap
        </Button>
      </div>
    </div>
  );
}
