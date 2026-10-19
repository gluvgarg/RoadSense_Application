import React, { useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Eye, 
  EyeOff, 
  Truck, 
  AlertTriangle
} from 'lucide-react';

import { ROAD_SEGMENTS, FLEET_VEHICLES, RECENT_DETECTIONS, SEVERITY_LEVELS } from '../../data/mockData';
import { MapLegend } from './MapLegend';
import { TelemetryInspector } from './TelemetryInspector';

export function RoadConditionMap({
  selectedDetection,
  onSelectDetection,
  className = ''
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [showVehicles, setShowVehicles] = useState(true);
  const [showDamagePins, setShowDamagePins] = useState(true);
  const [showRoadLabels, setShowRoadLabels] = useState(true);
  const [showPciColors, setShowPciColors] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mouseCoords, setMouseCoords] = useState({ lat: 37.7849, lng: -122.4094 });

  const mapContainerRef = useRef(null);

  // SVG viewBox
  const vbWidth = 900;
  const vbHeight = 520;

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.2));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e) => {
    // Only drag on canvas background
    if (e.target.tagName === 'svg' || e.target.id === 'map-background') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }

    // Calculate synthetic GIS coordinates based on mouse position
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      setMouseCoords({
        lat: Number((37.765 + (1 - relY) * 0.035).toFixed(4)),
        lng: Number((-122.425 + relX * 0.035).toFixed(4))
      });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  // Helper for generating SVG polyline points string
  const formatPoints = (coords) => {
    return coords.map((c) => `${c.x},${c.y}`).join(' ');
  };

  // Road segment stroke color based on PCI
  const getRoadColor = (segment) => {
    if (!showPciColors) return '#94A3B8';
    if (segment.pci >= 80) return '#10B981'; // Good (Emerald)
    if (segment.pci >= 60) return '#F59E0B'; // Fair (Amber)
    return '#EF4444'; // Poor / Critical Attention (Red)
  };

  return (
    <div
      ref={mapContainerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-[480px] bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-sm select-none cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* GIS Grid Background & Vector Map Graphics */}
      <svg
        id="map-background"
        viewBox={`0 0 ${vbWidth} ${vbHeight}`}
        className="w-full h-full"
        style={{
          transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
          transformOrigin: 'center center',
          transition: isPanning ? 'none' : 'transform 0.15s ease-out'
        }}
      >
        <defs>
          {/* Subtle GIS map grid pattern */}
          <pattern id="gis-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.8" />
          </pattern>
          <pattern id="gis-subgrid" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="2,2" />
          </pattern>

          {/* Pulse animation keyframe in SVG */}
          <radialGradient id="pulse-grad-red" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base Grid Layer */}
        <rect width={vbWidth} height={vbHeight} fill="#0F172A" />
        <rect width={vbWidth} height={vbHeight} fill="url(#gis-grid)" />
        <rect width={vbWidth} height={vbHeight} fill="url(#gis-subgrid)" opacity="0.4" />

        {/* Waterway / Geographical reference backdrop (e.g. Harbor Edge) */}
        <path
          d="M 0,0 L 220,0 L 260,110 L 220,240 L 140,320 L 0,380 Z"
          fill="#0B132B"
          opacity="0.6"
        />
        <text x="40" y="80" fill="#334155" fontSize="12" fontWeight="600" letterSpacing="2">
          NORTH HARBOR WATERWAY
        </text>

        {/* 1. Road Network Underlay (Base Asphalt Casing) */}
        {ROAD_SEGMENTS.map((seg) => (
          <polyline
            key={`base-${seg.id}`}
            points={formatPoints(seg.coords)}
            fill="none"
            stroke="#1E293B"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* 2. Road Network PCI Condition Color Layer */}
        {ROAD_SEGMENTS.map((seg) => (
          <g key={`pci-group-${seg.id}`}>
            {/* Main condition track */}
            <polyline
              points={formatPoints(seg.coords)}
              fill="none"
              stroke={getRoadColor(seg)}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
            {/* Center lane dash line */}
            <polyline
              points={formatPoints(seg.coords)}
              fill="none"
              stroke="#0F172A"
              strokeWidth="1.2"
              strokeDasharray="4,6"
              opacity="0.7"
            />
          </g>
        ))}

        {/* 3. Road Segment Identifiers / Labels */}
        {showRoadLabels &&
          ROAD_SEGMENTS.map((seg) => {
            const midIndex = Math.floor(seg.coords.length / 2);
            const midCoord = seg.coords[midIndex];
            return (
              <g key={`label-${seg.id}`}>
                {/* Background pill for legibility */}
                <rect
                  x={midCoord.x - 36}
                  y={midCoord.y - 18}
                  width="72"
                  height="16"
                  rx="3"
                  fill="#0F172A"
                  fillOpacity="0.9"
                  stroke="#334155"
                  strokeWidth="0.8"
                />
                <text
                  x={midCoord.x}
                  y={midCoord.y - 7}
                  fill="#94A3B8"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {seg.code}
                </text>
              </g>
            );
          })}

        {/* 4. Damage Incident Pins */}
        {showDamagePins &&
          RECENT_DETECTIONS.map((det) => {
            const isSelected = selectedDetection?.id === det.id;
            const isHovered = hoveredItem?.id === det.id;
            const isCritical = det.severity === 'CRITICAL';
            const color = SEVERITY_LEVELS[det.severity]?.pinColor || '#EF4444';

            return (
              <g
                key={det.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectDetection) {
                    onSelectDetection(det);
                  }
                  setSelectedVehicle(null);
                }}
                onMouseEnter={() => setHoveredItem(det)}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer group"
              >
                {/* Pulsing ring for critical defects */}
                {isCritical && (
                  <circle
                    cx={det.mapPos.x}
                    cy={det.mapPos.y}
                    r={isSelected ? 18 : 12}
                    fill={color}
                    opacity="0.25"
                    className="animate-ping origin-center"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  />
                )}

                {/* Selection halo */}
                {isSelected && (
                  <circle
                    cx={det.mapPos.x}
                    cy={det.mapPos.y}
                    r="14"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeDasharray="2,2"
                  />
                )}

                {/* Outer pin circle */}
                <circle
                  cx={det.mapPos.x}
                  cy={det.mapPos.y}
                  r={isSelected ? 8 : 6}
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  className="transition-transform duration-150 group-hover:scale-125"
                />

                {/* Pin core dot */}
                <circle
                  cx={det.mapPos.x}
                  cy={det.mapPos.y}
                  r="2"
                  fill="#0F172A"
                />

                {/* Small indicator badge on hover */}
                {isHovered && !isSelected && (
                  <g pointerEvents="none">
                    <rect
                      x={det.mapPos.x - 50}
                      y={det.mapPos.y - 32}
                      width="100"
                      height="20"
                      rx="3"
                      fill="#0F172A"
                      stroke="#475569"
                      strokeWidth="1"
                    />
                    <text
                      x={det.mapPos.x}
                      y={det.mapPos.y - 18}
                      fill="#F8FAFC"
                      fontSize="9"
                      fontFamily="sans-serif"
                      fontWeight="500"
                      textAnchor="middle"
                    >
                      {det.defectType.slice(0, 15)}...
                    </text>
                  </g>
                )}
              </g>
            );
          })}

        {/* 5. Edge Fleet Vehicle Markers */}
        {showVehicles &&
          FLEET_VEHICLES.map((veh) => {
            const isSelected = selectedVehicle?.id === veh.id;

            return (
              <g
                key={veh.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVehicle(veh);
                  if (onSelectDetection) onSelectDetection(null);
                }}
                className="cursor-pointer group"
              >
                {/* Vehicle telemetry wave */}
                <circle
                  cx={veh.position.x}
                  cy={veh.position.y}
                  r="14"
                  fill="#2563EB"
                  opacity="0.18"
                />

                {/* Vehicle base body */}
                {isSelected && (
                  <circle
                    cx={veh.position.x}
                    cy={veh.position.y}
                    r="12"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                )}
                <circle
                  cx={veh.position.x}
                  cy={veh.position.y}
                  r="6.5"
                  fill="#1E40AF"
                  stroke="#60A5FA"
                  strokeWidth="1.5"
                  className="group-hover:scale-110 transition-transform"
                />

                {/* Heading indicator dot */}
                <circle
                  cx={veh.position.x + Math.sin((veh.heading * Math.PI) / 180) * 8}
                  cy={veh.position.y - Math.cos((veh.heading * Math.PI) / 180) * 8}
                  r="2"
                  fill="#60A5FA"
                />

                {/* Vehicle Callsign Label */}
                <text
                  x={veh.position.x}
                  y={veh.position.y + 16}
                  fill="#93C5FD"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {veh.callsign.split('-').slice(0, 2).join('-')}
                </text>
              </g>
            );
          })}
      </svg>

      {/* Top Left: Map Controls & Layer Toggles */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
        <div className="bg-slate-900/90 backdrop-blur-md rounded border border-slate-700/80 p-1 flex items-center gap-1 shadow-md">
          {/* Layer: Damage */}
          <button
            onClick={() => setShowDamagePins(!showDamagePins)}
            className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
              showDamagePins
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Damage Incidents"
          >
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>Hazards</span>
          </button>

          {/* Layer: Fleet */}
          <button
            onClick={() => setShowVehicles(!showVehicles)}
            className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
              showVehicles
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Edge Fleet"
          >
            <Truck className="w-3 h-3 text-blue-400" />
            <span>Fleet</span>
          </button>

          {/* Layer: PCI Quality */}
          <button
            onClick={() => setShowPciColors(!showPciColors)}
            className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
              showPciColors
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle PCI Condition Bands"
          >
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>PCI Bands</span>
          </button>

          {/* Layer: Labels */}
          <button
            onClick={() => setShowRoadLabels(!showRoadLabels)}
            className={`p-1 rounded text-slate-400 hover:text-slate-200 transition-colors ${
              showRoadLabels ? 'text-slate-200' : 'text-slate-500'
            }`}
            title="Toggle Road Codes"
          >
            {showRoadLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Bottom Left: Legend Drawer */}
      <div className="absolute bottom-3 left-3 z-10 max-w-xs">
        <MapLegend />
      </div>

      {/* Top Right: Zoom & Navigation Tools */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
        <div className="bg-slate-900/90 backdrop-blur-md rounded border border-slate-700/80 p-1 flex flex-col gap-1 shadow-md">
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Reset Center & Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Right: Live GPS Telemetry Cursor & Status Bar */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
        <div className="px-2.5 py-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded text-[10px] font-mono text-slate-300 flex items-center gap-2 shadow-xs">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span>CURSOR: {mouseCoords.lat}° N, {Math.abs(mouseCoords.lng)}° W</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">ZOOM: {(zoomLevel * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Telemetry Inspector Overlay when an item is selected */}
      {selectedDetection && (
        <TelemetryInspector
          selectedItem={selectedDetection}
          type="detection"
          onClose={() => onSelectDetection && onSelectDetection(null)}
        />
      )}

      {selectedVehicle && (
        <TelemetryInspector
          selectedItem={selectedVehicle}
          type="vehicle"
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
}
