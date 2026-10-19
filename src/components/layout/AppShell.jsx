import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { PROTOTYPE_META } from '../../data/mockData';

export function AppShell() {
  return (
    <div className="min-h-screen text-[#141E28] flex flex-col font-sans antialiased">
      {/* 1. Horizontal Top Navigation Bar */}
      <Navbar />

      {/* 2. Main Page Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
        <Outlet />
      </main>

      {/* 3. Subtle Editorial Footer Note */}
      <footer className="border-t border-[#DCD9CD] py-4 text-xs text-[#717886]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#141E28]">RoadSense</span>
            <span>·</span>
            <span className="font-mono text-[11px] text-[#717886]">{PROTOTYPE_META.disclaimer}</span>
          </div>
          <div className="font-mono text-[11px] text-[#717886]">
            {PROTOTYPE_META.coverageRegion} · Last update: {PROTOTYPE_META.lastSampleUpdate}
          </div>
        </div>
      </footer>
    </div>
  );
}
