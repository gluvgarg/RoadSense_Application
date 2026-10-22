/**
 * RoadSense Vehicle & Edge AI Device Demonstration Dataset
 * NOTE: Fictional demonstration data for the Vehicles & Devices administration interface.
 * Not connected to live physical hardware or backend telemetry.
 */

export const FLEET_OPERATORS = [
  'Delhi Urban Transit',
  'NCR Logistics Express',
  'Capital Mobility Services',
  'North Transit Corp',
  'Delhi Municipal Works',
  'QuickRoute Courier'
];

export const VEHICLE_TYPES = [
  'Transit Bus',
  'Delivery Van',
  'Commercial Sedan',
  'Inspection Vehicle',
  'Intercity Coach',
  'Light Commercial Van',
  'Heavy Freight Truck'
];

export const INITIAL_VEHICLES = [
  {
    id: 'VH-1021',
    registrationNumber: 'DL 1P AA 4821',
    fleet: 'Delhi Urban Transit',
    vehicleType: 'Transit Bus',
    deviceId: 'DEV-RS-041',
    status: 'Online',
    lastSync: 'Today, 09:48',
    reportsCount: 184,
    firmwareVersion: 'EdgeOS v2.4.1',
    assignedRegion: 'Delhi Central & South',
    notes: 'Regular scheduled route across Ring Road and Outer Ring Road corridors.'
  },
  {
    id: 'VH-1035',
    registrationNumber: 'DL 2C AB 1109',
    fleet: 'NCR Logistics Express',
    vehicleType: 'Delivery Van',
    deviceId: 'DEV-RS-088',
    status: 'Online',
    lastSync: 'Today, 09:35',
    reportsCount: 92,
    firmwareVersion: 'EdgeOS v2.4.1',
    assignedRegion: 'Gurugram & West Delhi',
    notes: 'Dedicated parcel delivery routes covering Dwarka and NH-48 sectors.'
  },
  {
    id: 'VH-1044',
    registrationNumber: 'DL 1T 5582',
    fleet: 'Capital Mobility Services',
    vehicleType: 'Commercial Sedan',
    deviceId: 'DEV-RS-102',
    status: 'Online',
    lastSync: 'Today, 09:12',
    reportsCount: 145,
    firmwareVersion: 'EdgeOS v2.3.8',
    assignedRegion: 'Aerocity & South Delhi',
    notes: 'Frequent airport connector trips along Rao Tula Ram Marg.'
  },
  {
    id: 'VH-1052',
    registrationNumber: 'HR 26 DQ 8820',
    fleet: 'North Transit Corp',
    vehicleType: 'Intercity Coach',
    deviceId: 'DEV-RS-115',
    status: 'Offline',
    lastSync: 'Today, 06:20',
    reportsCount: 67,
    firmwareVersion: 'EdgeOS v2.3.8',
    assignedRegion: 'Delhi - Jaipur Highway',
    notes: 'Vehicle currently in depot for routine scheduled mechanical maintenance.'
  },
  {
    id: 'VH-1068',
    registrationNumber: 'DL 3C CE 7291',
    fleet: 'Delhi Municipal Works',
    vehicleType: 'Inspection Vehicle',
    deviceId: 'DEV-RS-134',
    status: 'Online',
    lastSync: 'Today, 09:50',
    reportsCount: 231,
    firmwareVersion: 'EdgeOS v2.4.1',
    assignedRegion: 'East & Central Delhi',
    notes: 'Equipped with dual forward-facing optical sensors for municipal road audit.'
  },
  {
    id: 'VH-1077',
    registrationNumber: 'UP 16 AT 3902',
    fleet: 'QuickRoute Courier',
    vehicleType: 'Light Commercial Van',
    deviceId: 'DEV-RS-149',
    status: 'Online',
    lastSync: 'Today, 08:44',
    reportsCount: 58,
    firmwareVersion: 'EdgeOS v2.4.1',
    assignedRegion: 'Noida & East Delhi',
    notes: 'Covers Vikas Marg and Noida Expressway corridors during morning operations.'
  },
  {
    id: 'VH-1083',
    registrationNumber: 'DL 1P AB 9032',
    fleet: 'Delhi Urban Transit',
    vehicleType: 'Transit Bus',
    deviceId: 'DEV-RS-162',
    status: 'Offline',
    lastSync: 'Yesterday, 22:15',
    reportsCount: 114,
    firmwareVersion: 'EdgeOS v2.3.8',
    assignedRegion: 'North Delhi Corridors',
    notes: 'Night shift completed; awaiting morning driver check-in and power cycle.'
  },
  {
    id: 'VH-1090',
    registrationNumber: 'HR 55 R 6124',
    fleet: 'NCR Logistics Express',
    vehicleType: 'Heavy Freight Truck',
    deviceId: 'DEV-RS-177',
    status: 'Online',
    lastSync: 'Today, 09:22',
    reportsCount: 83,
    firmwareVersion: 'EdgeOS v2.4.1',
    assignedRegion: 'Kundli-Manesar Expressway',
    notes: 'Industrial freight corridor monitoring with calibrated vibration damping.'
  },
  {
    id: 'VH-1099',
    registrationNumber: 'DL 4C AG 1450',
    fleet: 'Capital Mobility Services',
    vehicleType: 'Commercial Sedan',
    deviceId: 'DEV-RS-195',
    status: 'Offline',
    lastSync: 'Yesterday, 18:40',
    reportsCount: 39,
    firmwareVersion: 'EdgeOS v2.3.8',
    assignedRegion: 'Connaught Place & Central',
    notes: 'Device synchronization in standby mode pending ignition trigger.'
  }
];
