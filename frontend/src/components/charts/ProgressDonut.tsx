import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export function ProgressDonut({ percent }: { percent: number }) {
  const { theme } = useTheme();
  const track = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const data = [
    { name: 'done', value: percent },
    { name: 'rest', value: 100 - percent },
  ];
  return (
    <div className="relative h-40 w-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <linearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3563ff" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={52}
            outerRadius={70}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            <Cell fill="url(#donutGrad)" />
            <Cell fill={track} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{percent}%</span>
        <span className="text-xs text-slate-400">complete</span>
      </div>
    </div>
  );
}
