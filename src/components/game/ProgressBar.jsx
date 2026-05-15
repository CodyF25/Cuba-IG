import { FileText, Link2, Search } from 'lucide-react';

export default function ProgressBar({ stats }) {
  const filePercent = Math.round((stats.unlockedFiles / stats.totalFiles) * 100);
  const analyzePercent = Math.round((stats.analyzedDocs / stats.totalFiles) * 100);
  const connPercent = Math.round((stats.connections / stats.totalConnections) * 100);

  return (
    <div className="flex items-center gap-6 font-typewriter text-xs">
      <StatItem icon={FileText} label="Files" value={stats.unlockedFiles} total={stats.totalFiles} percent={filePercent} />
      <StatItem icon={Search} label="Analyzed" value={stats.analyzedDocs} total={stats.totalFiles} percent={analyzePercent} />
      <StatItem icon={Link2} label="Links" value={stats.connections} total={stats.totalConnections} percent={connPercent} />
    </div>
  );
}

function StatItem({ icon: Icon, label, value, total, percent }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="text-muted-foreground hidden sm:inline">{label}:</span>
      <span className="font-bold">{value}/{total}</span>
      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden hidden md:block">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
