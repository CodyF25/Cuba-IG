import { Link, useLocation } from 'react-router-dom';
import { Archive, Network, Newspaper, Clock, Users, Award } from 'lucide-react';
import ProgressBar from './ProgressBar';

const NAV_ITEMS = [
  { path: '/archive', label: 'Archive', icon: Archive },
  { path: '/board', label: 'Evidence Board', icon: Network },
  { path: '/propaganda', label: 'Propaganda Lab', icon: Newspaper },
  { path: '/timeline', label: 'Timeline', icon: Clock },
  { path: '/motives', label: 'Motives', icon: Users },
  { path: '/conclusion', label: 'Conclusion', icon: Award },
];

export default function GameNav({ stats }) {
  const location = useLocation();

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <Link to="/" className="font-typewriter text-sm font-bold text-primary tracking-wide hidden sm:block">
            COLD WAR FILES
          </Link>

          <div className="flex items-center gap-1 overflow-x-auto">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-typewriter text-xs transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:block">
            <ProgressBar stats={stats} />
          </div>
        </div>
      </div>
    </nav>
  );
}
