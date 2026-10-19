import React, { useState } from 'react';
import { SummaryMetrics } from '../components/command-center/SummaryMetrics';
import { RecentReportsTable } from '../components/command-center/RecentReportsTable';
import { ConditionProfile } from '../components/command-center/ConditionProfile';
import { PROTOTYPE_META } from '../data/mockData';

export function CommandCenterPage() {
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* A. Editorial Page Introduction */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-1">
        <div className="space-y-2">
          {/* Breadcrumb & Demo Data Label */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono text-[#717886] uppercase tracking-wider">
              01 / COMMAND CENTER
            </span>
            <span className="border border-[#DCD9CD] bg-[#F6F5EE] px-1.5 py-0.5 rounded-xs text-[10px] font-mono text-[#717886]">
              DEMO DATA
            </span>
          </div>

          {/* Editorial Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#141E28] tracking-tight leading-none">
            Road Intelligence
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#575F6E] leading-relaxed pt-0.5 max-w-xl">
            An overview of connected vehicles and reported road conditions.
          </p>
        </div>

        {/* Right-Aligned Region Detail */}
        <div className="md:border-l md:border-[#DCD9CD] md:pl-6 pb-0.5 shrink-0">
          <div className="text-[10px] font-mono text-[#717886] uppercase tracking-wider">
            Coverage region
          </div>
          <div className="text-base font-bold text-[#141E28] mt-0.5 tracking-tight">
            {PROTOTYPE_META.coverageRegion}
          </div>
          <div className="text-[10px] font-mono text-[#717886] mt-0.5">
            Last sample update: {PROTOTYPE_META.lastSampleUpdate}
          </div>
        </div>
      </section>

      {/* B. Three-Column Summary Metrics Row (Horizontal Divider Grid) */}
      <section aria-label="Key Summary Metrics">
        <SummaryMetrics />
      </section>

      {/* C. Main Editorial Content: Recent Road Reports (~70%) & Condition Profile (~30%) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-2" aria-label="Recent Detections and Condition Profile">
        {/* Left Column: Recent Road Reports Table (~70%) */}
        <div className="lg:col-span-8">
          <RecentReportsTable
            selectedReport={selectedReport}
            onSelectReport={setSelectedReport}
          />
        </div>

        {/* Right Column: Condition Profile (~30%) with fine left border on desktop */}
        <div className="lg:col-span-4 lg:border-l lg:border-[#DCD9CD] lg:pl-10">
          <ConditionProfile />
        </div>
      </section>
    </div>
  );
}
