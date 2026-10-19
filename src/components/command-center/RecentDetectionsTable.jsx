import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Activity, 
  AlertTriangle,
  Eye
} from 'lucide-react';
import { Card } from '../common/Card';
import { SeverityBadge } from '../common/SeverityBadge';
import { RECENT_DETECTIONS } from '../../data/mockData';


export function RecentDetectionsTable({
  selectedDetection,
  onSelectDetection,
  severityFilter,
  onClearFilter
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [internalSeverityFilter, setInternalSeverityFilter] = useState('ALL');

  // Active filter can come from prop (e.g. from clicking severity distribution) or internal state
  const effectiveFilter = severityFilter || internalSeverityFilter;

  // Filter logic
  const filteredDetections = RECENT_DETECTIONS.filter((item) => {
    // Severity filter
    if (effectiveFilter !== 'ALL' && item.severity !== effectiveFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.roadName.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      const matchDefect = item.defectType.toLowerCase().includes(q);
      const matchVehicle = item.reportingVehicle.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchDefect && !matchVehicle) {
        return false;
      }
    }

    return true;
  });

  return (
    <Card
      title="Recent Road Detections"
      subtitle="Streaming Edge AI road surface hazard incidents prioritized by severity & vehicle impact"
      icon={Activity}
      headerClassName="flex-col sm:flex-row items-start sm:items-center gap-3"
      action={
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search road, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-sans"
            />
          </div>

          {/* Severity Filter Dropdown */}
          <select
            value={effectiveFilter}
            onChange={(e) => {
              setInternalSeverityFilter(e.target.value);
              if (onClearFilter) onClearFilter();
            }}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MODERATE">Moderate Only</option>
            <option value="LOW">Low Only</option>
          </select>
        </div>
      }
      bodyClassName="p-0"
    >
      {/* Active Filter Pill if selected from chart */}
      {severityFilter && (
        <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>Filtered by severity:</span>
            <SeverityBadge severity={severityFilter} size="xs" />
          </div>
          <button
            onClick={onClearFilter}
            className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Operational Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold tracking-wider uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Incident ID</th>
              <th className="py-2.5 px-3">Road Location</th>
              <th className="py-2.5 px-3">Classification</th>
              <th className="py-2.5 px-3">Severity</th>
              <th className="py-2.5 px-3">Edge AI Conf.</th>
              <th className="py-2.5 px-3">Source Fleet Unit</th>
              <th className="py-2.5 px-3">Vibration</th>
              <th className="py-2.5 px-3 text-right">Time</th>
              <th className="py-2.5 px-3 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDetections.length > 0 ? (
              filteredDetections.map((item) => {
                const isSelected = selectedDetection?.id === item.id;

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectDetection && onSelectDetection(item)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/80 font-medium text-blue-900 border-l-2 border-l-blue-600'
                        : 'hover:bg-slate-50/90 text-slate-700'
                    }`}
                  >
                    {/* Defect ID */}
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900 text-[11px] whitespace-nowrap">
                      {item.id}
                    </td>

                    {/* Road Name & Chainage */}
                    <td className="py-2.5 px-3 max-w-[200px]">
                      <div className="font-medium text-slate-900 truncate">
                        {item.roadName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {item.chainage} · {item.segmentId}
                      </div>
                    </td>

                    {/* Classification */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="text-slate-800">{item.defectType}</span>
                    </td>

                    {/* Severity Badge */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <SeverityBadge severity={item.severity} size="xs" />
                    </td>

                    {/* AI Confidence with progress bar */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-semibold text-slate-800">
                          {item.aiConfidence}%
                        </span>
                        <div className="w-10 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.aiConfidence >= 95
                                ? 'bg-emerald-500'
                                : item.aiConfidence >= 90
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${item.aiConfidence}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Source Fleet Unit */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="text-slate-600 text-[11px] font-mono">
                        {item.reportingVehicle}
                      </span>
                    </td>

                    {/* Vibration Z-Axis */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px]">
                      <span
                        className={
                          item.zAxisSpikeG >= 2.5
                            ? 'text-red-700 font-bold'
                            : item.zAxisSpikeG >= 1.5
                            ? 'text-orange-700 font-medium'
                            : 'text-slate-600'
                        }
                      >
                        +{item.zAxisSpikeG}g
                      </span>
                    </td>

                    {/* Relative Time */}
                    <td className="py-2.5 px-3 text-right text-slate-400 text-[11px] whitespace-nowrap font-mono">
                      {item.timestamp}
                    </td>

                    {/* Quick Inspect Button */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectDetection) {
                            onSelectDetection(item);
                          }
                        }}
                        className={`p-1 rounded transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                        }`}
                        title="Inspect on map"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="py-8 text-center text-slate-400">
                  <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                  No road hazard detections match the current query or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer: Triage summary */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] flex items-center justify-between">
        <span className="font-mono">
          Showing {filteredDetections.length} of {RECENT_DETECTIONS.length} events
        </span>
        <span className="text-slate-400">
          Click any row to synchronize map focus & telemetry inspector
        </span>
      </div>
    </Card>
  );
}
