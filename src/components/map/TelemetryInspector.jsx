import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Camera, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Copy, 
  Check
} from 'lucide-react';

import { SeverityBadge } from '../common/SeverityBadge';
import { Badge } from '../common/Badge';

export function TelemetryInspector({ selectedItem, type = 'detection', onClose, onUpdateStatus }) {
  const [copied, setCopied] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  if (!selectedItem) return null;

  const handleCopyCoords = (coords) => {
    if (!coords) return;
    const text = `${coords.lat}, ${coords.lng}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAction = (statusName) => {
    setActionSuccess(statusName);
    if (onUpdateStatus) {
      onUpdateStatus(selectedItem.id, statusName);
    }
    setTimeout(() => setActionSuccess(null), 2500);
  };

  return (
    <div className="absolute top-3 right-3 w-88 max-w-[calc(100%-24px)] bg-white/98 backdrop-blur-md rounded-lg border border-slate-200 shadow-lg z-20 overflow-hidden flex flex-col max-h-[calc(100%-24px)] text-xs">
      {/* Header */}
      <div className="px-3.5 py-2.5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          {type === 'detection' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          ) : (
            <Truck className="w-4 h-4 text-blue-400" />
          )}
          <span className="font-mono font-semibold tracking-wide text-xs">
            {type === 'detection' ? selectedItem.id : selectedItem.callsign}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {type === 'detection' && (
            <SeverityBadge severity={selectedItem.severity} size="xs" />
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-0.5 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-3.5 overflow-y-auto space-y-3 flex-1">
        {type === 'detection' ? (
          <>
            {/* Defect Classification and Road Location */}
            <div>
              <div className="font-semibold text-slate-900 text-sm leading-snug">
                {selectedItem.defectType}
              </div>
              <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{selectedItem.roadName}</span>
                {selectedItem.chainage && (
                  <span className="font-mono text-slate-400">({selectedItem.chainage})</span>
                )}
              </div>
            </div>

            {/* Edge AI Vision Simulation Snapshot */}
            <div className="rounded border border-slate-200 bg-slate-950 p-2 relative overflow-hidden text-slate-100">
              <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-950 rounded flex flex-col justify-between p-2 overflow-hidden border border-slate-800">
                {/* Road asphalt texture simulation */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:8px_8px]" />

                {/* Simulated AI Vision Bounding Box */}
                <div className="absolute inset-x-8 inset-y-4 border-2 border-dashed border-red-500 rounded bg-red-500/15 flex flex-col justify-between p-1 shadow-[0_0_12px_rgba(239,68,68,0.3)]">
                  <div className="flex items-center justify-between">
                    <span className="bg-red-600 text-white font-mono text-[9px] px-1 py-0.2 rounded font-bold">
                      {selectedItem.defectType.split(' ')[0].toUpperCase()}
                    </span>
                    <span className="bg-slate-900/90 text-emerald-400 font-mono text-[9px] px-1 py-0.2 rounded">
                      {selectedItem.aiConfidence}% CONF
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-red-300">
                    {selectedItem.dimensions}
                  </div>
                </div>

                {/* Camera metadata overlay */}
                <div className="relative z-10 flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Camera className="w-3 h-3 text-slate-400" />
                    CAM-01 [STEREO HD]
                  </span>
                  <span>{selectedItem.timestamp}</span>
                </div>
                <div className="relative z-10 text-right text-[8px] font-mono text-slate-400">
                  ACCEL Z: +{selectedItem.zAxisSpikeG}g
                </div>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Model: RS-YOLO-v9-Edge</span>
                <span className="text-emerald-400">Onboard Verified</span>
              </div>
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">GNSS Coordinates</span>
                <div className="flex items-center justify-between font-mono font-medium text-slate-800 mt-0.5">
                  <span className="text-[10px] truncate">
                    {selectedItem.coordinates.lat.toFixed(4)}, {selectedItem.coordinates.lng.toFixed(4)}
                  </span>
                  <button
                    onClick={() => handleCopyCoords(selectedItem.coordinates)}
                    className="text-slate-400 hover:text-slate-700 p-0.5"
                    title="Copy coordinates"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Sensor Telemetry</span>
                <span className="font-mono font-medium text-slate-800 mt-0.5 block text-[10px]">
                  Shock: {selectedItem.zAxisSpikeG}g peak
                </span>
              </div>

              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Source Vehicle</span>
                <span className="font-medium text-slate-800 truncate block text-[10px]">
                  {selectedItem.reportingVehicle}
                </span>
              </div>

              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Workflow Status</span>
                <Badge variant="default" size="sm" className="mt-0.5">
                  {selectedItem.triageStatus.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="p-2.5 rounded bg-blue-50/70 border border-blue-200 text-blue-900 text-[11px] space-y-1">
              <span className="font-semibold text-blue-950 block text-[10px] uppercase tracking-wider">
                Recommended Triage Protocol
              </span>
              <p className="text-[11px] leading-relaxed text-blue-900">
                {selectedItem.recommendedAction}
              </p>
            </div>

            {/* Action Feedback */}
            {actionSuccess && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-center text-xs font-medium flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Updated: {actionSuccess}
              </div>
            )}

            {/* Triage Action Buttons */}
            <div className="pt-1 flex gap-2">
              <button
                onClick={() => handleAction('Verified & Queued')}
                className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs transition-colors shadow-xs flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" />
                Verify Defect
              </button>
              <button
                onClick={() => handleAction('Dispatched Road Crew')}
                className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium text-xs transition-colors shadow-xs flex items-center justify-center gap-1"
              >
                <Send className="w-3 h-3" />
                Dispatch Crew
              </button>
            </div>
          </>
        ) : (
          /* Vehicle Inspector */
          <div className="space-y-3">
            <div>
              <div className="font-bold text-slate-900 text-sm">
                {selectedItem.callsign}
              </div>
              <div className="text-slate-500 text-xs">
                {selectedItem.type}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Live Speed</span>
                <span className="font-mono font-bold text-slate-800">
                  {selectedItem.speedKmh} km/h
                </span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Heading</span>
                <span className="font-mono font-bold text-slate-800">
                  {selectedItem.heading}° NNE
                </span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Edge AI Model</span>
                <span className="font-mono text-[10px] text-slate-800 truncate block">
                  {selectedItem.edgeAiModel}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Camera Rig</span>
                <span className="font-mono text-[10px] text-emerald-700 block">
                  {selectedItem.cameraStatus}
                </span>
              </div>
            </div>

            <div className="p-2 rounded bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-600">
              <div>Telemetry Ping: {selectedItem.lastPingSecAgo}s ago</div>
              <div>Position: {selectedItem.position.lat}, {selectedItem.position.lng}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
