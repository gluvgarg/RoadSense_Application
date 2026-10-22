import { SUMMARY_METRICS } from '../../data/mockData';

export function SummaryMetrics() {
  const { registeredVehicles, reportsReceived, reportsRequiringReview } = SUMMARY_METRICS;

  return (
    <div className="border-y border-[#DCD9CD] grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#DCD9CD]">
      {/* Metric 1: Registered vehicles */}
      <div className="py-6 px-4 sm:px-8 flex items-baseline gap-5">
        <span className={`text-4xl font-bold font-mono tracking-tight shrink-0 ${registeredVehicles.colorClass}`}>
          {registeredVehicles.value}
        </span>
        <div className="min-w-0">
          <div className="font-semibold text-xs text-[#141E28] leading-snug">
            {registeredVehicles.label}
          </div>
          <div className="text-[11px] text-[#717886] mt-0.5 truncate">
            {registeredVehicles.subtext}
          </div>
        </div>
      </div>

      {/* Metric 2: Road reports received */}
      <div className="py-6 px-4 sm:px-8 flex items-baseline gap-5">
        <span className={`text-4xl font-bold font-mono tracking-tight shrink-0 ${reportsReceived.colorClass}`}>
          {reportsReceived.value}
        </span>
        <div className="min-w-0">
          <div className="font-semibold text-xs text-[#141E28] leading-snug">
            {reportsReceived.label}
          </div>
          <div className="text-[11px] text-[#717886] mt-0.5 truncate">
            {reportsReceived.subtext}
          </div>
        </div>
      </div>

      {/* Metric 3: Reports requiring review */}
      <div className="py-6 px-4 sm:px-8 flex items-baseline gap-5">
        <span className={`text-4xl font-bold font-mono tracking-tight shrink-0 ${reportsRequiringReview.colorClass}`}>
          {reportsRequiringReview.value}
        </span>
        <div className="min-w-0">
          <div className="font-semibold text-xs text-[#141E28] leading-snug">
            {reportsRequiringReview.label}
          </div>
          <div className="text-[11px] text-[#717886] mt-0.5 truncate">
            {reportsRequiringReview.subtext}
          </div>
        </div>
      </div>
    </div>
  );
}
