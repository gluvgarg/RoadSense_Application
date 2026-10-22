import React, { useState, useCallback } from 'react';
import { 
  Navigation as NavigationIcon, 
  ArrowUpDown, 
  Loader2, 
  AlertCircle, 
  Route, 
  Sparkles
} from 'lucide-react';
import { ROAD_CONDITIONS_REPORTS } from '../data/mockData';
import { LocationSearchInput } from '../components/navigation/LocationSearchInput';
import { NavigationMap } from '../components/navigation/NavigationMap';
import { RouteComparisonPanel } from '../components/navigation/RouteComparisonPanel';
import { calculateRouteHazards } from '../utils/geoUtils';

// Curated Delhi NCR operational demonstration corridor shortcuts
const DEMO_SHORTCUTS = [
  {
    label: 'India Gate → Nehru Place',
    origin: {
      name: 'India Gate, New Delhi, Delhi, India',
      primaryName: 'India Gate',
      coordinates: [77.2295, 28.6129]
    },
    destination: {
      name: 'Nehru Place, New Delhi, Delhi, India',
      primaryName: 'Nehru Place',
      coordinates: [77.2536, 28.5494]
    }
  },
  {
    label: 'Dwarka Sec 21 → Ashram Chowk',
    origin: {
      name: 'Sector 21 Dwarka, New Delhi, Delhi, India',
      primaryName: 'Dwarka Sector 21',
      coordinates: [77.0583, 28.5524]
    },
    destination: {
      name: 'Ashram Chowk, New Delhi, Delhi, India',
      primaryName: 'Ashram Chowk',
      coordinates: [77.2584, 28.5721]
    }
  },
  {
    label: 'Moti Bagh → Noida Sec 128',
    origin: {
      name: 'Moti Bagh, New Delhi, Delhi, India',
      primaryName: 'Moti Bagh',
      coordinates: [77.1706, 28.5833]
    },
    destination: {
      name: 'Sector 128, Noida, Uttar Pradesh, India',
      primaryName: 'Noida Sector 128',
      coordinates: [77.3752, 28.5283]
    }
  }
];

export function NavigationPage() {
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [recommendedRouteIndex, setRecommendedRouteIndex] = useState(0);
  const [recommendationReason, setRecommendationReason] = useState('');
  const [selectedHazard, setSelectedHazard] = useState(null);

  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [routeError, setRouteError] = useState(null);

  // Validate if both origin and destination have valid coordinates
  const isReadyToRoute = Boolean(origin?.coordinates && destination?.coordinates);

  // Calculate driving routes using Mapbox Directions API and compute hazard exposure
  const calculateRoutes = useCallback(
    async (fromLoc = origin, toLoc = destination) => {
      if (!fromLoc?.coordinates || !toLoc?.coordinates) {
        setRouteError('Please select both a valid origin and destination location.');
        return;
      }

      if (!mapboxToken || mapboxToken === 'your_public_token_here') {
        setRouteError('Mapbox access token is required to calculate driving routes.');
        return;
      }

      setIsLoadingRoutes(true);
      setRouteError(null);
      setSelectedHazard(null);

      try {
        const [origLng, origLat] = fromLoc.coordinates;
        const [destLng, destLat] = toLoc.coordinates;

        const endpoint = `https://api.mapbox.com/directions/v5/mapbox/driving/${origLng},${origLat};${destLng},${destLat}?alternatives=true&geometries=geojson&overview=full&steps=true&access_token=${mapboxToken}`;

        const res = await fetch(endpoint);
        if (!res.ok) {
          throw new Error(`Mapbox Directions API error: HTTP ${res.status}`);
        }

        const data = await res.json();
        const apiRoutes = data.routes || [];

        if (apiRoutes.length === 0) {
          throw new Error('No drivable routes found between these locations.');
        }

        // For each route, compute proximity and hazard exposure against ROAD_CONDITIONS_REPORTS
        const analyzedRoutes = apiRoutes.map((route) => {
          const hazardAnalysis = calculateRouteHazards(
            route.geometry?.coordinates || [],
            ROAD_CONDITIONS_REPORTS,
            150 // 150m proximity threshold
          );

          return {
            ...route,
            hazardAnalysis
          };
        });

        // Determine recommended route: lowest exposureIndex, tie-breaker: shorter duration
        let bestIndex = 0;
        let isTie = true;

        for (let i = 1; i < analyzedRoutes.length; i++) {
          const curr = analyzedRoutes[i];
          const best = analyzedRoutes[bestIndex];

          if (curr.hazardAnalysis.exposureIndex < best.hazardAnalysis.exposureIndex) {
            bestIndex = i;
            isTie = false;
          } else if (curr.hazardAnalysis.exposureIndex > best.hazardAnalysis.exposureIndex) {
            isTie = false;
          } else {
            // Equal exposure index: check duration
            if (curr.duration < best.duration) {
              bestIndex = i;
            }
          }
        }

        // Construct concise rationale
        const bestRoute = analyzedRoutes[bestIndex];
        const reportCount = bestRoute.hazardAnalysis.nearbyReports.length;
        let reason = '';

        if (analyzedRoutes.length === 1) {
          reason = `Single route available — ${reportCount} nearby sample ${
            reportCount === 1 ? 'hazard' : 'hazards'
          } (Exposure Index: ${bestRoute.hazardAnalysis.exposureIndex} pts).`;
        } else if (isTie) {
          reason = `Identical demo hazard exposure across routes (${bestRoute.hazardAnalysis.exposureIndex} pts) — Route ${bestIndex + 1} chosen as the fastest alternative.`;
        } else {
          const otherRoute = analyzedRoutes.find((_, idx) => idx !== bestIndex);
          const otherExp = otherRoute?.hazardAnalysis?.exposureIndex;
          reason = `Lower demo-hazard exposure — Route ${bestIndex + 1} has ${bestRoute.hazardAnalysis.exposureIndex} exposure pts (${reportCount} nearby reports) compared to ${otherExp} pts on Route ${
            analyzedRoutes.indexOf(otherRoute) + 1
          }.`;
        }

        setRoutes(analyzedRoutes);
        setRecommendedRouteIndex(bestIndex);
        setSelectedRouteIndex(bestIndex);
        setRecommendationReason(reason);
      } catch (err) {
        console.warn('Route calculation error:', err);
        setRouteError(err.message || 'Unable to calculate routes between selected locations.');
        setRoutes([]);
      } finally {
        setIsLoadingRoutes(false);
      }
    },
    [origin, destination, mapboxToken]
  );

  // Handle shortcut selection
  const handleSelectShortcut = (shortcut) => {
    setOrigin(shortcut.origin);
    setDestination(shortcut.destination);
    setRouteError(null);
    calculateRoutes(shortcut.origin, shortcut.destination);
  };

  // Swap origin and destination
  const handleSwapLocations = () => {
    const prevOrigin = origin;
    const prevDest = destination;
    setOrigin(prevDest);
    setDestination(prevOrigin);
    if (prevDest?.coordinates && prevOrigin?.coordinates) {
      calculateRoutes(prevDest, prevOrigin);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Editorial Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono text-[#717886] uppercase tracking-wider">
              05 / NAVIGATION
            </span>
            <span className="border border-[#DCD9CD] bg-[#F6F5EE] px-1.5 py-0.5 rounded-xs text-[10px] font-mono text-[#717886]">
              DEMO DATA
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#141E28] tracking-tight leading-none">
            Road-Quality Navigation
          </h1>

          <p className="text-xs sm:text-sm text-[#575F6E] leading-relaxed pt-0.5">
            Compare driving routes against reported road hazards across Delhi NCR.
          </p>
        </div>

        {/* Status / Shortcut Indicator */}
        <div className="text-[11px] font-mono text-[#717886] sm:text-right shrink-0">
          <span>Profile: </span>
          <strong className="text-[#141E28] font-bold">Standard Driving</strong>
          <span> · 150m hazard proximity</span>
        </div>
      </section>

      {/* 2. Route Search & Configuration Panel */}
      <section
        aria-label="Route Planning Configuration"
        className="border border-[#DCD9CD] bg-[#F6F5EE] p-4 sm:p-5 rounded-xs space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Origin Input */}
          <div className="md:col-span-5">
            <LocationSearchInput
              label="Origin (Start Location)"
              placeholder="Search origin address or place in Delhi NCR..."
              value={origin}
              onSelectLocation={(loc) => {
                setOrigin(loc);
                setRouteError(null);
              }}
              onClear={() => {
                setOrigin(null);
                setRoutes([]);
              }}
              mapboxToken={mapboxToken}
              badgeText="A"
              badgeColorClass="text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30"
            />
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pb-1">
            <button
              type="button"
              onClick={handleSwapLocations}
              disabled={!origin && !destination}
              title="Swap Origin and Destination"
              className="p-1.5 border border-[#DCD9CD] bg-white hover:bg-[#EAE8DD] disabled:opacity-40 disabled:cursor-not-allowed rounded-xs text-[#575F6E] hover:text-[#141E28] transition-colors cursor-pointer"
            >
              <ArrowUpDown className="w-4 h-4 md:rotate-90" />
            </button>
          </div>

          {/* Destination Input */}
          <div className="md:col-span-4">
            <LocationSearchInput
              label="Destination (End Location)"
              placeholder="Search destination address or place..."
              value={destination}
              onSelectLocation={(loc) => {
                setDestination(loc);
                setRouteError(null);
              }}
              onClear={() => {
                setDestination(null);
                setRoutes([]);
              }}
              mapboxToken={mapboxToken}
              badgeText="B"
              badgeColorClass="text-[#141E28] bg-[#141E28]/10 border-[#141E28]/30"
            />
          </div>

          {/* Find Routes Primary Action */}
          <div className="md:col-span-2 flex items-end">
            <button
              type="button"
              onClick={() => calculateRoutes(origin, destination)}
              disabled={!isReadyToRoute || isLoadingRoutes}
              className={`w-full py-2 px-3.5 rounded-xs text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs ${
                !isReadyToRoute || isLoadingRoutes
                  ? 'bg-[#EAE8DD] border border-[#DCD9CD] text-[#717886] cursor-not-allowed'
                  : 'bg-[#141E28] hover:bg-[#1E2E3E] text-white cursor-pointer'
              }`}
            >
              {isLoadingRoutes ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <NavigationIcon className="w-3.5 h-3.5" />
                  <span>Find routes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Shortcuts: Try Example Routes */}
        <div className="pt-2 border-t border-[#DCD9CD]/70 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-mono text-[#717886] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#1E6091]" />
            <span>Try example corridors:</span>
          </span>
          {DEMO_SHORTCUTS.map((shortcut, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectShortcut(shortcut)}
              className="px-2.5 py-1 bg-white hover:bg-[#EAE8DD] border border-[#DCD9CD] rounded-xs text-[11px] font-medium text-[#141E28] transition-colors cursor-pointer"
            >
              {shortcut.label}
            </button>
          ))}
        </div>
      </section>

      {/* Error Alert Banner if route calculation failed */}
      {routeError && (
        <aside
          role="alert"
          className="border border-[#B93829]/40 bg-[#FDF2F0] px-4 py-3 rounded-xs flex items-start gap-2.5 text-xs text-[#B93829]"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Route Calculation Notice</span>
            <span className="text-[11px] leading-relaxed block mt-0.5">{routeError}</span>
          </div>
          <button
            type="button"
            onClick={() => setRouteError(null)}
            className="p-1 text-[#B93829] hover:opacity-75 cursor-pointer"
          >
            <span className="sr-only">Dismiss</span>
            ✕
          </button>
        </aside>
      )}

      {/* 3. Main Workspace: Comparison Panel (Left) & Map (Right) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Route Comparison & Guidance (~40%) */}
        <div className="lg:col-span-5 space-y-4">
          {routes.length > 0 ? (
            <RouteComparisonPanel
              routes={routes}
              selectedRouteIndex={selectedRouteIndex}
              recommendedRouteIndex={recommendedRouteIndex}
              recommendationReason={recommendationReason}
              onSelectRoute={(idx) => {
                setSelectedRouteIndex(idx);
                setSelectedHazard(null);
              }}
            />
          ) : (
            /* Deliberate Initial State before routes are calculated */
            <div className="border border-[#DCD9CD] bg-[#F6F5EE] p-6 rounded-xs space-y-4 text-xs">
              <div className="w-9 h-9 rounded-md bg-[#EAE8DD] border border-[#DCD9CD] flex items-center justify-center text-[#141E28]">
                <Route className="w-4 h-4 text-[#1E6091]" />
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#141E28]">
                  Route Planning Instructions
                </h3>
                <p className="text-xs text-[#575F6E] mt-1 leading-relaxed">
                  Select an origin and destination to retrieve driving options from Mapbox Directions and analyze nearby road defects.
                </p>
              </div>

              <div className="space-y-2 font-mono text-[11px] text-[#575F6E] bg-[#EAE8DD]/40 p-3 border border-[#DCD9CD] rounded-xs">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#141E28] text-white flex items-center justify-center text-[9px] shrink-0">
                    1
                  </span>
                  <span>Type to search addresses or click an example shortcut above.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#141E28] text-white flex items-center justify-center text-[9px] shrink-0">
                    2
                  </span>
                  <span>Click "Find routes" to request alternative geometries from Mapbox.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#141E28] text-white flex items-center justify-center text-[9px] shrink-0">
                    3
                  </span>
                  <span>Compare demo exposure indices and nearby verified damage reports.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Navigation Map (~60%) */}
        <div className="lg:col-span-7 h-[540px] min-h-[460px] rounded-xs overflow-hidden sticky top-20">
          <NavigationMap
            mapboxToken={mapboxToken}
            routes={routes}
            selectedRouteIndex={selectedRouteIndex}
            onSelectRoute={(idx) => {
              setSelectedRouteIndex(idx);
              setSelectedHazard(null);
            }}
            origin={origin}
            destination={destination}
            hazards={ROAD_CONDITIONS_REPORTS}
            selectedHazard={selectedHazard}
            onSelectHazard={(hazard) => setSelectedHazard(hazard)}
            className="h-full w-full"
          />
        </div>
      </section>
    </div>
  );
}
