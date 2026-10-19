import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Route, 
  Truck, 
  ShieldAlert, 
  Navigation as NavigationIcon,
  Radio
} from 'lucide-react';
import { OPERATIONAL_METRICS } from '../../data/mockData';


const NAV_ITEMS = [
  {
    name: 'Command Center',
    path: '/',
    icon: LayoutDashboard,
    badge: null,
    exact: true
  },
  {
    name: 'Road Conditions',
    path: '/conditions',
    icon: Route,
    badge: '486 km'
  },
  {
    name: 'Vehicles & Devices',
    path: '/vehicles',
    icon: Truck,
    badge: `${OPERATIONAL_METRICS.activeVehicles}/${OPERATIONAL_METRICS.totalFleetVehicles}`
  },
  {
    name: 'Detection Management',
    path: '/detections',
    icon: ShieldAlert,
    badge: `${OPERATIONAL_METRICS.criticalHazards} Crit`,
    badgeClass: 'bg-red-50 text-red-700 border-red-200'
  },
  {
    name: 'Navigation',
    path: '/navigation',
    icon: NavigationIcon,
    badge: 'Live'
  }
];

export function Sidebar({ collapsed = false, _onToggleCollapse }) {
  return (
    <aside 
      className={`h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col justify-between select-none transition-all duration-200 z-30 shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Branding Section */}
      <div>
        <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* Distinctive RoadSense Hex-Grid Road Brand Mark */}
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm shrink-0">
              <svg 
                className="w-5 h-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M4 19L10 5l4 14l6-14" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-blue-400"
                />
                <circle cx="10" cy="5" r="1.5" fill="#60A5FA" />
                <circle cx="14" cy="19" r="1.5" fill="#EF4444" />
                <circle cx="20" cy="5" r="1.5" fill="#38BDF8" />
              </svg>
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-slate-900">
                    RoadSense
                  </span>
                  <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded border border-blue-200">
                    GIS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate leading-none mt-0.5">
                  Edge Road Intelligence
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Operational Context Sub-bar */}
        {!collapsed && (
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
              Fleet Console
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Edge Online
            </span>
          </div>
        )}

        {/* Primary Navigation Destinations */}
        <nav className="p-2 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50/90 text-blue-700 font-semibold border border-blue-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`
              }
              title={collapsed ? item.name : undefined}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <item.icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    {!collapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </div>

                  {!collapsed && item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border font-mono tracking-tight ${
                        item.badgeClass || (isActive 
                          ? 'bg-blue-100/70 text-blue-800 border-blue-300/80' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                        )
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer: Fleet & Device Connectivity Status */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/60">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="rounded border border-slate-200 bg-white p-2.5">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-blue-600" />
                  Edge Mesh Sync
                </span>
                <span className="font-mono text-[10px] font-semibold text-slate-700">
                  {OPERATIONAL_METRICS.activeVehicles}/{OPERATIONAL_METRICS.totalFleetVehicles}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${(OPERATIONAL_METRICS.activeVehicles / OPERATIONAL_METRICS.totalFleetVehicles) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
                <span>GNSS RTK: 99.4%</span>
                <span>{OPERATIONAL_METRICS.telemetryStreamRate} msg/s</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
              <span className="truncate">Sector 4 Node #109</span>
              <span className="font-mono">v1.4.2</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-1">
            <div 
              className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" 
              title="Edge Mesh: Connected"
            />
          </div>
        )}
      </div>
    </aside>
  );
}
