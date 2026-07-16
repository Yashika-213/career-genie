import { Menu, Volume2, VolumeX } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/cn';

export function Navbar({ onMenu, title }: { onMenu: () => void; title: string }) {
  const { voiceEnabled, toggleVoice } = useTheme();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/70 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleVoice}
          aria-label="Toggle voice"
          title={voiceEnabled ? 'Voice on' : 'Voice off'}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl transition',
            voiceEnabled
              ? 'text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-slate-800'
              : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
          )}
        >
          {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
