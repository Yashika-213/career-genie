import { PageHeader } from '../components/ui/PageHeader';

/** Temporary stub used during Phase 5 scaffolding; replaced by real pages in Phase 6. */
export function Stub({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle ?? 'Coming together in the next phase.'} />
      <div className="card p-10 text-center text-slate-400">Page under construction.</div>
    </div>
  );
}
