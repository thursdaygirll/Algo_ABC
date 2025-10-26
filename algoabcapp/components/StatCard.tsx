interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export default function StatCard({ title, value, subtitle, className = '' }: StatCardProps) {
  return (
    <div className={`stat bg-base-200 rounded-lg ${className}`}>
      <div className="stat-title">{title}</div>
      <div className="stat-value text-primary">{value}</div>
      {subtitle && <div className="stat-desc">{subtitle}</div>}
    </div>
  );
}
