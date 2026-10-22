import React, { useState, useRef, useEffect } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import { 
  X, 
  MapPin, 
  Key, 
  AlertCircle, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { DELHI_NCR_MAP_CENTER } from '../../data/mockData';

// Restrained RoadSense severity design configuration
const SEVERITY_CONFIG = {
  Critical: {
    color: '#B93829',
    bgColor: '#FDF2F0',
    glyph: '!',
    glyphRender: () => <span className="text-white text-xs font-black select-none leading-none">!</span>,
    label: 'Critical'
  },
  High: {
    color: '#C25E00',
    bgColor: '#FEF6EE',
    glyph: '▲',
    glyphRender: () => <span className="text-white text-[9px] select-none leading-none -translate-y-[0.5px]">▲</span>,
    label: 'High'
  },
  Moderate: {
    color: '#B48C00',
    bgColor: '#FEFCE8',
    glyph: '=',
    glyphRender: () => <span className="text-white text-xs font-black select-none leading-none tracking-tight">=</span>,
    label: 'Moderate'
  },
  Low: {
    color: '#1E6091',
    bgColor: '#F0F7FA',
    glyph: '●',
    glyphRender: () => <span className="w-2 h-2 rounded-full bg-white shadow-2xs select-none" />,
    label: 'Low'
  }
};

function getSeverityConfig(severity) {
  return SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.Moderate;
}

export function RoadConditionsMap({
  reports = [],
  selectedReport,
  onSelectReport,
  className = ''
}) {
  const envToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const isEnvTokenValid = Boolean(envToken && envToken.trim() !== '' && envToken !== 'your_public_token_here');

  // Support both .env token and optional in-session token for rapid testing
  const [sessionToken, setSessionToken] = useState('');
  const [tokenInputError, setTokenInputError] = useState(null);
  const [hoveredReportId, setHoveredReportId] = useState(null);

  // Derived effective token: session token overrides or falls back to valid env token
  const activeToken = sessionToken.trim() || (isEnvTokenValid ? envToken : '');

  const mapRef = useRef(null);

  // Center gently on selected report without zooming in too deep, preserving surrounding road corridors
  useEffect(() => {
    if (selectedReport && mapRef.current) {
      const currentZoom = typeof mapRef.current.getZoom === 'function'
        ? mapRef.current.getZoom()
        : DELHI_NCR_MAP_CENTER.zoom;
      // Gentle target zoom between 11.2 and 11.5
      const targetZoom = Math.min(Math.max(currentZoom, 11.2), 11.5);

      mapRef.current.flyTo({
        center: [selectedReport.longitude, selectedReport.latitude],
        zoom: targetZoom,
        duration: 700,
        essential: true
      });
    }
  }, [selectedReport]);

  const handleApplySessionToken = (e) => {
    e.preventDefault();
    const trimmed = sessionToken.trim();
    if (!trimmed.startsWith('pk.')) {
      setTokenInputError('Mapbox public tokens typically start with "pk."');
      return;
    }
    setTokenInputError(null);
    setSessionToken(trimmed);
  };

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [DELHI_NCR_MAP_CENTER.longitude, DELHI_NCR_MAP_CENTER.latitude],
        zoom: DELHI_NCR_MAP_CENTER.zoom,
        duration: 700,
        essential: true
      });
    }
  };

  // Configure Mapbox Standard daytime basemap, clear road labels, and uncluttered display
  const handleMapLoad = (e) => {
    const map = e.target;
    try {
      if (typeof map.setConfigProperty === 'function') {
        map.setConfigProperty('basemap', 'lightPreset', 'day');
        map.setConfigProperty('basemap', 'show3dObjects', false);
        map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
        map.setConfigProperty('basemap', 'showTransitLabels', false);
        map.setConfigProperty('basemap', 'showPlaceLabels', true);
        map.setConfigProperty('basemap', 'showRoadLabels', true);
      }
    } catch (err) {
      console.warn('Mapbox basemap configuration notice:', err);
    }
  };

  const selectedSevConfig = selectedReport ? getSeverityConfig(selectedReport.severity) : null;

  return (
    <div className={`relative w-full border border-[#DCD9CD] bg-[#F6F5EE] overflow-hidden ${className}`}>
      {activeToken ? (
        /* Real Mapbox GL JS Standard Basemap */
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: DELHI_NCR_MAP_CENTER.longitude,
            latitude: DELHI_NCR_MAP_CENTER.latitude,
            zoom: DELHI_NCR_MAP_CENTER.zoom
          }}
          mapStyle="mapbox://styles/mapbox/standard"
          mapboxAccessToken={activeToken}
          onLoad={handleMapLoad}
          style={{ width: '100%', height: '100%' }}
          attributionControl={true}
        >
          {/* Functional Navigation Controls (Zoom in / Zoom out / Bearing) */}
          <NavigationControl position="top-right" showCompass={true} />

          {/* Interactive Severity Markers */}
          {reports.map((report) => {
            const isSelected = selectedReport?.id === report.id;
            const isHovered = hoveredReportId === report.id;
            const sevConfig = getSeverityConfig(report.severity);

            return (
              <Marker
                key={report.id}
                longitude={report.longitude}
                latitude={report.latitude}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  if (onSelectReport) {
                    onSelectReport(report);
                  }
                }}
              >
                <div
                  className="group relative flex flex-col items-center cursor-pointer focus:outline-none"
                  onMouseEnter={() => setHoveredReportId(report.id)}
                  onMouseLeave={() => setHoveredReportId(null)}
                >
                  {/* Floating location label (Shown only on hover or selection) */}
                  {(isSelected || isHovered) && (
                    <div className="absolute -top-7 pointer-events-none z-40 flex flex-col items-center">
                      <div className="px-2 py-0.5 bg-[#141E28] text-white text-[11px] font-medium rounded-xs shadow-md whitespace-nowrap flex items-center gap-1.5">
                        <span>{report.roadLocation}</span>
                        <span className="text-[10px] text-[#A5B4FC] font-mono">
                          ({report.severity})
                        </span>
                      </div>
                      <div className="w-0 h-0 border-x-3 border-x-transparent border-t-3 border-t-[#141E28]" />
                    </div>
                  )}

                  <button
                    type="button"
                    tabIndex={0}
                    aria-label={`Report ${report.id}: ${report.damageType} on ${report.roadLocation}, ${report.severity} severity`}
                    onFocus={() => setHoveredReportId(report.id)}
                    onBlur={() => setHoveredReportId(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (onSelectReport) {
                          onSelectReport(report);
                        }
                      }
                    }}
                    className="relative flex flex-col items-center cursor-pointer focus:outline-none"
                  >
                    {/* Teardrop Pin Head (30px diameter, white border, subtle shadow, severity glyph) */}
                    <div
                      className={`relative w-[30px] h-[30px] rounded-full border-[1.5px] border-white shadow-md flex items-center justify-center transition-all ${
                        isSelected
                          ? 'scale-115 ring-2 ring-offset-2 ring-[#141E28] ring-offset-[#F6F5EE] z-30'
                          : isHovered
                          ? 'scale-110 z-20'
                          : 'z-10'
                      }`}
                      style={{ backgroundColor: sevConfig.color }}
                    >
                      {sevConfig.glyphRender()}
                    </div>

                    {/* Pin Pointer Teardrop Tip */}
                    <div
                      className="w-0 h-0 border-x-4 border-x-transparent border-t-5 -mt-0.5 shadow-2xs"
                      style={{ borderTopColor: sevConfig.color }}
                    />
                  </button>
                </div>
              </Marker>
            );
          })}
        </Map>
      ) : (
        /* Setup Guidance State when no VITE_MAPBOX_ACCESS_TOKEN is configured */
        <div className="w-full h-full min-h-[480px] p-6 sm:p-10 flex items-center justify-center bg-[#F6F5EE]">
          <div className="max-w-xl w-full bg-[#FAF8F3] border border-[#DCD9CD] p-6 sm:p-8 space-y-5 rounded-xs text-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-[#EAE8DD] border border-[#DCD9CD] flex items-center justify-center text-[#141E28] shrink-0">
                <Key className="w-4 h-4 text-[#1E6091]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#141E28] tracking-tight">
                  Mapbox Access Token Required
                </h3>
                <p className="text-xs text-[#575F6E] leading-relaxed">
                  To display genuine Mapbox Standard tiles and road corridors across Delhi NCR, configure a public Mapbox token.
                </p>
              </div>
            </div>

            <div className="space-y-2 p-3.5 bg-[#EAE8DD]/40 border border-[#DCD9CD] rounded-xs font-mono text-[11px] text-[#575F6E]">
              <div className="font-semibold text-[#141E28] uppercase tracking-wider text-[10px]">
                Setup Instructions:
              </div>
              <p>1. Copy your public token from <a href="https://account.mapbox.com" target="_blank" rel="noreferrer" className="text-[#1E6091] underline">account.mapbox.com</a></p>
              <p>2. Add to your local <code className="text-[#141E28] bg-[#EAE8DD] px-1 py-0.5">roadsense/.env</code>:</p>
              <div className="p-2 bg-[#141E28] text-white rounded-xs select-all text-[11px]">
                VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1...
              </div>
              <p>3. Restart the dev server (<code className="text-[#141E28]">npm run dev</code>)</p>
            </div>

            {/* Quick Session Input to test immediately without restarting */}
            <form onSubmit={handleApplySessionToken} className="space-y-2 pt-1 border-t border-[#DCD9CD]">
              <label htmlFor="session-token" className="block text-[11px] font-medium text-[#141E28]">
                Or enter a public token for this browser session:
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="session-token"
                  type="text"
                  value={sessionToken}
                  onChange={(e) => {
                    setSessionToken(e.target.value);
                    setTokenInputError(null);
                  }}
                  placeholder="pk.eyJ1..."
                  className="flex-1 px-3 py-1.5 bg-white border border-[#DCD9CD] rounded-xs font-mono text-xs text-[#141E28] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#141E28]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#141E28] hover:bg-[#1E2E3E] text-white font-medium rounded-xs text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {tokenInputError && (
                <div className="text-[11px] text-[#B93829] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{tokenInputError}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Floating Severity Legend (Bottom Left) */}
      <div className="absolute bottom-6 left-4 z-10 bg-[#F6F5EE]/95 backdrop-blur-xs border border-[#DCD9CD] px-3.5 py-2.5 rounded-xs text-xs space-y-2 shadow-xs select-none">
        <div className="text-[10px] font-mono text-[#717886] uppercase tracking-wider font-semibold">
          Damage Severity
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#B93829] border border-white text-white flex items-center justify-center text-[10px] font-black shadow-xs">
              !
            </span>
            <span className="text-[#141E28] font-medium">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#C25E00] border border-white text-white flex items-center justify-center text-[8px] shadow-xs">
              ▲
            </span>
            <span className="text-[#141E28] font-medium">High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#B48C00] border border-white text-white flex items-center justify-center text-[9px] font-black shadow-xs">
              =
            </span>
            <span className="text-[#141E28] font-medium">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#1E6091] border border-white text-white flex items-center justify-center shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </span>
            <span className="text-[#141E28] font-medium">Low</span>
          </div>
        </div>
      </div>

      {/* Reset View Button (Top Left) */}
      {activeToken && (
        <div className="absolute top-4 left-4 z-10">
          <button
            type="button"
            onClick={handleResetView}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F6F5EE]/95 backdrop-blur-xs border border-[#DCD9CD] text-xs font-medium text-[#141E28] hover:bg-[#EAE8DD] rounded-xs shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-[#141E28] cursor-pointer"
            title="Reset to Delhi NCR overview"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#575F6E]" />
            <span>Center Delhi NCR</span>
          </button>
        </div>
      )}

      {/* Floating Selected Report Details Panel (Top Right over map) */}
      {selectedReport && selectedSevConfig && (
        <div className="absolute top-4 right-14 z-20 w-80 max-w-[calc(100%-4rem)] bg-[#F6F5EE] border border-[#DCD9CD] shadow-lg rounded-xs text-xs overflow-hidden">
          {/* Panel Header */}
          <div className="px-4 py-2.5 bg-[#EAE8DD] border-b border-[#DCD9CD] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-[#141E28]">
                {selectedReport.id}
              </span>
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] font-medium"
                style={{
                  backgroundColor: selectedSevConfig.bgColor,
                  color: selectedSevConfig.color
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: selectedSevConfig.color }}
                />
                {selectedReport.severity}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onSelectReport) {
                  onSelectReport(null);
                }
              }}
              className="p-1 rounded text-[#717886] hover:text-[#141E28] hover:bg-[#DCD9CD]/60 transition-colors focus:outline-none cursor-pointer"
              aria-label="Close details"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Panel Body */}
          <div className="p-4 space-y-3">
            <div>
              <div className="font-bold text-[#141E28] text-sm leading-tight">
                {selectedReport.roadLocation}
              </div>
              <div className="text-[11px] text-[#717886] mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#717886] shrink-0" />
                <span>{selectedReport.subLocation}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#EAE8DD]/40 border border-[#DCD9CD] rounded-xs text-[11px]">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#717886] block">Damage Type</span>
                <span className="font-semibold text-[#141E28] block mt-0.5">{selectedReport.damageType}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#717886] block">Review Status</span>
                <div className="inline-flex items-center gap-1.5 mt-0.5 font-medium text-[#141E28]">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedReport.statusDotColor }} />
                  <span>{selectedReport.reviewStatus}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#717886] block">Report Time</span>
                <span className="font-mono text-[#141E28] block mt-0.5">{selectedReport.reportTime}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#717886] block">Coordinates</span>
                <span className="font-mono text-[#575F6E] block mt-0.5 text-[10px]">
                  {selectedReport.latitude.toFixed(4)}° N, {selectedReport.longitude.toFixed(4)}° E
                </span>
              </div>
              {selectedReport.confidence && (
                <div className="col-span-2 pt-1 border-t border-[#DCD9CD]/60">
                  <span className="text-[10px] uppercase font-mono text-[#717886] block">AI Model Confidence</span>
                  <span className="font-mono font-medium text-[#1E6091] block mt-0.5">{selectedReport.confidence}</span>
                </div>
              )}
            </div>

            {selectedReport.notes && (
              <div>
                <span className="text-[10px] uppercase font-mono text-[#717886] block mb-0.5">Observation Notes</span>
                <p className="text-[#575F6E] text-[11px] leading-relaxed bg-[#EAE8DD]/20 p-2 border border-[#DCD9CD] rounded-xs font-sans">
                  {selectedReport.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
