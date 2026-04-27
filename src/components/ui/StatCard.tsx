interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className="bg-surface-2 border border-border rounded-lg p-4">
      <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent ? 'text-accent' : 'text-text-primary'}`}>
        {value}
      </p>
      {sub && <p className="text-text-muted text-xs mt-0.5">{sub}</p>}
    </div>
  );
}
