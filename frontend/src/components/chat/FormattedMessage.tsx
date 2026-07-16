import { Fragment } from 'react';

/** Renders inline **bold** and [label](url) links within a single line. */
function renderInline(text: string, keyPrefix: string) {
  // Split on links and bold markers, preserving delimiters.
  const tokens = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).filter(Boolean);
  return tokens.map((tok, i) => {
    const linkMatch = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={`${keyPrefix}-${i}`}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-brand-600 underline decoration-brand-400/50 underline-offset-2 hover:text-brand-700 dark:text-brand-400"
        >
          {linkMatch[1]}
        </a>
      );
    }
    const boldMatch = tok.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-slate-900 dark:text-white">
          {boldMatch[1]}
        </strong>
      );
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{tok}</Fragment>;
  });
}

/** Renders a chat reply string with basic markdown (bold, links, bullets, line breaks). */
export function FormattedMessage({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1 text-sm leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trimStart();
        const isBullet = /^[•\-*]\s/.test(trimmed) || /^\s+[-]\s/.test(line);
        if (line.trim() === '') return <div key={i} className="h-1" />;
        if (isBullet) {
          const content = trimmed.replace(/^[•\-*]\s/, '');
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              <span>{renderInline(content, `l${i}`)}</span>
            </div>
          );
        }
        return <p key={i}>{renderInline(line, `l${i}`)}</p>;
      })}
    </div>
  );
}
