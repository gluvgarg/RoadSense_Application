import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Layers } from 'lucide-react';

export function PlaceholderPage({
  title,
  subtitle,
  icon: Icon,
  plannedFeatures = [],
  moduleCode = 'PLANNED-MODULE'
}) {
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <div className="border border-[#DCD9CD] bg-[#F6F5EE]/80 p-8 text-center space-y-4">
        <div className="w-10 h-10 mx-auto bg-[#EAE8DD] border border-[#DCD9CD] flex items-center justify-center text-[#141E28]">
          {Icon ? <Icon className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl font-bold text-[#141E28] tracking-tight">
              {title}
            </h2>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 border border-[#DCD9CD] bg-[#EAE8DD] text-[10px] font-mono text-[#717886]">
              <Clock className="w-3 h-3 text-[#717886]" />
              <span>{moduleCode}</span>
            </span>
          </div>
          <p className="text-xs text-[#575F6E] max-w-lg mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="pt-1">
          <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-mono text-[#717886] border border-[#DCD9CD] bg-[#EAE8DD]/40">
            Module queued for subsequent implementation milestone
          </span>
        </div>

        {plannedFeatures.length > 0 && (
          <div className="mt-8 text-left bg-[#EAE8DD]/30 border border-[#DCD9CD] p-5 max-w-lg mx-auto">
            <h3 className="text-[10px] font-mono font-semibold text-[#141E28] uppercase tracking-wider mb-3">
              Planned Capabilities:
            </h3>
            <ul className="space-y-2 text-xs text-[#575F6E]">
              {plannedFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#141E28] mt-1.5 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-[#141E28] bg-[#EAE8DD] border border-[#DCD9CD] hover:bg-[#DCD9CD] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Command Center</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
