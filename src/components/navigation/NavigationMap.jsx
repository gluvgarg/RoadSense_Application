import React, { useRef, useEffect, useState, useMemo } from 'react';
import Map, { Marker, NavigationControl, Source, Layer } from 'react-map-gl/mapbox';
import { 
  X, 
  MapPin, 
  RotateCcw, 
  Key, 
  AlertCircle, 
  ArrowRight
} from 'lucide-react';
import { DELHI_NCR_MAP_CENTER } from '../../data/mockData';
import { calculateRouteBounds } from '../../utils/geoUtils';

// Established RoadSense severity configuration
const SEVERITY_CONFIG = {
  Critical: {
    color: '#B93829',
    bgColor: '#FDF2F0',
    glyph: '!',
    label: 'Critical'
  },
  High: {
    color: '#C25E00',
    bgColor: '#FEF6EE',
    glyph: '▲',
    label: 'High'
  },
  Moderate: {
    color: '#B48C00',
    bgColor: '#FEFCE8',
    glyph: '=',
    label: 'Moderate'
  },
  Low: {
    color: '#1E6091',
    bgColor: '#F0F7FA',
    glyph: '●',
    label: 'Low'
  }
};

function getSeverityConfig(severity) {
  return SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.Moderate;
}

export function NavigationMap({
  mapboxToken,
  routes = [],
  selectedRouteIndex = 0,
  _onSelectRoute,
  origin = null,
  destination = null,
  hazards = [],
  selectedHazard = null,
  onSelectHazard,
  className = ''
}) {
  const mapRef = useRef(null);

  // In-session token support if env token is missing
  const envToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const isEnvTokenValid = Boolean(envToken && envToken.trim() !== '' && envToken !== 'your_public_token_here');
  const [sessionToken, setSessionToken] = useState('');
  const [tokenInputError, setTokenInputError] = useState(null);

  const activeToken = sessionToken.trim() || mapboxToken || (isEnvTokenValid ? envToken : '');

  const [hoveredHazardId, setHoveredHazardId] = useState(null);

  const selectedRoute = routes[selectedRouteIndex] || null;

  // Set of hazard report IDs that are proximate to the selected route
  const selectedRouteHazardIds = useMemo(() => {
    if (!selectedRoute?.hazardAnalysis?.nearbyReports) return new Set();
    return new Set(selectedRoute.hazardAnalysis.nearbyReports.map((r) => r.id));
  }, [selectedRoute]);

  // Construct GeoJSON FeatureCollection for alternative (non-selected) routes
  const alternativeRoutesGeoJSON = useMemo(() => {
    const features = [];
    routes.forEach((route, idx) => {
      if (idx !== selectedRouteIndex && route.geometry?.coordinates) {
        features.push({
          type: 'Feature',
          properties: { routeIndex: idx },
          geometry: route.geometry
        });
      }
    });
    return {
      type: 'FeatureCollection',
      features
    };
  }, [routes, selectedRouteIndex]);

  // Construct GeoJSON Feature for the selected route
  const selectedRouteGeoJSON = useMemo(() => {
    if (!selectedRoute?.geometry?.coordinates) return null;
    return {
      type: 'Feature',
      properties: { selected: true },
      geometry: selectedRoute.geometry
    };
  }, [selectedRoute]);

  // Configure Mapbox Standard daytime basemap
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
      console.warn('Navigation basemap configuration notice:', err);
    }
  };

  // Automatically fit map bounds when routes or origin/dest change
  useEffect(() => {
    if (!mapRef.current) return;

    if (selectedRoute?.geometry?.coordinates) {
      const bounds = calculateRouteBounds(
        selectedRoute.geometry.coordinates,
        origin?.coordinates,
        destination?.coordinates
      );
      if (bounds) {
        mapRef.current.fitBounds(bounds, {
          padding: { top: 60, bottom: 60, left: 60, right: 60 },
          duration: 900,
          maxZoom: 14.5
        });
      }
    } else if (origin?.coordinates && destination?.coordinates) {
      const bounds = calculateRouteBounds([], origin.coordinates, destination.coordinates);
      if (bounds) {
        mapRef.current.fitBounds(bounds, {
          padding: { top: 80, bottom: 80, left: 80, right: 80 },
          duration: 800,
          maxZoom: 13
        });
      }
    } else if (origin?.coordinates) {
      mapRef.current.flyTo({
        center: origin.coordinates,
        zoom: 12.5,
        duration: 800
      });
    }
  }, [selectedRoute, origin, destination]);

  const handleResetView = () => {
    if (!mapRef.current) return;
    if (selectedRoute?.geometry?.coordinates) {
      const bounds = calculateRouteBounds(
        selectedRoute.geometry.coordinates,
        origin?.coordinates,
        destination?.coordinates
      );
      if (bounds) {
        mapRef.current.fitBounds(bounds, {
          padding: { top: 60, bottom: 60, left: 60, right: 60 },
          duration: 700
        });
        return;
      }
    }
    mapRef.current.flyTo({
      center: [DELHI_NCR_MAP_CENTER.longitude, DELHI_NCR_MAP_CENTER.latitude],
      zoom: DELHI_NCR_MAP_CENTER.zoom,
      duration: 700
    });
  };

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

  return (
    <div className={`relative w-full border border-[#DCD9CD] bg-[#F6F5EE] overflow-hidden ${className}`}>
      {activeToken ? (
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
          {/* Navigation Controls */}
          <NavigationControl position="top-right" showCompass={true} />

          {/* Alternative Routes Layer (Muted Slate Polyline) */}
          {alternativeRoutesGeoJSON && alternativeRoutesGeoJSON.features.length > 0 && (
            <Source id="alternative-routes" type="geojson" data={alternativeRoutesGeoJSON}>
              <Layer
                id="alt-routes-casing"
                type="line"
                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                paint={{
                  'line-color': '#FFFFFF',
                  'line-width': 6,
                  'line-opacity': 0.7
                }}
              />
              <Layer
                id="alt-routes-line"
                type="line"
                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                paint={{
                  'line-color': '#94A3B8',
                  'line-width': 4.5,
                  'line-opacity': 0.85
                }}
              />
            </Source>
          )}

          {/* Selected Route Layer (Prominent Navy / Road Blue Polyline) */}
          {selectedRouteGeoJSON && (
            <Source id="selected-route" type="geojson" data={selectedRouteGeoJSON}>
              <Layer
                id="selected-route-casing"
                type="line"
                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                paint={{
                  'line-color': '#0F172A',
                  'line-width': 8,
                  'line-opacity': 0.85
                }}
              />
              <Layer
                id="selected-route-line"
                type="line"
                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                paint={{
                  'line-color': '#1E6091',
                  'line-width': 5,
                  'line-opacity': 1
                }}
              />
            </Source>
          )}

          {/* Origin Marker (Point A) */}
          {origin?.coordinates && (
            <Marker
              longitude={origin.coordinates[0]}
              latitude={origin.coordinates[1]}
              anchor="bottom"
            >
              <div className="flex flex-col items-center pointer-events-auto">
                <div className="w-7 h-7 rounded-full bg-[#10B981] text-white border-2 border-white shadow-md flex items-center justify-center font-bold text-xs select-none">
                  A
                </div>
                <div className="w-0 h-0 border-x-4 border-x-transparent border-t-5 -mt-0.5 border-t-[#10B981]" />
              </div>
            </Marker>
          )}

          {/* Destination Marker (Point B) */}
          {destination?.coordinates && (
            <Marker
              longitude={destination.coordinates[0]}
              latitude={destination.coordinates[1]}
              anchor="bottom"
            >
              <div className="flex flex-col items-center pointer-events-auto">
                <div className="w-7 h-7 rounded-full bg-[#141E28] text-white border-2 border-white shadow-md flex items-center justify-center font-bold text-xs select-none">
                  B
                </div>
                <div className="w-0 h-0 border-x-4 border-x-transparent border-t-5 -mt-0.5 border-t-[#141E28]" />
              </div>
            </Marker>
          )}

          {/* Road Damage Hazard Markers */}
          {hazards.map((report) => {
            if (report.reviewStatus === 'Rejected') return null;
            if (typeof report.longitude !== 'number' || typeof report.latitude !== 'number') return null;

            const isSelected = selectedHazard?.id === report.id;
            const isHovered = hoveredHazardId === report.id;
            const isNearSelectedRoute = selectedRouteHazardIds.has(report.id);
            const sevConfig = getSeverityConfig(report.severity);

            return (
              <Marker
                key={report.id}
                longitude={report.longitude}
                latitude={report.latitude}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  onSelectHazard(report);
                }}
              >
                <div
                  className="group relative flex flex-col items-center cursor-pointer focus:outline-none"
                  onMouseEnter={() => setHoveredHazardId(report.id)}
                  onMouseLeave={() => setHoveredHazardId(null)}
                >
                  {/* Floating tooltip label (shown on hover or selection) */}
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
                    aria-label={`Hazard ${report.id}: ${report.damageType} on ${report.roadLocation}`}
                    onFocus={() => setHoveredHazardId(report.id)}
                    onBlur={() => setHoveredHazardId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectHazard(report);
                    }}
                    className="relative flex flex-col items-center cursor-pointer focus:outline-none"
                  >
                    {/* Teardrop Pin Head with White Border */}
                    <div
                      className={`relative w-[28px] h-[28px] rounded-full border-[1.5px] border-white shadow-md flex items-center justify-center transition-all ${
                        isSelected
                          ? 'scale-120 ring-2 ring-offset-2 ring-[#141E28] ring-offset-[#F6F5EE] z-30'
                          : isNearSelectedRoute
                          ? 'ring-2 ring-amber-400/80 scale-105 z-20'
                          : isHovered
                          ? 'scale-110 z-20'
                          : 'opacity-85 z-10'
                      }`}
                      style={{ backgroundColor: sevConfig.color }}
                    >
                      <span className="text-white text-[11px] font-black select-none leading-none">
                        {sevConfig.glyph}
                      </span>
                    </div>

                    {/* Pin Tip */}
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
        /* Setup guidance state if token missing */
        <div className="w-full h-full min-h-[440px] p-6 sm:p-10 flex items-center justify-center bg-[#F6F5EE]">
          <div className="max-w-md w-full bg-[#FAF8F3] border border-[#DCD9CD] p-6 space-y-4 rounded-xs text-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-[#EAE8DD] border border-[#DCD9CD] flex items-center justify-center text-[#141E28] shrink-0">
                <Key className="w-4 h-4 text-[#1E6091]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#141E28]">
                  Mapbox Access Token Required
                </h3>
                <p className="text-xs text-[#575F6E] leading-relaxed">
                  Route calculation and navigation tiles require a valid Mapbox public token.
                </p>
              </div>
            </div>

            <form onSubmit={handleApplySessionToken} className="space-y-2 pt-2 border-t border-[#DCD9CD]">
              <label htmlFor="nav-session-token" className="block text-[11px] font-medium text-[#141E28]">
                Enter a public token for this session:
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="nav-session-token"
                  type="text"
                  value={sessionToken}
                  onChange={(e) => {
                    setSessionToken(e.target.value);
                    setTokenInputError(null);
                  }}
                  placeholder="pk.eyJ1..."
                  className="flex-1 px-3 py-1.5 bg-white border border-[#DCD9CD] rounded-xs font-mono text-xs text-[#141E28]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#141E28] hover:bg-[#1E2E3E] text-white font-medium rounded-xs text-xs cursor-pointer flex items-center gap-1"
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

      {/* Floating Reset View Button (Top Left) */}
      {activeToken && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetView}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F6F5EE]/95 backdrop-blur-xs border border-[#DCD9CD] text-xs font-medium text-[#141E28] hover:bg-[#EAE8DD] rounded-xs shadow-xs transition-colors cursor-pointer"
            title="Fit view to route / Delhi NCR overview"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#575F6E]" />
            <span>{selectedRoute ? 'Fit Route' : 'Center Delhi NCR'}</span>
          </button>
        </div>
      )}

      {/* Floating Selected Hazard Popup (Top Right) */}
      {selectedHazard && (
        <div className="absolute top-4 right-14 z-20 w-76 max-w-[calc(100%-4rem)] bg-[#F6F5EE] border border-[#DCD9CD] shadow-lg rounded-xs text-xs overflow-hidden">
          <div className="px-3.5 py-2.5 bg-[#EAE8DD] border-b border-[#DCD9CD] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-[#141E28]">
                {selectedHazard.id}
              </span>
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] font-medium"
                style={{
                  backgroundColor: selectedHazard.severityBgColor,
                  color: selectedHazard.severityAccentColor
                }}
              >
                {selectedHazard.severity}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectHazard(null)}
              className="p-1 rounded text-[#717886] hover:text-[#141E28] transition-colors cursor-pointer"
              aria-label="Close hazard popup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3.5 space-y-2.5">
            <div>
              <div className="font-bold text-[#141E28] text-xs leading-tight">
                {selectedHazard.roadLocation}
              </div>
              <div className="text-[11px] text-[#717886] mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#717886] shrink-0" />
                <span>{selectedHazard.subLocation}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2 bg-[#EAE8DD]/40 border border-[#DCD9CD] rounded-xs text-[10px]">
              <div>
                <span className="uppercase font-mono text-[#717886] block">Damage Type</span>
                <span className="font-semibold text-[#141E28] mt-0.5 block">{selectedHazard.damageType}</span>
              </div>
              <div>
                <span className="uppercase font-mono text-[#717886] block">Review Status</span>
                <span className="font-medium text-[#141E28] mt-0.5 block">{selectedHazard.reviewStatus}</span>
              </div>
            </div>

            {selectedHazard.notes && (
              <p className="text-[11px] text-[#575F6E] bg-[#EAE8DD]/20 p-2 border border-[#DCD9CD] rounded-xs">
                {selectedHazard.notes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Floating Restrained Map Legend (Bottom Left) */}
      <div className="absolute bottom-6 left-4 z-10 bg-[#F6F5EE]/95 backdrop-blur-xs border border-[#DCD9CD] px-3 py-2 rounded-xs text-xs space-y-1.5 shadow-xs select-none">
        <div className="text-[10px] font-mono text-[#717886] uppercase tracking-wider font-semibold">
          Map Legend
        </div>
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 rounded-full bg-[#1E6091]" />
            <span className="text-[#141E28]">Selected route</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 rounded-full bg-[#94A3B8]" />
            <span className="text-[#575F6E]">Alternative</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B93829]" />
            <span className="text-[#141E28]">Critical hazard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C25E00]" />
            <span className="text-[#141E28]">High hazard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
