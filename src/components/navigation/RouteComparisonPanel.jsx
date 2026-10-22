import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Milestone, 
  AlertTriangle, 
  CheckCircle2, 
  Info
} from 'lucide-react';
import { formatDuration, formatDistance } from '../../utils/geoUtils';

export function RouteComparisonPanel({
  routes = [],
  selectedRouteIndex = 0,
  recommendedRouteIndex = 0,
  fastestRouteIndex,
  recommendationReason = '',
  onSelectRoute
}) {
  const [stepsExpanded, setStepsExpanded] = useState(false);

  if (!routes || routes.length === 0) {
    return null;
  }

  // Calculate fastest route by comparing actual Mapbox route durations
  const computedFastestIndex =
    typeof fastestRouteIndex === 'number'
      ? fastestRouteIndex
      : routes.reduce(
          (bestIdx, r, i, arr) => (r.duration < arr[bestIdx].duration ? i : bestIdx),
          0
        );

  const selectedRoute = routes[selectedRouteIndex] || routes[0];
  const steps = selectedRoute?.legs?.[0]?.steps || [];

  return (
    <div className="space-y-4 text-xs">
      {/* Route Options List */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-mono text-[#717886] uppercase tracking-wider font-semibold">
          Available Routes ({routes.length})
        </div>

        {routes.map((route, idx) => {
          const isSelected = idx === selectedRouteIndex;
          const isRecommended = idx === recommendedRouteIndex;
          const isFastest = idx === computedFastestIndex;
          const hazardData = route.hazardAnalysis || {
            nearbyReports: [],
            criticalCount: 0,
            highCount: 0,
            moderateCount: 0,
            lowCount: 0,
            exposureIndex: 0
          };

          return (
            <div
              key={idx}
              tabIndex={0}
              role="button"
              onClick={() => onSelectRoute(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectRoute(idx);
                }
              }}
              className={`p-3.5 border rounded-xs transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-[#141E28] bg-white shadow-xs ring-1 ring-[#141E28]'
                  : 'border-[#DCD9CD] bg-[#F6F5EE] hover:bg-[#EAE8DD]/60'
              }`}
            >
              {/* Card Header: Route Name & Independent Badges (Selected, Recommended, Fastest) */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-xs text-[#141E28]">
                    Route {idx + 1}
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-xs text-[10px] font-mono font-semibold bg-[#141E28] text-white">
                      Selected
                    </span>
                  )}
                  {isRecommended && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] font-semibold bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Recommended</span>
                    </span>
                  )}
                  {isFastest && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-xs text-[10px] font-mono text-[#575F6E] bg-[#EAE8DD] border border-[#DCD9CD]">
                      Fastest
                    </span>
                  )}
                </div>

                {/* Exposure Index Badge */}
                <div className="text-right shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xs font-mono text-[10px] font-bold ${
                      hazardData.exposureIndex === 0
                        ? 'bg-[#10B981]/10 text-[#047857] border border-[#10B981]/30'
                        : hazardData.exposureIndex <= 6
                        ? 'bg-[#B48C00]/10 text-[#B48C00] border border-[#B48C00]/30'
                        : 'bg-[#B93829]/10 text-[#B93829] border border-[#B93829]/30'
                    }`}
                  >
                    <span>Exposure: {hazardData.exposureIndex} pts</span>
                  </span>
                </div>
              </div>

              {/* Metrics Row: Duration & Distance */}
              <div className="mt-2 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-[#141E28] font-bold text-sm">
                  <Clock className="w-3.5 h-3.5 text-[#575F6E]" />
                  <span>{formatDuration(route.duration)}</span>
                </div>
                <div className="flex items-center gap-1 text-[#575F6E] text-xs font-mono">
                  <Milestone className="w-3.5 h-3.5 text-[#717886]" />
                  <span>{formatDistance(route.distance)}</span>
                </div>
              </div>

              {/* Road Hazard Breakdown Row */}
              <div className="mt-2.5 pt-2 border-t border-[#DCD9CD]/60 flex items-center justify-between text-[11px]">
                <div className="text-[#575F6E] flex items-center gap-1.5">
                  <AlertTriangle
                    className={`w-3.5 h-3.5 shrink-0 ${
                      hazardData.nearbyReports.length > 0 ? 'text-[#C25E00]' : 'text-[#10B981]'
                    }`}
                  />
                  <span>
                    {hazardData.nearbyReports.length === 0
                      ? 'No sample hazards within 150m corridor (demo dataset)'
                      : `${hazardData.nearbyReports.length} nearby sample ${
                          hazardData.nearbyReports.length === 1 ? 'hazard' : 'hazards'
                        }`}
                  </span>
                </div>

                {/* Severity Pills */}
                {hazardData.nearbyReports.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    {hazardData.criticalCount > 0 && (
                      <span className="text-[#B93829] font-bold">
                        {hazardData.criticalCount} Critical
                      </span>
                    )}
                    {hazardData.highCount > 0 && (
                      <span className="text-[#C25E00] font-bold">
                        {hazardData.highCount} High
                      </span>
                    )}
                    {hazardData.moderateCount > 0 && (
                      <span className="text-[#B48C00] font-bold">
                        {hazardData.moderateCount} Mod
                      </span>
                    )}
                    {hazardData.lowCount > 0 && (
                      <span className="text-[#1E6091] font-bold">
                        {hazardData.lowCount} Low
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendation Rationale Box */}
      {recommendationReason && (
        <div className="p-3 bg-[#EAE8DD]/50 border border-[#DCD9CD] rounded-xs space-y-1">
          <div className="flex items-center gap-1.5 text-[#141E28] font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#047857]" />
            <span>Recommendation Summary</span>
          </div>
          <p className="text-[11px] text-[#575F6E] leading-relaxed">
            {recommendationReason}
          </p>
        </div>
      )}

      {/* Turn-by-Turn Directions Expandable Section */}
      {steps.length > 0 && (
        <div className="border border-[#DCD9CD] bg-[#F6F5EE] rounded-xs overflow-hidden">
          <button
            type="button"
            onClick={() => setStepsExpanded(!stepsExpanded)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs font-semibold text-[#141E28] bg-[#EAE8DD]/70 hover:bg-[#EAE8DD] transition-colors cursor-pointer"
          >
            <span>Turn-by-turn guidance ({steps.length} steps)</span>
            {stepsExpanded ? (
              <ChevronUp className="w-4 h-4 text-[#717886]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#717886]" />
            )}
          </button>

          {stepsExpanded && (
            <div className="p-3 divide-y divide-[#DCD9CD]/60 max-h-56 overflow-y-auto text-[11px]">
              {steps.map((step, idx) => (
                <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#EAE8DD] border border-[#DCD9CD] font-mono text-[9px] text-[#717886] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#141E28] font-medium leading-tight">
                      {step.maneuver?.instruction || 'Continue'}
                    </p>
                    {step.distance > 0 && (
                      <span className="text-[10px] font-mono text-[#717886] mt-0.5 block">
                        {step.distance < 1000
                          ? `${Math.round(step.distance)} m`
                          : `${(step.distance / 1000).toFixed(1)} km`}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Methodology Disclaimer Note */}
      <div className="p-2.5 bg-[#FAF8F3] border border-[#DCD9CD] rounded-xs flex items-start gap-2 text-[10px] text-[#717886]">
        <Info className="w-3.5 h-3.5 text-[#1E6091] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Demo Exposure Index:</strong> Calculated by weighting non-rejected sample reports within 150m of route geometry (Critical: 10, High: 6, Moderate: 3, Low: 1). A zero score indicates no demonstration records exist within the search corridor, not a guarantee that the road is defect-free. This is a demonstration heuristic, not a certified safety rating.
        </p>
      </div>
    </div>
  );
}
