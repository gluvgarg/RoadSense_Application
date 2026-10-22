import { SummaryMetrics } from '../components/command-center/SummaryMetrics';
import { RecentReportsTable } from '../components/command-center/RecentReportsTable';
import { ConditionProfile } from '../components/command-center/ConditionProfile';

export function CommandCenterPage() {
  return (
    <div className="space-y-8 sm:space-y-10">
      {/* A. Editorial Page Introduction */}
      <section className="pt-1">
        <div className="space-y-2">
          {/* Breadcrumb */}
          <div className="text-[11px] font-mono text-[#717886] uppercase tracking-wider">
            01 / COMMAND CENTER
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
      </section>

      {/* B. Three-Column Summary Metrics Row (Horizontal Divider Grid) */}
      <section aria-label="Key Summary Metrics">
        <SummaryMetrics />
      </section>

      {/* C. Main Editorial Content: Recent Road Reports (~70%) & Condition Profile (~30%) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-2" aria-label="Recent Detections and Condition Profile">
        {/* Left Column: Recent Road Reports Table (~70%) */}
        <div className="lg:col-span-8">
          <RecentReportsTable />
        </div>

        {/* Right Column: Condition Profile (~30%) with fine left border on desktop */}
        <div className="lg:col-span-4 lg:border-l lg:border-[#DCD9CD] lg:pl-10">
          <ConditionProfile />
        </div>
      </section>
    </div>
  );
}
