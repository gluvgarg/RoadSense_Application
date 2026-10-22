import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Cpu, AlertCircle, ShieldCheck } from 'lucide-react';
import { FLEET_OPERATORS, VEHICLE_TYPES } from '../../data/mockVehicles';

export function VehicleRegistrationModal({
  isOpen,
  onClose,
  onRegister,
  existingFleets = FLEET_OPERATORS,
  vehicleTypes = VEHICLE_TYPES
}) {
  const [formData, setFormData] = useState({
    vehicleId: '',
    registrationNumber: '',
    fleet: existingFleets[0] || 'Delhi Urban Transit',
    vehicleType: vehicleTypes[0] || 'Transit Bus',
    deviceId: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const firstInputRef = useRef(null);

  const handleClose = useCallback(() => {
    setFormData({
      vehicleId: '',
      registrationNumber: '',
      fleet: existingFleets[0] || 'Delhi Urban Transit',
      vehicleType: vehicleTypes[0] || 'Transit Bus',
      deviceId: ''
    });
    setErrors({});
    setTouched({});
    onClose();
  }, [existingFleets, vehicleTypes, onClose]);

  // Focus the first input upon opening
  useEffect(() => {
    if (isOpen) {
      firstInputRef.current?.focus();
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.vehicleId.trim()) {
      newErrors.vehicleId = 'Vehicle ID or registration number is required.';
    }

    if (!formData.fleet.trim()) {
      newErrors.fleet = 'Fleet operator is required.';
    }

    if (!formData.vehicleType.trim()) {
      newErrors.vehicleType = 'Vehicle type is required.';
    }

    if (!formData.deviceId.trim()) {
      newErrors.deviceId = 'Edge AI Device ID is required.';
    } else if (!formData.deviceId.toUpperCase().startsWith('DEV-RS-') && !formData.deviceId.toUpperCase().startsWith('DEV-')) {
      newErrors.deviceId = 'Device ID format standard is DEV-RS-XXX (e.g. DEV-RS-210).';
    }

    return newErrors;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validate();
    if (validationErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        vehicleId: true,
        registrationNumber: true,
        fleet: true,
        vehicleType: true,
        deviceId: true
      });
      return;
    }

    // Standardize registration / vehicle ID
    const trimmedId = formData.vehicleId.trim().toUpperCase();
    const formattedVehicle = {
      id: trimmedId.startsWith('VH-') ? trimmedId : `VH-${Math.floor(1100 + Math.random() * 899)}`,
      registrationNumber: formData.registrationNumber.trim().toUpperCase() || trimmedId,
      fleet: formData.fleet.trim(),
      vehicleType: formData.vehicleType.trim(),
      deviceId: formData.deviceId.trim().toUpperCase(),
      status: 'Online',
      lastSync: 'Just now',
      reportsCount: 0,
      firmwareVersion: 'EdgeOS v2.4.1',
      assignedRegion: 'Delhi NCR Fleet Corridor',
      notes: 'Newly enrolled demonstration vehicle with active Edge AI camera unit.'
    };

    onRegister(formattedVehicle);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-vehicle-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141E28]/40 backdrop-blur-xs"
    >
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={handleClose} aria-hidden="true" />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-lg bg-[#F6F5EE] border border-[#DCD9CD] shadow-xl rounded-xs overflow-hidden z-10 animate-in fade-in-50 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-[#EAE8DD] border-b border-[#DCD9CD] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#141E28] text-white flex items-center justify-center shadow-2xs">
              <Cpu className="w-3.5 h-3.5 text-[#2DD4BF]" />
            </div>
            <div>
              <h2 id="register-vehicle-title" className="text-sm font-bold text-[#141E28] tracking-tight">
                Register New Vehicle
              </h2>
              <p className="text-[11px] text-[#575F6E]">
                Pair a fleet vehicle with an onboard RoadSense Edge AI device.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded text-[#717886] hover:text-[#141E28] hover:bg-[#DCD9CD]/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* 1. Vehicle ID or Registration */}
          <div className="space-y-1">
            <label htmlFor="reg-vehicleId" className="block text-[11px] font-semibold text-[#141E28]">
              Vehicle ID or Registration Number <span className="text-[#B93829]">*</span>
            </label>
            <input
              id="reg-vehicleId"
              ref={firstInputRef}
              type="text"
              placeholder="e.g. DL 1C AB 4092 or VH-1102"
              value={formData.vehicleId}
              onChange={(e) => handleChange('vehicleId', e.target.value)}
              onBlur={() => handleBlur('vehicleId')}
              className={`w-full px-3 py-2 bg-white border rounded-xs font-mono text-xs text-[#141E28] placeholder-[#717886] focus:outline-none focus:ring-1 focus:ring-[#141E28] transition-colors ${
                errors.vehicleId && touched.vehicleId ? 'border-[#B93829]' : 'border-[#DCD9CD]'
              }`}
            />
            {errors.vehicleId && touched.vehicleId && (
              <p className="text-[11px] text-[#B93829] flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.vehicleId}</span>
              </p>
            )}
            <p className="text-[10px] text-[#717886]">
              Enter either the official state registration plate or internal fleet unit number.
            </p>
          </div>

          {/* 2. Fleet / Operator */}
          <div className="space-y-1">
            <label htmlFor="reg-fleet" className="block text-[11px] font-semibold text-[#141E28]">
              Fleet / Operator <span className="text-[#B93829]">*</span>
            </label>
            <select
              id="reg-fleet"
              value={formData.fleet}
              onChange={(e) => handleChange('fleet', e.target.value)}
              onBlur={() => handleBlur('fleet')}
              className={`w-full px-3 py-2 bg-white border rounded-xs text-xs text-[#141E28] focus:outline-none focus:ring-1 focus:ring-[#141E28] ${
                errors.fleet && touched.fleet ? 'border-[#B93829]' : 'border-[#DCD9CD]'
              }`}
            >
              {existingFleets.map((fleet) => (
                <option key={fleet} value={fleet}>
                  {fleet}
                </option>
              ))}
            </select>
            {errors.fleet && touched.fleet && (
              <p className="text-[11px] text-[#B93829] flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.fleet}</span>
              </p>
            )}
          </div>

          {/* 3. Vehicle Type */}
          <div className="space-y-1">
            <label htmlFor="reg-type" className="block text-[11px] font-semibold text-[#141E28]">
              Vehicle Type <span className="text-[#B93829]">*</span>
            </label>
            <select
              id="reg-type"
              value={formData.vehicleType}
              onChange={(e) => handleChange('vehicleType', e.target.value)}
              onBlur={() => handleBlur('vehicleType')}
              className={`w-full px-3 py-2 bg-white border rounded-xs text-xs text-[#141E28] focus:outline-none focus:ring-1 focus:ring-[#141E28] ${
                errors.vehicleType && touched.vehicleType ? 'border-[#B93829]' : 'border-[#DCD9CD]'
              }`}
            >
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.vehicleType && touched.vehicleType && (
              <p className="text-[11px] text-[#B93829] flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.vehicleType}</span>
              </p>
            )}
          </div>

          {/* 4. Edge AI Device ID */}
          <div className="space-y-1">
            <label htmlFor="reg-deviceId" className="block text-[11px] font-semibold text-[#141E28]">
              Edge AI Device ID <span className="text-[#B93829]">*</span>
            </label>
            <input
              id="reg-deviceId"
              type="text"
              placeholder="e.g. DEV-RS-214"
              value={formData.deviceId}
              onChange={(e) => handleChange('deviceId', e.target.value)}
              onBlur={() => handleBlur('deviceId')}
              className={`w-full px-3 py-2 bg-white border rounded-xs font-mono text-xs text-[#141E28] placeholder-[#717886] focus:outline-none focus:ring-1 focus:ring-[#141E28] transition-colors ${
                errors.deviceId && touched.deviceId ? 'border-[#B93829]' : 'border-[#DCD9CD]'
              }`}
            />
            {errors.deviceId && touched.deviceId && (
              <p className="text-[11px] text-[#B93829] flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.deviceId}</span>
              </p>
            )}
            <p className="text-[10px] text-[#717886]">
              Standard identifier from the optical Edge AI camera module packaging.
            </p>
          </div>

          {/* Demonstration Notice */}
          <div className="p-3 bg-[#EAE8DD]/40 border border-[#DCD9CD] rounded-xs flex items-start gap-2 text-[11px] text-[#575F6E]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E6091] mt-0.5 shrink-0" />
            <p className="leading-relaxed">
              <strong>Demonstration State:</strong> Registered vehicles are added immediately to local React prototype state. No real-world physical device provisioning or backend telemetry occurs.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#DCD9CD] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-1.5 border border-[#DCD9CD] bg-white hover:bg-[#EAE8DD] text-[#141E28] font-medium rounded-xs text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#141E28] hover:bg-[#1E2E3E] text-white font-medium rounded-xs text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Register vehicle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
