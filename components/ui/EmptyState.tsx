import { Hospital, Search, AlertCircle, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'hospital' | 'search' | 'warning' | 'inbox';
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

const ICONS = {
  hospital: Hospital,
  search: Search,
  warning: AlertCircle,
  inbox: Inbox,
};

export default function EmptyState({ title, description, icon = 'inbox', action }: EmptyStateProps) {
  const Icon = ICONS[icon];
  return (
    <div className="text-center py-16 px-4" role="status" aria-live="polite">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-slate-400" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed mb-4">{description}</p>
      {action && (
        action.href ? (
          <a href={action.href} className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
            {action.label}
          </a>
        ) : (
          <button onClick={action.onClick} className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
