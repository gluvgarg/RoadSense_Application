import { TrendingUp, TrendingDown } from 'lucide-react';


export function MetricCard({
  title,
  value,
  subvalue,
  unit,
  change,
  changeType = 'positive', // 'positive' | 'negative' | 'neutral'
  changeLabel,
  icon: Icon,
  badge,
  breakdown
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className="p-1.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-slate-500">
            {unit}
          </span>
        )}
        {badge && (
          <span className="ml-auto text-[11px] px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {badge}
          </span>
        )}
      </div>

      {(subvalue || change) && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
          {change !== undefined && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium ${
                changeType === 'positive'
                  ? 'text-emerald-700'
                  : changeType === 'negative'
                  ? 'text-rose-700'
                  : 'text-slate-600'
              }`}
            >
              {changeType === 'positive' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {change > 0 ? `+${change}` : change}%
            </span>
          )}
          {changeLabel && (
            <span className="text-slate-500 truncate">{changeLabel}</span>
          )}
          {subvalue && (
            <span className="text-slate-500 ml-auto font-mono text-[11px]">
              {subvalue}
            </span>
          )}
        </div>
      )}

      {breakdown && <div className="mt-2.5 pt-2 border-t border-slate-100">{breakdown}</div>}
    </div>
  );
}
