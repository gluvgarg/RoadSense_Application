import React from 'react';
import { 
  Bell, 
  RefreshCw, 
  Database, 
  MapPin
} from 'lucide-react';
import { PROTOTYPE_METADATA, OPERATIONAL_METRICS } from '../../data/mockData';


export function TopBar({ 
  pageTitle = 'Command Center', 
  subtitle = 'Real-time road surface condition & edge telemetry overview',
  timeRange = '24h',
  onTimeRangeChange,
  onRefresh,
  isRefreshing = false
}) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left: Page Context & Geographic Sector */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 tracking-tight truncate">
              {pageTitle}
            </h1>
            <span className="hidden sm:inline-block text-slate-300">/</span>
            <span className="hidden sm:flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 truncate">
              <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
              {PROTOTYPE_METADATA.sector}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate hidden md:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Operational Status, Prototype Mode Indicator, Controls */}
      <div className="flex items-center gap-3">
        {/* CLEARLY IDENTIFIED PROTOTYPE SAMPLE DATA BADGE */}
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/90 rounded text-xs font-medium"
          title="This interface is displaying synthetic sample data for frontend development and testing."
        >
          <Database className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="font-semibold text-[11px]">SAMPLE DATA</span>
          <span className="text-[10px] text-amber-700 hidden lg:inline font-mono">
            (Synthetic Telemetry)
          </span>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* Live Stream Telemetry Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-slate-600 text-[11px] font-medium">Edge Ingest</span>
          <span className="font-mono text-[11px] font-semibold text-slate-900">
            {OPERATIONAL_METRICS.telemetryStreamRate} msg/s
          </span>
        </div>

        {/* Time Window Selector */}
        <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
          {['1h', '6h', '24h', '7d'].map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange && onTimeRangeChange(range)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                timeRange === range
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Refresh Action Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors disabled:opacity-50"
          title="Refresh Telemetry Feed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
        </button>

        {/* Critical Alert Indicator */}
        <div className="relative">
          <button 
            className="p-1.5 rounded border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors relative"
            title={`${OPERATIONAL_METRICS.criticalHazards} Critical Hazards Detected`}
          >
            <Bell className="w-3.5 h-3.5" />
            {OPERATIONAL_METRICS.criticalHazards > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {OPERATIONAL_METRICS.criticalHazards}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
