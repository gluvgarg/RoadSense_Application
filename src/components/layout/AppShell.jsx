import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function AppShell() {
  return (
    <div className="min-h-screen text-[#141E28] flex flex-col font-sans antialiased">
      {/* 1. Horizontal Top Navigation Bar */}
      <Navbar />

      {/* 2. Main Page Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
        <Outlet />
      </main>

      {/* 3. Minimal Editorial Footer */}
      <footer className="border-t border-[#DCD9CD] py-3 text-[11px] font-mono text-[#717886]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span>RoadSense · Prototype</span>
        </div>
      </footer>
    </div>
  );
}
