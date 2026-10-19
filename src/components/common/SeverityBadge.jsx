import React from 'react';
import { SEVERITY_LEVELS } from '../../data/mockData';

export function SeverityBadge({ severity, size = 'sm', showDot = true, showLevel = false }) {
  const normKey = (severity || 'LOW').toUpperCase();
  const config = SEVERITY_LEVELS[normKey] || SEVERITY_LEVELS.LOW;

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.2',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border ${config.badge} ${sizeClasses[size] || sizeClasses.sm}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} />
      )}
      <span>{config.label}</span>
      {showLevel && (
        <span className="opacity-60 text-[10px] font-mono">L{config.level}</span>
      )}
    </span>
  );
}
