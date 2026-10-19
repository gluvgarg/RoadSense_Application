import React from 'react';

export function StatusIndicator({
  status = 'active', // 'active' | 'warning' | 'error' | 'offline' | 'standby'
  label,
  sublabel,
  pulse = false,
  _size = 'md'
}) {
  const statusColors = {
    active: { dot: 'bg-emerald-500', ring: 'bg-emerald-400', text: 'text-emerald-700' },
    warning: { dot: 'bg-amber-500', ring: 'bg-amber-400', text: 'text-amber-700' },
    error: { dot: 'bg-red-500', ring: 'bg-red-400', text: 'text-red-700' },
    offline: { dot: 'bg-slate-400', ring: 'bg-slate-300', text: 'text-slate-500' },
    standby: { dot: 'bg-blue-500', ring: 'bg-blue-400', text: 'text-blue-700' }
  };

  const current = statusColors[status] || statusColors.active;

  return (
    <div className="inline-flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.ring}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`}
        />
      </span>
      {(label || sublabel) && (
        <div className="flex flex-col text-left">
          {label && (
            <span className="text-xs font-medium text-slate-800 leading-tight">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-[11px] text-slate-500 leading-tight">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
