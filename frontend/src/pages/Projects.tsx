import { useEffect, useMemo, useState } from 'react';
import { Lightbulb, Search } from 'lucide-react';
import { Card, Badge, Input, SkeletonGrid, EmptyState, Select } from '../components/ui';
import { PageHeader } from '../components/ui/PageHeader';
import { getProjects, getCareers } from '../api/endpoints';
import { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import type { Career, Project } from '../types';

const difficultyTone: Record<string, 'green' | 'amber' | 'rose'> = {
  Beginner: 'green',
  Intermediate: 'amber',
  Advanced: 'rose',
};

export default function Projects() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [careerSlug, setCareerSlug] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [proj, car] = await Promise.all([getProjects(), getCareers()]);
        setProjects(proj);
        setCareers(car);
      } catch (err) {
        toast(getErrorMessage(err), 'error');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchCareer = careerSlug === 'all' || p.careerSlug === careerSlug;
      const matchDiff = difficulty === 'all' || p.difficulty === difficulty;
      const q = query.toLowerCase();
      const matchQuery = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchCareer && matchDiff && matchQuery;
    });
  }, [projects, careerSlug, difficulty, query]);

  return (
    <div>
      <PageHeader
        title="Project Ideas"
        subtitle="Hands-on projects to build your portfolio, organized by career and difficulty."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search projects…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={careerSlug} onChange={(e) => setCareerSlug(e.target.value)}>
          <option value="all">All careers</option>
          {careers.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.icon} {c.title}
            </option>
          ))}
        </Select>
        <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="all">All levels</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </Select>
      </div>

      {loading ? (
        <SkeletonGrid count={8} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Lightbulb className="h-10 w-10" />} title="No projects found" description="Adjust your filters to see more ideas." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={`${p.careerSlug}-${p.id}`} hover className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <Badge tone={difficultyTone[p.difficulty] ?? 'slate'}>{p.difficulty}</Badge>
              </div>
              <h3 className="mt-3 font-semibold text-slate-800 dark:text-white">{p.title}</h3>
              <p className="mt-1.5 flex-1 text-sm text-slate-500 dark:text-slate-400">{p.description}</p>
              {p.careerTitle && (
                <div className="mt-3 border-t border-slate-100 pt-3 text-xs font-medium text-slate-400 dark:border-slate-800">
                  For {p.careerTitle}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
