import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, Menu, X, User, Shield } from 'lucide-react';
import { PROTOTYPE_META } from '../../data/mockData';

const NAV_ITEMS = [
  { name: 'Command Center', path: '/', exact: true },
  { name: 'Road Conditions', path: '/conditions' },
  { name: 'Vehicles & Devices', path: '/vehicles' },
  { name: 'Detections', path: '/detections' },
  { name: 'Navigation', path: '/navigation' }
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { operator } = PROTOTYPE_META;

  return (
    <nav className="bg-[#F6F5EE]/95 backdrop-blur-xs border-b border-[#DCD9CD] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Left: RoadSense Monogram & Wordmark */}
          <div className="flex items-center gap-6">
            <NavLink to="/" className="flex items-center gap-2.5 shrink-0 group">
              {/* Dark Rounded Badge with road glyph */}
              <div className="w-7 h-7 rounded-md bg-[#141E28] flex items-center justify-center text-white shadow-2xs">
                <svg
                  className="w-4 h-4 text-[#2DD4BF]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19L9 5l4 14l7-14" />
                </svg>
              </div>

              <span className="text-base font-bold text-[#141E28] tracking-tight">
                RoadSense
              </span>
            </NavLink>

            {/* Desktop Horizontal Navigation Links */}
            <div className="hidden md:flex items-center space-x-0.5 h-14">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `relative h-14 inline-flex items-center px-3.5 text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EAE8DD] text-[#141E28] font-semibold'
                        : 'text-[#575F6E] hover:text-[#141E28] hover:bg-[#EFECE1]/60'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.name}</span>

                      {/* Active Dark Underline Indicator */}
                      {isActive && (
                        <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#141E28]" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right: Operator Profile (AK Avatar, Aarav Khanna, Administrator) */}
          <div className="hidden sm:flex items-center">
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 py-1 px-2 rounded hover:bg-[#EAE8DD]/60 transition-colors focus:outline-none"
                aria-expanded={profileDropdownOpen}
              >
                {/* Circular AK Avatar */}
                <div className="w-7 h-7 rounded-full bg-[#E2DFD3] text-[#4A5568] flex items-center justify-center font-medium text-xs border border-[#DCD9CD]">
                  {operator.initials}
                </div>

                <div className="text-left">
                  <div className="text-xs font-semibold text-[#141E28] leading-tight">
                    {operator.name}
                  </div>
                  <div className="text-[10px] text-[#717886] leading-tight mt-0.5">
                    {operator.role}
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-[#717886] ml-0.5" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-52 bg-[#F6F5EE] rounded-md border border-[#DCD9CD] shadow-md py-1.5 z-40 text-xs">
                    <div className="px-3.5 py-2 border-b border-[#DCD9CD]/70">
                      <div className="font-semibold text-[#141E28]">{operator.name}</div>
                      <div className="text-[11px] text-[#717886] font-mono truncate">{operator.email}</div>
                      <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#141E28] bg-[#EAE8DD] px-1.5 py-0.5 rounded border border-[#DCD9CD] font-mono">
                        <Shield className="w-3 h-3 text-[#1E6091]" />
                        {operator.role}
                      </div>
                    </div>

                    <div className="px-3.5 py-2 text-[11px] text-[#717886]">
                      <span>Coverage: </span>
                      <strong className="text-[#141E28]">{PROTOTYPE_META.coverageRegion}</strong>
                    </div>

                    <div className="border-t border-[#DCD9CD]/70 pt-1">
                      <button
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full text-left px-3.5 py-1.5 text-[#575F6E] hover:bg-[#EAE8DD]/60 flex items-center gap-2 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#717886]" />
                        <span>Profile Settings (Demo)</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#141E28] hover:bg-[#EAE8DD] rounded focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DCD9CD] bg-[#F6F5EE] px-4 pt-2 pb-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-colors ${
                  isActive
                    ? 'bg-[#EAE8DD] text-[#141E28] font-semibold border-l-2 border-[#141E28]'
                    : 'text-[#575F6E] hover:bg-[#EFECE1]'
                }`
              }
            >
              <span>{item.name}</span>
            </NavLink>
          ))}

          <div className="pt-3 border-t border-[#DCD9CD] flex items-center justify-between px-3 text-xs text-[#717886]">
            <span>{operator.name} ({operator.role})</span>
            <span className="font-mono text-[10px]">Demo</span>
          </div>
        </div>
      )}
    </nav>
  );
}
