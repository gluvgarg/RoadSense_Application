import React, { useState } from 'react';
import { ArrowUpRight, X, MapPin, CheckCircle2 } from 'lucide-react';
import { RECENT_REPORTS } from '../../data/mockData';

export function RecentReportsTable({ selectedReport, onSelectReport }) {
  const [activeModalReport, setActiveModalReport] = useState(null);

  const handleRowClick = (report) => {
    if (onSelectReport) {
      onSelectReport(report);
    }
    setActiveModalReport(report);
  };

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] font-mono text-[#717886] uppercase tracking-wider">
            INCOMING DETECTIONS
          </div>
          <h2 className="text-xl font-bold text-[#141E28] tracking-tight mt-0.5">
            Recent road reports
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="border border-[#DCD9CD] bg-[#F6F5EE] px-1.5 py-0.5 rounded-xs text-[10px] font-mono text-[#717886]">
            DEMO DATA
          </span>
          <a
            href="#all-reports"
            onClick={(e) => e.preventDefault()}
            className="text-xs font-semibold text-[#141E28] hover:text-[#1E6091] inline-flex items-center gap-0.5 transition-colors"
          >
            <span>View all reports</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Table Container */}
      <div className="border-t border-[#141E28] border-b border-[#DCD9CD] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#DCD9CD] text-[10px] font-mono text-[#717886] uppercase tracking-wider">
              <th className="py-2.5 px-3 font-normal">REPORT ID</th>
              <th className="py-2.5 px-3 font-normal">ROAD LOCATION</th>
              <th className="py-2.5 px-3 font-normal">DAMAGE TYPE</th>
              <th className="py-2.5 px-3 font-normal">SEVERITY</th>
              <th className="py-2.5 px-3 font-normal">REVIEW STATUS</th>
              <th className="py-2.5 px-3 text-right font-normal">REPORT TIME</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCD9CD]/70">
            {RECENT_REPORTS.map((report) => {
              const isSelected = selectedReport?.id === report.id;

              return (
                <tr
                  key={report.id}
                  onClick={() => handleRowClick(report)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#EAE8DD]'
                      : 'hover:bg-[#EFECE1]/60'
                  }`}
                >
                  {/* Report ID */}
                  <td className="py-3.5 px-3 font-mono text-[#575F6E] whitespace-nowrap text-xs">
                    {report.id}
                  </td>

                  {/* Road Location & Sub-location */}
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-[#141E28] text-xs">
                      {report.roadLocation}
                    </div>
                    <div className="text-[10px] text-[#717886] mt-0.5">
                      {report.subLocation}
                    </div>
                  </td>

                  {/* Damage Type */}
                  <td className="py-3.5 px-3 text-[#141E28] text-xs whitespace-nowrap">
                    {report.damageType}
                  </td>

                  {/* Severity with slim vertical accent bar */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[11px] font-medium" style={{ backgroundColor: report.severityBgColor }}>
                      <span
                        className="w-[2px] h-3 rounded-full"
                        style={{ backgroundColor: report.severityAccentColor }}
                      />
                      <span style={{ color: report.severityAccentColor }}>
                        {report.severity}
                      </span>
                    </div>
                  </td>

                  {/* Review Status with colored dot */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#141E28]">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: report.statusDotColor }}
                      />
                      <span>{report.reviewStatus}</span>
                    </div>
                  </td>

                  {/* Report Time */}
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-[#717886] whitespace-nowrap">
                    {report.reportTime}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Helper Footer Instruction */}
      <div className="text-right">
        <span className="text-[11px] font-mono text-[#717886] italic">
          Select a report to inspect detection details
        </span>
      </div>

      {/* Report Detail Modal */}
      {activeModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141E28]/40 backdrop-blur-2xs">
          <div className="bg-[#F6F5EE] border border-[#DCD9CD] shadow-xl max-w-lg w-full overflow-hidden text-xs rounded-md">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-[#DCD9CD] flex items-center justify-between bg-[#EAE8DD]/70">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-sm text-[#141E28]">
                  {activeModalReport.id}
                </span>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[11px] font-medium"
                  style={{ backgroundColor: activeModalReport.severityBgColor, color: activeModalReport.severityAccentColor }}
                >
                  <span
                    className="w-1 h-3 rounded-full"
                    style={{ backgroundColor: activeModalReport.severityAccentColor }}
                  />
                  {activeModalReport.severity}
                </span>
              </div>
              <button
                onClick={() => setActiveModalReport(null)}
                className="p-1 rounded text-[#717886] hover:text-[#141E28] hover:bg-[#DCD9CD]/50 transition-colors"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              <div>
                <div className="text-base font-bold text-[#141E28]">
                  {activeModalReport.roadLocation}
                </div>
                <div className="text-[#717886] text-xs mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#717886] shrink-0" />
                  <span>{activeModalReport.subLocation}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-[#EAE8DD]/40 border border-[#DCD9CD] rounded-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#717886] block">
                    Damage Type
                  </span>
                  <span className="font-semibold text-[#141E28] text-xs mt-0.5 block">
                    {activeModalReport.damageType}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#717886] block">
                    Review Status
                  </span>
                  <div className="inline-flex items-center gap-1.5 mt-0.5 text-xs text-[#141E28] font-medium">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: activeModalReport.statusDotColor }}
                    />
                    <span>{activeModalReport.reviewStatus}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#717886] block">
                    Report Timestamp
                  </span>
                  <span className="font-mono text-[#141E28] text-xs mt-0.5 block">
                    {activeModalReport.reportTime}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#717886] block">
                    Data Source
                  </span>
                  <span className="font-mono text-[#575F6E] text-xs mt-0.5 block">
                    Edge AI Fleet Device
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#141E28] block mb-1">
                  Observation Notes
                </span>
                <p className="text-[#575F6E] bg-[#EAE8DD]/20 p-2.5 border border-[#DCD9CD] rounded-xs leading-relaxed text-xs font-sans">
                  {activeModalReport.notes}
                </p>
              </div>

              <div className="p-2 border border-[#DCD9CD] bg-[#FAF8F3] text-[11px] text-[#717886] font-mono flex items-center justify-between">
                <span>Demonstration record · Delhi NCR dataset</span>
                <span>Fictional sample</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-5 py-3 border-t border-[#DCD9CD] bg-[#EAE8DD]/40 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveModalReport(null)}
                className="px-3 py-1.5 border border-[#DCD9CD] text-[#141E28] hover:bg-[#EAE8DD] font-medium transition-colors rounded-xs"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  alert(`Report ${activeModalReport.id} verified in demonstration mode.`);
                  setActiveModalReport(null);
                }}
                className="px-3.5 py-1.5 bg-[#141E28] hover:bg-[#1E2E3E] text-white font-medium transition-colors rounded-xs shadow-2xs inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span>Mark as Verified</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
