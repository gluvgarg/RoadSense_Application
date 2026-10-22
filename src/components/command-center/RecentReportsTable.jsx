import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { RECENT_REPORTS } from '../../data/mockData';

export function RecentReportsTable() {
  const navigate = useNavigate();

  const handleRowClick = (report) => {
    navigate(`/detections?reportId=${encodeURIComponent(report.id)}`);
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

        <div>
          <Link
            to="/detections"
            className="text-xs font-semibold text-[#141E28] hover:text-[#1E6091] inline-flex items-center gap-0.5 transition-colors focus:outline-none focus:underline"
            title="Navigate to Detections repository"
          >
            <span>View all reports</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
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
              <th className="py-2.5 px-3 font-normal">REPORT TIME</th>
              <th className="py-2.5 px-3 text-right font-normal">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCD9CD]/70">
            {RECENT_REPORTS.map((report) => (
              <tr
                key={report.id}
                onClick={() => handleRowClick(report)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRowClick(report);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Review report ${report.id}: ${report.damageType} on ${report.roadLocation}`}
                className="cursor-pointer transition-colors hover:bg-[#EFECE1]/60 focus:outline-none focus:bg-[#EAE8DD] focus:ring-1 focus:ring-[#141E28]"
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
                  <div
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[11px] font-medium"
                    style={{ backgroundColor: report.severityBgColor }}
                  >
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
                <td className="py-3.5 px-3 font-mono text-[11px] text-[#717886] whitespace-nowrap">
                  {report.reportTime}
                </td>

                {/* Action Link to Detections */}
                <td className="py-3.5 px-3 text-right whitespace-nowrap">
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#1E6091] hover:underline">
                    <span>Review</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Helper Footer Instruction */}
      <div className="text-right">
        <span className="text-[11px] font-mono text-[#717886] italic">
          Select any report to inspect full detection details and review status
        </span>
      </div>
    </div>
  );
}
