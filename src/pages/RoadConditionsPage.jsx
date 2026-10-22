import { useState, useMemo } from 'react';
import { Search, Filter, RotateCcw, X } from 'lucide-react';

import { RoadConditionsMap } from '../components/road-conditions/RoadConditionsMap';
import { ROAD_CONDITIONS_REPORTS } from '../data/mockData';

export function RoadConditionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState(null);

  // Check if any filter is actively applied
  const isFilterActive = searchQuery.trim() !== '' || severityFilter !== 'ALL' || statusFilter !== 'ALL';

  // Filter reports
  const filteredReports = useMemo(() => {
    return ROAD_CONDITIONS_REPORTS.filter((report) => {
      // 1. Severity filter
      if (severityFilter !== 'ALL' && report.severity !== severityFilter) {
        return false;
      }

      // 2. Review status filter
      if (statusFilter !== 'ALL' && report.reviewStatus !== statusFilter) {
        return false;
      }

      // 3. Search query (roadLocation, subLocation, damageType, id)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesRoad = report.roadLocation.toLowerCase().includes(q);
        const matchesSub = report.subLocation.toLowerCase().includes(q);
        const matchesDamage = report.damageType.toLowerCase().includes(q);
        const matchesId = report.id.toLowerCase().includes(q);
        if (!matchesRoad && !matchesSub && !matchesDamage && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, severityFilter, statusFilter]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSeverityFilter('ALL');
    setStatusFilter('ALL');
    setSelectedReport(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Editorial Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono text-[#717886] uppercase tracking-wider">
            02 / ROAD CONDITIONS
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#141E28] tracking-tight leading-none">
            Road Conditions
          </h1>

          <p className="text-xs sm:text-sm text-[#575F6E] leading-relaxed pt-0.5">
            Explore reported road damage across Delhi NCR.
          </p>
        </div>

        {/* Live Filter Counter Indicator */}
        <div className="text-[11px] font-mono text-[#717886] sm:text-right shrink-0">
          <span>Showing </span>
          <strong className="text-[#141E28] font-bold">{filteredReports.length}</strong>
          <span> of {ROAD_CONDITIONS_REPORTS.length} reports</span>
        </div>
      </section>

      {/* 2. Compact Filter Toolbar */}
      <section
        aria-label="Filter Toolbar"
        className="border border-[#DCD9CD] bg-[#F6F5EE] p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs rounded-xs"
      >
        {/* Left: Search input & filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search by Road or Area */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#717886] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by road or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-white border border-[#DCD9CD] rounded-xs text-xs text-[#141E28] placeholder-[#717886] focus:outline-none focus:ring-1 focus:ring-[#141E28] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#717886] hover:text-[#141E28]"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Severity Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="severity-select" className="text-[10px] font-mono uppercase text-[#717886]">
              Severity:
            </label>
            <select
              id="severity-select"
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
            <label htmlFor="status-select" className="text-[10px] font-mono uppercase text-[#717886]">
              Status:
            </label>
            <select
              id="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-[#DCD9CD] rounded-xs text-xs text-[#141E28] font-medium focus:outline-none focus:ring-1 focus:ring-[#141E28]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Needs review">Needs review</option>
              <option value="In review">In review</option>
              <option value="Verified">Verified</option>
            </select>
          </div>
        </div>

        {/* Right: Clear Filters action if active */}
        {isFilterActive && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1.5 text-xs text-[#1E6091] hover:text-[#141E28] font-medium transition-colors self-start md:self-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear filters</span>
          </button>
        )}
      </section>

      {/* 3. Main Map Area (Occupies most of available content area) */}
      <section
        aria-label="Delhi NCR Geographic Map"
        className="relative w-full h-[620px] min-h-[520px] rounded-xs overflow-hidden"
      >
        <RoadConditionsMap
          reports={filteredReports}
          selectedReport={selectedReport}
          onSelectReport={setSelectedReport}
          className="h-full"
        />

        {/* Empty State Overlay when no reports match */}
        {filteredReports.length === 0 && (
          <div className="absolute inset-0 z-30 bg-[#F6F5EE]/90 backdrop-blur-xs flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-[#FAF8F3] border border-[#DCD9CD] p-6 text-center space-y-3 rounded-xs shadow-sm">
              <div className="w-8 h-8 mx-auto rounded-full bg-[#EAE8DD] border border-[#DCD9CD] flex items-center justify-center text-[#717886]">
                <Filter className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#141E28]">
                No Road Reports Found
              </h3>
              <p className="text-xs text-[#575F6E] leading-relaxed">
                No damage reports match your current search and filter combination in Delhi NCR.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3.5 py-1.5 bg-[#141E28] hover:bg-[#1E2E3E] text-white text-xs font-medium rounded-xs transition-colors shadow-2xs"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
