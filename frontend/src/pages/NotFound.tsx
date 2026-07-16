import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="text-7xl font-black text-brand-600">404</div>
      <p className="mt-2 text-slate-500">This page wandered off the roadmap.</p>
      <Link to="/" className="mt-6">
        <Button>Back home</Button>
      </Link>
    </div>
  );
}
