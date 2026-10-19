import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

import { Card } from '../common/Card';
import { SeverityBadge } from '../common/SeverityBadge';
import { DAMAGE_CATEGORIES, SEVERITY_LEVELS, OPERATIONAL_METRICS } from '../../data/mockData';

export function SeverityDistribution({ onFilterSeverity, activeSeverityFilter }) {
  const totalDetections = OPERATIONAL_METRICS.detections24h;

  return (
    <Card
      title="Road Damage Severity Breakdown"
      subtitle="Defect distribution classified by onboard Edge AI vision and Z-axis accelerometry"
      icon={ShieldAlert}
      action={
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <span>{totalDetections} Total</span>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Severity Distribution Proportional Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Severity Proportions</span>
            <span className="font-mono text-[11px] text-slate-500">24h Ingestion Window</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${(OPERATIONAL_METRICS.criticalHazards / totalDetections) * 100}%` }}
              className="bg-red-500 hover:opacity-90 transition-opacity cursor-pointer"
              title={`Critical: ${OPERATIONAL_METRICS.criticalHazards} incidents`}
              onClick={() => onFilterSeverity && onFilterSeverity('CRITICAL')}
            />
            <div
              style={{ width: `${(OPERATIONAL_METRICS.highHazards / totalDetections) * 100}%` }}
              className="bg-orange-500 hover:opacity-90 transition-opacity cursor-pointer"
              title={`High: ${OPERATIONAL_METRICS.highHazards} incidents`}
              onClick={() => onFilterSeverity && onFilterSeverity('HIGH')}
            />
            <div
              style={{ width: `${(OPERATIONAL_METRICS.moderateHazards / totalDetections) * 100}%` }}
              className="bg-amber-500 hover:opacity-90 transition-opacity cursor-pointer"
              title={`Moderate: ${OPERATIONAL_METRICS.moderateHazards} incidents`}
              onClick={() => onFilterSeverity && onFilterSeverity('MODERATE')}
            />
            <div
              style={{ width: `${(OPERATIONAL_METRICS.lowHazards / totalDetections) * 100}%` }}
              className="bg-sky-500 hover:opacity-90 transition-opacity cursor-pointer"
              title={`Low: ${OPERATIONAL_METRICS.lowHazards} incidents`}
              onClick={() => onFilterSeverity && onFilterSeverity('LOW')}
            />
          </div>

          {/* Quick legend with click-to-filter */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            {Object.keys(SEVERITY_LEVELS).map((key) => {
              const conf = SEVERITY_LEVELS[key];
              const count =
                key === 'CRITICAL'
                  ? OPERATIONAL_METRICS.criticalHazards
                  : key === 'HIGH'
                  ? OPERATIONAL_METRICS.highHazards
                  : key === 'MODERATE'
                  ? OPERATIONAL_METRICS.moderateHazards
                  : OPERATIONAL_METRICS.lowHazards;

              const isSelected = activeSeverityFilter === key;

              return (
                <button
                  key={key}
                  onClick={() => onFilterSeverity && onFilterSeverity(isSelected ? null : key)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors text-left ${
                    isSelected
                      ? 'bg-slate-100 ring-1 ring-slate-400 font-semibold text-slate-900'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${conf.dot}`} />
                  <span className="text-[11px]">{conf.label}</span>
                  <span className="font-mono text-[11px] font-bold text-slate-800">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Category Table / Breakdown */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Damage Classification Profiles
          </div>
          <div className="space-y-2">
            {DAMAGE_CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-md bg-slate-50/70 border border-slate-200/70 text-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <SeverityBadge severity={cat.severity} size="xs" />
                  <span className="font-medium text-slate-800 truncate">
                    {cat.type}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                  <span className="text-slate-500 hidden sm:inline">
                    Avg: {cat.avgDepth}
                  </span>
                  <span className="text-slate-400 hidden md:inline">|</span>
                  <span className="text-slate-500 hidden sm:inline">
                    TTR: {cat.avgEstRepairHours}
                  </span>
                  <span className="font-bold text-slate-900 px-1.5 py-0.5 rounded bg-white border border-slate-200">
                    {cat.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Triage Pipeline Overview */}
        <div className="p-3 bg-blue-50/60 rounded-md border border-blue-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="font-semibold text-blue-950 block">
                Civil Works Triage Workflow
              </span>
              <span className="text-[11px] text-blue-800">
                19 verified defects dispatched for municipal maintenance
              </span>
            </div>
          </div>
          <div className="font-mono text-xs font-bold text-blue-800">
            62% Resolved
          </div>
        </div>
      </div>
    </Card>
  );
}
