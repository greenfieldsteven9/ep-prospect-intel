import type { Milestone } from '@/types';

interface Props {
  milestones: Milestone[];
}

const TYPE_STYLES: Record<string, { dot: string; label: string }> = {
  draft:    { dot: 'bg-accent-gold',   label: 'Draft' },
  debut:    { dot: 'bg-accent',        label: 'Debut' },
  goal:     { dot: 'bg-accent-green',  label: 'Goal' },
  point:    { dot: 'bg-accent-green',  label: 'Point' },
  award:    { dot: 'bg-purple-400',    label: 'Award' },
  contract: { dot: 'bg-accent-gold',   label: 'Contract' },
  other:    { dot: 'bg-text-muted',    label: '' },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MilestonesPanel({ milestones }: Props) {
  const sorted = [...milestones].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="relative pl-4">
      {/* Vertical line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

      <div className="flex flex-col gap-4">
        {sorted.map((m, i) => {
          const style = TYPE_STYLES[m.type] ?? TYPE_STYLES.other;
          return (
            <div key={i} className="flex gap-3 relative">
              <div className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ring-2 ring-background ${style.dot}`} />
              <div>
                <p className="text-text-primary text-sm leading-snug">{m.label}</p>
                <p className="text-text-muted text-xs mt-0.5">{formatDate(m.date)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
