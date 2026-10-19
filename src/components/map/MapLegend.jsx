import React from 'react';


export function MapLegend({ className = '' }) {
  return (
    <div
      className={`bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-md p-2.5 shadow-xs text-xs space-y-2 select-none ${className}`}
    >
      <div>
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Pavement Quality (PCI)
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1.5 rounded-sm bg-emerald-500" />
            <span className="text-slate-700">Good (&gt;80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1.5 rounded-sm bg-amber-500" />
            <span className="text-slate-700">Fair (60-80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1.5 rounded-sm bg-red-500" />
            <span className="text-slate-700">Poor (&lt;60)</span>
          </div>
        </div>
      </div>

      <div className="pt-1.5 border-t border-slate-100">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Hazard Severity
        </div>
        <div className="grid grid-cols-2 gap-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-700">Critical (Deep Pothole)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-slate-700">High (Cracking Cluster)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-700">Moderate (Rutting)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="text-slate-700">Low (Surface Wear)</span>
          </div>
        </div>
      </div>

      <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-blue-600 inline-block" />
          <span>Active Edge Vehicle</span>
        </div>
        <span className="font-mono">Scale: 1 km</span>
      </div>
    </div>
  );
}
