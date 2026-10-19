import React from 'react';
import { Activity, Truck, AlertTriangle, Cpu } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { OPERATIONAL_METRICS } from '../../data/mockData';

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Road Surface Integrity */}
      <MetricCard
        title="Surface Integrity Index"
        value={OPERATIONAL_METRICS.roadHealthIndex}
        unit="PCI Avg"
        change={OPERATIONAL_METRICS.healthDelta}
        changeType="positive"
        changeLabel="vs 30d baseline"
        subvalue={`${OPERATIONAL_METRICS.totalSurveyedKm} km`}
        icon={Activity}
      />

      {/* Metric 2: Active Vehicles with Edge AI */}
      <MetricCard
        title="Edge Fleet Ingestion"
        value={`${OPERATIONAL_METRICS.activeVehicles} / ${OPERATIONAL_METRICS.totalFleetVehicles}`}
        unit="Units Online"
        changeLabel="87.5% coverage"
        subvalue={`${OPERATIONAL_METRICS.telemetryStreamRate} msg/s`}
        icon={Truck}
      />

      {/* Metric 3: 24h Damage Detections */}
      <MetricCard
        title="24h Hazard Detections"
        value={OPERATIONAL_METRICS.detections24h}
        unit="Total Incidents"
        icon={AlertTriangle}
        breakdown={
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-red-700 font-semibold">
              {OPERATIONAL_METRICS.criticalHazards} Crit
            </span>
            <span className="text-orange-700">
              {OPERATIONAL_METRICS.highHazards} High
            </span>
            <span className="text-amber-700">
              {OPERATIONAL_METRICS.moderateHazards} Mod
            </span>
            <span className="text-sky-700">
              {OPERATIONAL_METRICS.lowHazards} Low
            </span>
          </div>
        }
      />

      {/* Metric 4: Edge AI Inference Confidence */}
      <MetricCard
        title="Edge AI Model Confidence"
        value={`${OPERATIONAL_METRICS.avgAiConfidence}%`}
        unit="Mean"
        change={0.6}
        changeType="positive"
        changeLabel="Model v2.4.2"
        subvalue="1,420 passes/day"
        icon={Cpu}
      />
    </div>
  );
}
