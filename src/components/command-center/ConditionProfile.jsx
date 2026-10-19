import React from 'react';
import { AlertCircle } from 'lucide-react';
import { CONDITION_PROFILE_DATA } from '../../data/mockData';

export function ConditionProfile() {
  const { totalSeverityAssessed, awaitingReviewCount, severityTiers, alertNote } = CONDITION_PROFILE_DATA;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <div className="text-[10px] font-mono text-[#717886] uppercase tracking-wider">
          CURRENT SAMPLE
        </div>
        <h2 className="text-xl font-bold text-[#141E28] tracking-tight mt-0.5">
          Condition profile
        </h2>
        <p className="text-xs text-[#575F6E] mt-1 leading-relaxed">
          Demonstration distribution of all reports by assessed severity.
        </p>
      </div>

      {/* Aggregate Assessed Total */}
      <div className="pt-1">
        <div className="text-[10px] font-mono text-[#717886] uppercase tracking-wider">
          Severity-assessed reports
        </div>
        <div className="text-3xl sm:text-4xl font-bold font-mono text-[#141E28] mt-1 tracking-tight">
          {totalSeverityAssessed}
        </div>
        <div className="text-[10px] text-[#717886] mt-0.5 font-mono">
          {awaitingReviewCount} also await human review
        </div>
      </div>

      {/* Severity Distribution Rows with Slim Horizontal Bars */}
      <div className="space-y-3.5 pt-1">
        {severityTiers.map((tier) => (
          <div key={tier.key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tier.dotColor}`} />
                <span className="font-medium text-[#141E28]">{tier.label}</span>
              </div>
              <span className="font-mono text-xs font-medium text-[#141E28]">
                {tier.count}
              </span>
            </div>

            {/* Slim Horizontal Proportion Bar */}
            <div className="w-full bg-[#EAE8DD] h-1 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${tier.barColor}`}
                style={{ width: `${tier.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Warning Callout Box */}
      <div className="p-3.5 border border-[#DCD9CD] bg-[#FAF8F3] text-xs flex items-start gap-2.5 rounded-xs mt-6">
        <AlertCircle className="w-4 h-4 text-[#B93829] shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#575F6E] leading-relaxed">
          {alertNote}
        </p>
      </div>
    </div>
  );
}
