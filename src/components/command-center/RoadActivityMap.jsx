import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw
} from 'lucide-react';
import { 
  RECENT_REPORTS, 
  SEVERITY_CONFIG, 
  MAP_LANDMARKS, 
  MAP_ROAD_ARTERIES,
  PROTOTYPE_META 
} from '../../data/mockData';

export function RoadActivityMap({ selectedReport, onSelectReport }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredReport, setHoveredReport] = useState(null);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.2, 1.8));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.2, 0.8));
  const handleReset = () => setZoomLevel(1);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Recent Road Activity
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Reported road damage locations across {PROTOTYPE_META.activeRegion} (sample data)
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
          <span>{PROTOTYPE_META.activeRegion} Grid</span>
        </div>
      </div>

      {/* Map Canvas (Refined Light GIS Cartography) */}
      <div className="relative flex-1 min-h-[380px] bg-[#f8faf9] overflow-hidden select-none">
        <svg
          viewBox="0 0 520 460"
          className="w-full h-full"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out'
          }}
        >
          <defs>
            {/* Subtle grid pattern */}
            <pattern id="light-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e9ecef" strokeWidth="0.6" />
            </pattern>

            {/* River Yamuna gradient */}
            <linearGradient id="river-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Background land surface */}
          <rect width="520" height="460" fill="#f8faf9" />
          <rect width="520" height="460" fill="url(#light-grid)" opacity="0.6" />

          {/* Natural geography: River Yamuna flowing through Delhi & Noida */}
          <path
            d="M 240,0 C 260,80 270,140 290,190 C 310,240 330,280 345,350 C 360,400 370,430 380,460"
            fill="none"
            stroke="url(#river-grad)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <text
            x="320"
            y="130"
            fill="#93c5fd"
            fontSize="8"
            fontFamily="sans-serif"
            fontWeight="bold"
            letterSpacing="1.5"
            transform="rotate(35 320 130)"
          >
            YAMUNA RIVER
          </text>

          {/* Secondary road mesh underlay */}
          <g stroke="#e2e8f0" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <line x1="60" y1="200" x2="460" y2="200" />
            <line x1="80" y1="270" x2="440" y2="270" />
            <line x1="200" y1="50" x2="200" y2="420" />
            <line x1="360" y1="80" x2="360" y2="400" />
            <line x1="120" y1="120" x2="400" y2="380" />
          </g>

          {/* Primary Arterial Road Networks */}
          {MAP_ROAD_ARTERIES.map((road) => (
            <g key={road.id}>
              {/* Road casing */}
              <path
                d={road.d}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Road surface */}
              <path
                d={road.d}
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ))}

          {/* Geographic Labels & Metropolitan Centers */}
          {MAP_LANDMARKS.map((landmark) => (
            <g key={landmark.name}>
              {landmark.isCapital ? (
                // New Delhi central label
                <g>
                  <circle cx={landmark.x} cy={landmark.y} r="3" fill="#0f172a" />
                  <circle cx={landmark.x} cy={landmark.y} r="6" fill="none" stroke="#94a3b8" strokeWidth="1" />
                  <text
                    x={landmark.x}
                    y={landmark.y - 10}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="sans-serif"
                    letterSpacing="-0.2px"
                  >
                    {landmark.name}
                  </text>
                </g>
              ) : (
                // Regional city label (Gurugram, Noida, etc.)
                <text
                  x={landmark.x}
                  y={landmark.y}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="sans-serif"
                  letterSpacing="0.8px"
                >
                  {landmark.name}
                </text>
              )}
            </g>
          ))}

          {/* Reported Damage Pins */}
          {RECENT_REPORTS.map((report, idx) => {
            const isSelected = selectedReport?.id === report.id;
            const isHovered = hoveredReport?.id === report.id;
            const config = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.Low;

            return (
              <g
                key={report.id}
                onClick={() => onSelectReport && onSelectReport(report)}
                onMouseEnter={() => setHoveredReport(report)}
                onMouseLeave={() => setHoveredReport(null)}
                className="cursor-pointer group"
              >
                {/* Highlight ring for selected pin */}
                {isSelected && (
                  <circle
                    cx={report.mapPos.x}
                    cy={report.mapPos.y}
                    r="15"
                    fill="none"
                    stroke={config.pinColor}
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                )}

                {/* Base circle marker */}
                <circle
                  cx={report.mapPos.x}
                  cy={report.mapPos.y}
                  r={isSelected ? 10 : 8}
                  fill={config.pinColor}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-125"
                />

                {/* Number / Symbol indicator */}
                <text
                  x={report.mapPos.x}
                  y={report.mapPos.y + 3}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {idx + 1}
                </text>

                {/* Tooltip on hover */}
                {isHovered && (
                  <g pointerEvents="none">
                    <rect
                      x={report.mapPos.x - 60}
                      y={report.mapPos.y - 36}
                      width="120"
                      height="24"
                      rx="4"
                      fill="#0f172a"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    <text
                      x={report.mapPos.x}
                      y={report.mapPos.y - 20}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="500"
                      fontFamily="sans-serif"
                    >
                      {report.damageType} · {report.location.split(',')[0]}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Map Overlay Controls (Top Right: Zoom buttons) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-md shadow-xs p-1">
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Map Scale & Region Indicator (Bottom Right) */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs border border-slate-200 px-2.5 py-1 rounded text-[10px] font-mono text-slate-600 flex items-center gap-2 shadow-xs">
          <div className="flex items-center gap-1">
            <span className="w-6 h-1 bg-slate-700 inline-block" />
            <span>5 km</span>
          </div>
        </div>
      </div>

      {/* Map Legend Footer */}
      <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-600 text-[11px]">Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-slate-600 text-[11px]">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-600 text-[11px]">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="text-slate-600 text-[11px]">Low</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Interactive Map Preview
        </span>
      </div>
    </div>
  );
}
