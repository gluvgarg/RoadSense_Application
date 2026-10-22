import { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  RotateCcw, 
  X, 
  Truck, 
  Cpu, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { INITIAL_VEHICLES, FLEET_OPERATORS, VEHICLE_TYPES } from '../data/mockVehicles';
import { VehicleRegistrationModal } from '../components/vehicles/VehicleRegistrationModal';
import { VehicleDetailsModal } from '../components/vehicles/VehicleDetailsModal';

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Check if any filter is actively applied
  const isFilterActive = searchQuery.trim() !== '' || statusFilter !== 'ALL';

  // Filter vehicles according to search and status
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // 1. Connection status filter
      if (statusFilter !== 'ALL' && v.status !== statusFilter) {
        return false;
      }

      // 2. Search query matches vehicle ID, plate, fleet, deviceId, or type
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = v.id.toLowerCase().includes(q);
        const matchesPlate = v.registrationNumber?.toLowerCase().includes(q);
        const matchesFleet = v.fleet.toLowerCase().includes(q);
        const matchesDevice = v.deviceId.toLowerCase().includes(q);
        const matchesType = v.vehicleType?.toLowerCase().includes(q);

        if (!matchesId && !matchesPlate && !matchesFleet && !matchesDevice && !matchesType) {
          return false;
        }
      }

      return true;
    });
  }, [vehicles, searchQuery, statusFilter]);

  // Derived counts
  const totalVehicles = vehicles.length;
  const onlineCount = useMemo(() => vehicles.filter((v) => v.status === 'Online').length, [vehicles]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
  };

  const handleRegisterVehicle = (newVehicle) => {
    setVehicles((prev) => [newVehicle, ...prev]);
    setNotification({
      message: `Vehicle ${newVehicle.id} (${newVehicle.registrationNumber}) successfully registered and paired with ${newVehicle.deviceId}. (Demonstration state)`
    });

    // Auto-dismiss notification after 7 seconds
    setTimeout(() => {
      setNotification((curr) => (curr?.message.includes(newVehicle.id) ? null : curr));
    }, 7000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Editorial Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono text-[#717886] uppercase tracking-wider">
            03 / VEHICLES & DEVICES
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#141E28] tracking-tight leading-none">
            Vehicles & Devices
          </h1>

          <p className="text-xs sm:text-sm text-[#575F6E] leading-relaxed pt-0.5">
            Manage registered vehicles and their assigned RoadSense devices.
          </p>
        </div>

        {/* Live Counter */}
        <div className="text-[11px] font-mono text-[#717886] sm:text-right shrink-0">
          <span>Showing </span>
          <strong className="text-[#141E28] font-bold">{filteredVehicles.length}</strong>
          <span> of {totalVehicles} registered vehicles</span>
          <div className="text-[10px] text-[#717886] mt-0.5">
            {onlineCount} online · {totalVehicles - onlineCount} standby / offline
          </div>
        </div>
      </section>

      {/* 2. Success Banner Notification */}
      {notification && (
        <aside
          role="status"
          aria-live="polite"
          className="border border-[#10B981]/40 bg-[#10B981]/10 px-4 py-3 rounded-xs flex items-center justify-between gap-3 text-xs text-[#141E28]"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 rounded text-[#717886] hover:text-[#141E28] transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* 3. Compact Toolbar: Search, Status Filter & Register Vehicle Action */}
      <section
        aria-label="Vehicle Directory Toolbar"
        className="border border-[#DCD9CD] bg-[#F6F5EE] p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs rounded-xs"
      >
        {/* Left: Search input & Status dropdown */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search by Vehicle ID, Registration, Fleet, or Device */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-3.5 h-3.5 text-[#717886] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by vehicle ID, registration or fleet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 bg-white border border-[#DCD9CD] rounded-xs text-xs text-[#141E28] placeholder-[#717886] focus:outline-none focus:ring-1 focus:ring-[#141E28] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#717886] hover:text-[#141E28] cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Connection Status Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="vehicle-status-select" className="text-[10px] font-mono uppercase text-[#717886]">
              Status:
            </label>
            <select
              id="vehicle-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-[#DCD9CD] rounded-xs text-xs text-[#141E28] font-medium focus:outline-none focus:ring-1 focus:ring-[#141E28]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* Clear Filters Action */}
          {isFilterActive && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-xs text-[#1E6091] hover:text-[#141E28] font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Right: Primary Register Vehicle Action */}
        <button
          type="button"
          onClick={() => setIsRegisterModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#141E28] hover:bg-[#1E2E3E] text-white text-xs font-medium rounded-xs transition-colors shadow-2xs cursor-pointer shrink-0 self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register vehicle</span>
        </button>
      </section>

      {/* 4. Vehicle Directory Table */}
      <section aria-label="Vehicle Directory" className="space-y-2">
        <div className="border border-[#DCD9CD] bg-[#F6F5EE] overflow-x-auto rounded-xs">
          <table className="w-full text-left text-xs text-[#141E28] border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#DCD9CD] bg-[#EAE8DD] text-[10px] font-mono text-[#717886] uppercase tracking-wider">
                <th scope="col" className="py-2.5 px-4 font-semibold">
                  Vehicle ID / Registration
                </th>
                <th scope="col" className="py-2.5 px-4 font-semibold">
                  Fleet / Operator
                </th>
                <th scope="col" className="py-2.5 px-4 font-semibold">
                  Assigned Edge AI Device
                </th>
                <th scope="col" className="py-2.5 px-4 font-semibold">
                  Connection Status
                </th>
                <th scope="col" className="py-2.5 px-4 font-semibold">
                  Last Sync
                </th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-right">
                  Road Reports
                </th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD9CD]">
              {filteredVehicles.map((vehicle) => {
                const isOnline = vehicle.status === 'Online';
                const isSelected = selectedVehicle?.id === vehicle.id;

                return (
                  <tr
                    key={vehicle.id}
                    tabIndex={0}
                    onClick={() => setSelectedVehicle(vehicle)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedVehicle(vehicle);
                      }
                    }}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-[#EAE8DD]'
                        : 'hover:bg-[#EAE8DD]/40'
                    }`}
                  >
                    {/* Vehicle ID & Plate */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-xs bg-[#EAE8DD] border border-[#DCD9CD] flex items-center justify-center text-[#141E28] shrink-0">
                          <Truck className="w-3.5 h-3.5 text-[#575F6E]" />
                        </div>
                        <div>
                          <div className="font-mono font-bold text-xs text-[#141E28]">
                            {vehicle.id}
                          </div>
                          <div className="text-[11px] font-mono text-[#575F6E] flex items-center gap-1 mt-0.5">
                            <span>{vehicle.registrationNumber}</span>
                            <span>·</span>
                            <span className="text-[10px] text-[#717886] font-sans">{vehicle.vehicleType}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Fleet / Operator */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-xs text-[#141E28]">
                        {vehicle.fleet}
                      </span>
                    </td>

                    {/* Assigned Device */}
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white border border-[#DCD9CD] rounded-xs font-mono text-[11px] text-[#141E28]">
                        <Cpu className="w-3 h-3 text-[#1E6091] shrink-0" />
                        <span>{vehicle.deviceId}</span>
                      </div>
                    </td>

                    {/* Connection Status */}
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOnline ? 'bg-[#10B981]' : 'bg-[#717886]'
                          }`}
                        />
                        <span className="font-medium text-xs text-[#141E28]">
                          {vehicle.status}
                        </span>
                      </div>
                    </td>

                    {/* Last Sync */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-[#575F6E]">
                        {vehicle.lastSync}
                      </span>
                    </td>

                    {/* Road Reports Submitted */}
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-semibold text-xs text-[#141E28]">
                        {vehicle.reportsCount}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVehicle(vehicle);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1E6091] group-hover:text-[#141E28] transition-colors cursor-pointer"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty State when no vehicles match filter */}
          {filteredVehicles.length === 0 && (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-9 h-9 mx-auto rounded-full bg-[#EAE8DD] border border-[#DCD9CD] flex items-center justify-center text-[#717886]">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#141E28]">
                No Vehicles Found
              </h3>
              <p className="text-xs text-[#575F6E] max-w-sm mx-auto leading-relaxed">
                No registered vehicles match your current search and status filter combination.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3.5 py-1.5 bg-[#141E28] hover:bg-[#1E2E3E] text-white text-xs font-medium rounded-xs transition-colors cursor-pointer shadow-2xs"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. Registration Modal */}
      <VehicleRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegisterVehicle}
        existingFleets={FLEET_OPERATORS}
        vehicleTypes={VEHICLE_TYPES}
      />

      {/* 6. Vehicle Details Modal */}
      <VehicleDetailsModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />
    </div>
  );
}
