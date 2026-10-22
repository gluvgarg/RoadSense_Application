import React, { useEffect } from 'react';
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Ban, 
  ShieldCheck,
  Cpu
} from 'lucide-react';

export function DetectionDetailsModal({
  report,
  onClose,
  onStatusTransition
}) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && report) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [report, onClose]);

  if (!report) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detection-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141E28]/40 backdrop-blur-2xs"
    >
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#F6F5EE] border border-[#DCD9CD] shadow-xl rounded-xs overflow-hidden z-10 animate-in fade-in-50 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#EAE8DD] border-b border-[#DCD9CD] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              id="detection-modal-title"
              className="font-mono font-bold text-sm text-[#141E28]"
            >
              {report.id}
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[11px] font-medium"
              style={{
                backgroundColor: report.severityBgColor,
                color: report.severityAccentColor
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: report.severityAccentColor }}
              />
              {report.severity}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#717886] hover:text-[#141E28] hover:bg-[#DCD9CD]/60 transition-colors cursor-pointer"
            aria-label="Close report details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Location Banner */}
          <div>
            <div className="text-base font-bold text-[#141E28] leading-tight">
              {report.roadLocation}
            </div>
            <div className="text-[11px] text-[#717886] mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#717886] shrink-0" />
              <span>{report.subLocation}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-[#EAE8DD]/40 border border-[#DCD9CD] rounded-xs text-[11px]">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#717886] block">
                Damage Type
              </span>
              <span className="font-semibold text-[#141E28] text-xs mt-0.5 block">
                {report.damageType}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-[#717886] block">
                Review Status
              </span>
              <div className="inline-flex items-center gap-1.5 mt-0.5 text-xs text-[#141E28] font-medium">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: report.statusDotColor }}
                />
                <span>{report.reviewStatus}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-[#717886] block">
                AI Model Confidence
              </span>
              <span className="font-mono font-medium text-[#1E6091] mt-0.5 block">
                {report.confidence || 'N/A'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-[#717886] block">
                Detection Timestamp
              </span>
              <span className="font-mono text-[#141E28] mt-0.5 block">
                {report.reportTime}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-[#717886] block">
                GPS Coordinates
              </span>
              <span className="font-mono text-[#575F6E] mt-0.5 block text-[10px]">
                {report.latitude ? `${report.latitude.toFixed(4)}° N, ${report.longitude.toFixed(4)}° E` : 'Coordinates recorded'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-[#717886] block">
                Data Source
              </span>
              <div className="font-mono text-[#575F6E] mt-0.5 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[#717886] shrink-0" />
                <span>Illustrative demo detection</span>
              </div>
            </div>
          </div>

          {/* Observation Notes */}
          {report.notes && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#717886] uppercase tracking-wider block">
                Observation Notes
              </span>
              <p className="text-[#575F6E] text-[11px] leading-relaxed bg-[#EAE8DD]/20 p-2.5 border border-[#DCD9CD] rounded-xs font-sans">
                {report.notes}
              </p>
            </div>
          )}

          {/* Demonstration Notice */}
          <div className="p-2.5 bg-[#FAF8F3] border border-[#DCD9CD] rounded-xs flex items-start gap-2 text-[10px] text-[#717886]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E6091] mt-0.5 shrink-0" />
            <p className="leading-tight">
              Demonstration state: Status transitions update active React session state. Changes are not persisted to a permanent database.
            </p>
          </div>

          {/* Footer Actions / Review Workflow */}
          <div className="pt-3 border-t border-[#DCD9CD] flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-[#DCD9CD] bg-white hover:bg-[#EAE8DD] text-[#141E28] font-medium rounded-xs text-xs transition-colors cursor-pointer"
            >
              Close
            </button>

            <div className="flex items-center gap-2">
              {/* Workflow: Needs review -> Start review */}
              {report.reviewStatus === 'Needs review' && (
                <button
                  type="button"
                  onClick={() => onStatusTransition(report.id, 'In review')}
                  className="px-3.5 py-1.5 bg-[#141E28] hover:bg-[#1E2E3E] text-white font-medium rounded-xs text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  <span>Start review</span>
                </button>
              )}

              {/* Workflow: In review -> Verify or Reject */}
              {report.reviewStatus === 'In review' && (
                <>
                  <button
                    type="button"
                    onClick={() => onStatusTransition(report.id, 'Rejected')}
                    className="px-3 py-1.5 border border-[#B93829]/40 bg-[#FDF2F0] hover:bg-[#FCE8E5] text-[#B93829] font-medium rounded-xs text-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Reject report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onStatusTransition(report.id, 'Verified')}
                    className="px-3.5 py-1.5 bg-[#141E28] hover:bg-[#1E2E3E] text-white font-medium rounded-xs text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Verify report</span>
                  </button>
                </>
              )}

              {/* Workflow: Verified -> Reopen */}
              {report.reviewStatus === 'Verified' && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-2 py-1 rounded-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onStatusTransition(report.id, 'In review')}
                    className="px-3 py-1.5 border border-[#DCD9CD] bg-white hover:bg-[#EAE8DD] text-[#141E28] font-medium rounded-xs text-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3 text-[#717886]" />
                    <span>Reopen for review</span>
                  </button>
                </div>
              )}

              {/* Workflow: Rejected -> Reopen */}
              {report.reviewStatus === 'Rejected' && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#717886] bg-[#EAE8DD] border border-[#DCD9CD] px-2 py-1 rounded-xs">
                    <Ban className="w-3.5 h-3.5 text-[#B93829]" />
                    <span>Rejected</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onStatusTransition(report.id, 'In review')}
                    className="px-3 py-1.5 border border-[#DCD9CD] bg-white hover:bg-[#EAE8DD] text-[#141E28] font-medium rounded-xs text-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3 text-[#717886]" />
                    <span>Reopen for review</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
