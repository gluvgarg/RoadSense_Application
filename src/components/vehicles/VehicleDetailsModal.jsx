import { useEffect } from 'react';
import { 
  X, 
  Truck, 
  Cpu, 
  Clock, 
  MapPin, 
  FileText, 
  ShieldCheck 
} from 'lucide-react';

export function VehicleDetailsModal({ vehicle, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && vehicle) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [vehicle, onClose]);

  if (!vehicle) return null;

  const isOnline = vehicle.status === 'Online';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicle-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141E28]/40 backdrop-blur-xs"
    >
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-lg bg-[#F6F5EE] border border-[#DCD9CD] shadow-xl rounded-xs overflow-hidden z-10 animate-in fade-in-50 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#EAE8DD] border-b border-[#DCD9CD] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#141E28] text-white flex items-center justify-center shadow-2xs">
              <Truck className="w-3.5 h-3.5 text-[#2DD4BF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="vehicle-details-title" className="text-sm font-bold font-mono text-[#141E28] tracking-tight">
                  {vehicle.id}
                </h2>
                <span className="font-mono text-[11px] text-[#575F6E] bg-[#DCD9CD]/40 px-1.5 py-0.5 rounded-xs border border-[#DCD9CD]">
                  {vehicle.registrationNumber}
                </span>
              </div>
              <p className="text-[11px] text-[#717886] mt-0.5">
                {vehicle.fleet} · {vehicle.vehicleType}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#717886] hover:text-[#141E28] hover:bg-[#DCD9CD]/60 transition-colors cursor-pointer"
            aria-label="Close vehicle details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Status Banner */}
          <div className="p-3 bg-white border border-[#DCD9CD] rounded-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#10B981]' : 'bg-[#717886]'}`}
              />
              <span className="font-semibold text-[#141E28]">
                {vehicle.status}
              </span>
              <span className="text-[11px] text-[#717886]">
                ({isOnline ? 'Active telemetry stream' : 'Device in standby/off duty'})
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#717886] border border-[#DCD9CD] bg-[#F6F5EE] px-1.5 py-0.5 rounded-xs">
              DEMO STATUS
            </span>
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-[#EAE8DD]/40 border border-[#DCD9CD] rounded-xs text-[11px]">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#717886] block">
                Assigned Edge Device
              </span>
              <div className="font-mono font-medium text-[#141E28] mt-0.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#1E6091] shrink-0" />
                <span>{vehicle.deviceId}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-[#717886] block">
                Last Synchronization
              </span>
              <div className="font-mono text-[#141E28] mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#717886] shrink-0" />
                <span>{vehicle.lastSync}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-[#717886] block">
                Road Reports Submitted
              </span>
              <div className="font-semibold text-[#141E28] mt-0.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#717886] shrink-0" />
                <span>{vehicle.reportsCount} damage detections</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-[#717886] block">
                Assigned Region
              </span>
              <div className="text-[#141E28] mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#717886] shrink-0" />
                <span>{vehicle.assignedRegion || 'Delhi NCR'}</span>
              </div>
            </div>

            <div className="col-span-2 pt-2 border-t border-[#DCD9CD]/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#717886] block">
                  Onboard Firmware
                </span>
                <span className="font-mono text-[#575F6E] mt-0.5 block">
                  {vehicle.firmwareVersion || 'EdgeOS v2.4.1'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-[#717886] block">
                  Fleet Classification
                </span>
                <span className="font-medium text-[#141E28] mt-0.5 block">
                  {vehicle.vehicleType}
                </span>
              </div>
            </div>
          </div>

          {/* Operational Notes */}
          {vehicle.notes && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#717886] uppercase tracking-wider block">
                Route & Operational Notes
              </span>
              <p className="text-[#575F6E] text-[11px] leading-relaxed bg-[#EAE8DD]/20 p-2.5 border border-[#DCD9CD] rounded-xs font-sans">
                {vehicle.notes}
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-2.5 bg-[#FAF8F3] border border-[#DCD9CD] rounded-xs flex items-start gap-2 text-[10px] text-[#717886]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E6091] mt-0.5 shrink-0" />
            <p className="leading-tight">
              Vehicle data is demonstration state. No live tracking, remote commands, or vehicle control features are supported.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-[#DCD9CD] flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-[#141E28] hover:bg-[#1E2E3E] text-white text-xs font-medium rounded-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
