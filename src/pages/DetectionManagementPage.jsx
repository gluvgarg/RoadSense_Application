import React, { useState, useMemo } from 'react';
import { 
  Search, 
  RotateCcw, 
  X, 
  Download, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  MapPin
} from 'lucide-react';
import { ROAD_CONDITIONS_REPORTS } from '../data/mockData';
import { DetectionDetailsModal } from '../components/detections/DetectionDetailsModal';

export function DetectionManagementPage() {
  const [reports, setReports] = useState(ROAD_CONDITIONS_REPORTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState(null);
  const [notification, setNotification] = useState(null);

  // Check if any filter is actively applied
  const isFilterActive = searchQuery.trim() !== '' || severityFilter !== 'ALL' || statusFilter !== 'ALL';

  // Dynamic summary metrics calculated strictly from current sample records
  const metrics = useMemo(() => {
    const total = reports.length;
    const needsReview = reports.filter((r) => r.reviewStatus === 'Needs review').length;
    const highCritical = reports.filter((r) => r.severity === 'Critical' || r.severity === 'High').length;
    const verified = reports.filter((r) => r.reviewStatus === 'Verified').length;

    return {
      total,
      needsReview,
      highCritical,
      verified
    };
  }, [reports]);

  // Filter reports based on search query, severity, and review status
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // 1. Severity filter
      if (severityFilter !== 'ALL' && report.severity !== severityFilter) {
        return false;
      }

      // 2. Review status filter
      if (statusFilter !== 'ALL' && report.reviewStatus !== statusFilter) {
        return false;
      }

      // 3. Search query across ID, road, sub-location, damage type, and notes
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = report.id.toLowerCase().includes(q);
        const matchesRoad = report.roadLocation.toLowerCase().includes(q);
        const matchesSub = report.subLocation.toLowerCase().includes(q);
        const matchesDamage = report.damageType.toLowerCase().includes(q);
        const matchesNotes = report.notes ? report.notes.toLowerCase().includes(q) : false;

        if (!matchesId && !matchesRoad && !matchesSub && !matchesDamage && !matchesNotes) {
          return false;
        }
      }

      return true;
    });
  }, [reports, severityFilter, statusFilter, searchQuery]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSeverityFilter('ALL');
    setStatusFilter('ALL');
  };

  // Status transitions handler
  const handleStatusTransition = (reportId, newStatus) => {
    const statusColors = {
      'Needs review': '#B93829',
      'In review': '#C25E00',
      'Verified': '#10B981',
      'Rejected': '#717886'
    };

    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              reviewStatus: newStatus,
              statusDotColor: statusColors[newStatus] || '#717886'
            }
          : r
      )
    );

    // Keep selectedReport synchronized if modal is currently open
    setSelectedReport((curr) =>
      curr && curr.id === reportId
        ? {
            ...curr,
            reviewStatus: newStatus,
            statusDotColor: statusColors[newStatus] || '#717886'
          }
        : curr
    );

    setNotification({
      message: `Report ${reportId} status updated to "${newStatus}" in local demonstration state.`
    });

    // Auto-dismiss notification after 6 seconds
    setTimeout(() => {
      setNotification((curr) => (curr?.message.includes(reportId) ? null : curr));
    }, 6000);
  };

  // CSV export function for currently filtered records
  const handleExportCSV = () => {
    if (filteredReports.length === 0) return;

    const headers = [
      'Report ID',
      'Road Location',
      'Sub Location',
      'Damage Type',
      'Severity',
      'AI Confidence',
      'Review Status',
      'Report Time',
      'Latitude',
      'Longitude',
      'Observation Notes'
    ];

    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '""';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return `"${str}"`;
    };

    const rows = filteredReports.map((r) => [
      escapeCSV(r.id),
      escapeCSV(r.roadLocation),
      escapeCSV(r.subLocation),
      escapeCSV(r.damageType),
      escapeCSV(r.severity),
      escapeCSV(r.confidence || 'N/A'),
      escapeCSV(r.reviewStatus),
      escapeCSV(r.reportTime),
      escapeCSV(r.latitude),
      escapeCSV(r.longitude),
      escapeCSV(r.notes || '')
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `roadsense-detections-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. Editorial Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono text-[#717886] uppercase tracking-wider">
              04 / DETECTIONS
            </span>
            <span className="border border-[#DCD9CD] bg-[#F6F5EE] px-1.5 py-0.5 rounded-xs text-[10px] font-mono text-[#717886]">
              DEMO DATA
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#141E28] tracking-tight leading-none">
            Detection Review
          </h1>

          <p className="text-xs sm:text-sm text-[#575F6E] leading-relaxed pt-0.5">
            Review, verify, and manage road damage detected by the RoadSense fleet.
          </p>
        </div>

        {/* Live Counter */}
        <div className="text-[11px] font-mono text-[#717886] sm:text-right shrink-0">
          <span>Showing </span>
          <strong className="text-[#141E28] font-bold">{filteredReports.length}</strong>
          <span> of {reports.length} sample detections</span>
          <div className="text-[10px] text-[#717886] mt-0.5">
            {metrics.needsReview} pending review · {metrics.verified} verified
          </div>
        </div>
      </section>

      {/* 2. Four Compact Summary Metrics */}
      <section
        aria-label="Detection Summary Metrics"
        className="border-y border-[#DCD9CD] grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#DCD9CD]"
      >
        {/* Metric 1: Total Sample Detections */}
        <div className="py-4 sm:py-5 px-4 sm:px-6 flex items-baseline gap-4">
          <span className="text-3xl font-bold font-mono tracking-tight shrink-0 text-[#141E28]">
            {metrics.total}
          </span>
          <div className="min-w-0">
            <div className="font-semibold text-xs text-[#141E28] leading-snug">
              Total sample detections
            </div>
            <div className="text-[10px] font-mono text-[#717886] mt-0.5 truncate">
              Local demonstration records
            </div>
          </div>
        </div>

        {/* Metric 2: Needs Review */}
        <div className="py-4 sm:py-5 px-4 sm:px-6 flex items-baseline gap-4">
          <span className="text-3xl font-bold font-mono tracking-tight shrink-0 text-[#B93829]">
            {metrics.needsReview}
          </span>
          <div className="min-w-0">
            <div className="font-semibold text-xs text-[#141E28] leading-snug">
              Needs review
            </div>
            <div className="text-[10px] font-mono text-[#717886] mt-0.5 truncate">
              Awaiting human verification
            </div>
          </div>
        </div>

        {/* Metric 3: High + Critical Severity */}
        <div className="py-4 sm:py-5 px-4 sm:px-6 flex items-baseline gap-4">
          <span className="text-3xl font-bold font-mono tracking-tight shrink-0 text-[#C25E00]">
            {metrics.highCritical}
          </span>
          <div className="min-w-0">
            <div className="font-semibold text-xs text-[#141E28] leading-snug">
              High + critical severity
            </div>
            <div className="text-[10px] font-mono text-[#717886] mt-0.5 truncate">
              Priority hazard classification
            </div>
          </div>
        </div>

        {/* Metric 4: Verified Reports */}
        <div className="py-4 sm:py-5 px-4 sm:px-6 flex items-baseline gap-4">
          <span className="text-3xl font-bold font-mono tracking-tight shrink-0 text-[#10B981]">
            {metrics.verified}
          </span>
          <div className="min-w-0">
            <div className="font-semibold text-xs text-[#141E28] leading-snug">
              Verified reports
            </div>
            <div className="text-[10px] font-mono text-[#717886] mt-0.5 truncate">
              Validated road damage records
            </div>
          </div>
        </div>
      </section>

      {/* 3. Feedback Notification Banner */}
      {notification && (
        <aside
          role="status"
          aria-live="polite"
          className="border border-[#10B981]/40 bg-[#10B981]/10 px-4 py-3 rounded-xs flex items-center justify-between gap-3 text-xs text-[#141E28]"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 rounded text-[#717886] hover:text-[#141E28] transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* 4. Compact Toolbar: Search, Filters & Export CSV */}
      <section
        aria-label="Detection Filter Toolbar"
        className="border border-[#DCD9CD] bg-[#F6F5EE] p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs rounded-xs"
      >
        {/* Left: Search input & Dropdown filters */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search by ID, Road, Sublocation, Damage, or Notes */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-3.5 h-3.5 text-[#717886] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, road, locality, damage or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-white border border-[#DCD9CD] rounded-xs text-xs text-[#141E28] placeholder-[#717886] focus:outline-none focus:ring-1 focus:ring-[#141E28] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#717886] hover:text-[#141E28] cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Severity Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="detection-severity-select" className="text-[10px] font-mono uppercase text-[#717886]">
              Severity:
            </label>
            <select
              id="detection-severity-select"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-[#DCD9CD] rounded-xs text-xs text-[#141E28] font-medium focus:outline-none focus:ring-1 focus:ring-[#141E28]"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Review-Status Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="detection-status-select" className="text-[10px] font-mono uppercase text-[#717886]">
              Status:
            </label>
            <select
              id="detection-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-[#DCD9CD] rounded-xs text-xs text-[#141E28] font-medium focus:outline-none focus:ring-1 focus:ring-[#141E28]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Needs review">Needs review</option>
              <option value="In review">In review</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Clear Filters Action */}
          {isFilterActive && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-xs text-[#1E6091] hover:text-[#141E28] font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Right: Export CSV Action */}
        <button
          type="button"
          onClick={handleExportCSV}
          disabled={filteredReports.length === 0}
          title={filteredReports.length === 0 ? 'No matching reports to export' : `Export ${filteredReports.length} reports to CSV`}
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xs text-xs font-medium transition-colors shadow-2xs shrink-0 self-start md:self-auto ${
            filteredReports.length === 0
              ? 'bg-[#EAE8DD] border border-[#DCD9CD] text-[#717886] cursor-not-allowed'
              : 'border border-[#DCD9CD] bg-white hover:bg-[#EAE8DD] text-[#141E28] cursor-pointer'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </section>

      {/* 5. Responsive Detections Table */}
      <section aria-label="Road Detections Repository" className="space-y-2">
        <div className="border border-[#DCD9CD] bg-[#F6F5EE] overflow-x-auto rounded-xs">
          <table className="w-full text-left text-xs text-[#141E28] border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-[#DCD9CD] bg-[#EAE8DD] text-[10px] font-mono text-[#717886] uppercase tracking-wider">
                <th scope="col" className="py-2.5 px-4 font-semibold">
                  Report ID
                </th>
                <th scope="col" className="py-2.5 px-4 font-semibold">
                  Location
                </th>
                <th scope="col" className="py-2.5 px-4 font-semibold">
                  Damage Type
                </th>
                <th scope="col" className="py-2.5 px-4 font-semibold">
                  Severity
                </th>
                <th scope="col" className="py-2.5 px-4 font-semibold">
                  Confidence
                </th>
                <th scope="col" className="py-2.5 px-4 font-semibold">
                  Review Status
                </th>
                <th scope="col" className="py-2.5 px-4 font-semibold">
                  Report Time
                </th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD9CD]">
              {filteredReports.map((report) => {
                const isSelected = selectedReport?.id === report.id;

                return (
                  <tr
                    key={report.id}
                    tabIndex={0}
                    onClick={() => setSelectedReport(report)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedReport(report);
                      }
                    }}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-[#EAE8DD]'
                        : 'hover:bg-[#EAE8DD]/40'
                    }`}
                  >
                    {/* 1. Report ID */}
                    <td className="py-3 px-4 font-mono font-bold text-xs text-[#141E28] whitespace-nowrap">
                      {report.id}
                    </td>

                    {/* 2. Road Location & Locality */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-xs text-[#141E28]">
                        {report.roadLocation}
                      </div>
                      <div className="text-[11px] text-[#717886] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#717886] shrink-0" />
                        <span>{report.subLocation}</span>
                      </div>
                    </td>

                    {/* 3. Damage Type */}
                    <td className="py-3 px-4 text-xs text-[#141E28] whitespace-nowrap">
                      {report.damageType}
                    </td>

                    {/* 4. Severity Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[11px] font-medium"
                        style={{ backgroundColor: report.severityBgColor }}
                      >
                        <span
                          className="w-[2px] h-3 rounded-full"
                          style={{ backgroundColor: report.severityAccentColor }}
                        />
                        <span style={{ color: report.severityAccentColor }}>
                          {report.severity}
                        </span>
                      </div>
                    </td>

                    {/* 5. AI Confidence */}
                    <td className="py-3 px-4 font-mono text-xs text-[#1E6091] whitespace-nowrap">
                      {report.confidence || '95.0%'}
                    </td>

                    {/* 6. Review Status with status dot */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 text-xs text-[#141E28]">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: report.statusDotColor }}
                        />
                        <span className="font-medium">{report.reviewStatus}</span>
                      </div>
                    </td>

                    {/* 7. Report Time */}
                    <td className="py-3 px-4 font-mono text-[11px] text-[#717886] whitespace-nowrap">
                      {report.reportTime}
                    </td>

                    {/* 8. Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1E6091] group-hover:text-[#141E28] transition-colors cursor-pointer"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty State when no reports match search/filter */}
          {filteredReports.length === 0 && (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-9 h-9 mx-auto rounded-full bg-[#EAE8DD] border border-[#DCD9CD] flex items-center justify-center text-[#717886]">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#141E28]">
                No Detections Found
              </h3>
              <p className="text-xs text-[#575F6E] max-w-sm mx-auto leading-relaxed">
                No road damage reports match your current search and filter combination in Delhi NCR.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3.5 py-1.5 bg-[#141E28] hover:bg-[#1E2E3E] text-white text-xs font-medium rounded-xs transition-colors cursor-pointer shadow-2xs"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6. Detection Details & Workflow Modal */}
      <DetectionDetailsModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onStatusTransition={handleStatusTransition}
      />
    </div>
  );
}
