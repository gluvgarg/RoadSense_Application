/**
 * RoadSense Administrative Demonstration Dataset
 * NOTE: Fictional demonstration data corresponding to the approved Figma Make source of truth.
 * Not connected to a live backend.
 */

export const PROTOTYPE_META = {
  isDemo: true,
  disclaimer: 'Fictional demo data for interface prototype.',
  coverageRegion: 'Delhi NCR',
  lastSampleUpdate: '10:00 IST',
  operator: {
    name: 'ADMIN',
    role: 'Administrator',
    initials: 'A',
    email: 'admin@roadsense.internal'
  }
};

export const SUMMARY_METRICS = {
  registeredVehicles: {
    value: '248',
    label: 'Registered vehicles',
    subtext: 'Across 6 fleet operators',
    colorClass: 'text-[#1E6091]' // Restrained muted road blue
  },
  reportsReceived: {
    value: '1,429',
    label: 'Road reports received',
    subtext: 'All severity-classified · Demo data',
    colorClass: 'text-[#141E28]' // Deep navy
  },
  reportsRequiringReview: {
    value: '38',
    label: 'Reports requiring review',
    subtext: 'Awaiting human review · Demo data',
    colorClass: 'text-[#B93829]' // Restrained brick red
  }
};

export const CONDITION_PROFILE_DATA = {
  totalSeverityAssessed: '1,429',
  awaitingReviewCount: 38,
  highOrCriticalCount: 394, // 84 + 310 = 394
  severityTiers: [
    {
      key: 'Critical',
      label: 'Critical',
      count: 84,
      percentage: (84 / 1429) * 100, // ~5.9%
      dotColor: 'bg-[#B93829]',
      barColor: 'bg-[#B93829]',
      textColor: 'text-[#B93829]'
    },
    {
      key: 'High',
      label: 'High',
      count: 310,
      percentage: (310 / 1429) * 100, // ~21.7%
      dotColor: 'bg-[#C25E00]',
      barColor: 'bg-[#C25E00]',
      textColor: 'text-[#C25E00]'
    },
    {
      key: 'Moderate',
      label: 'Moderate',
      count: 594,
      percentage: (594 / 1429) * 100, // ~41.6%
      dotColor: 'bg-[#3A7599]',
      barColor: 'bg-[#3A7599]',
      textColor: 'text-[#3A7599]'
    },
    {
      key: 'Low',
      label: 'Low',
      count: 441,
      percentage: (441 / 1429) * 100, // ~30.8%
      dotColor: 'bg-[#9CA3AF]',
      barColor: 'bg-[#9CA3AF]',
      textColor: 'text-[#6B7280]'
    }
  ],
  alertNote: '394 reports are classified as high or critical. Human review remains pending for 38 reports across all severity levels.'
};

export const RECENT_REPORTS = [
  {
    id: 'RS-2841',
    roadLocation: 'Ring Road',
    subLocation: 'Moti Bagh, New Delhi',
    damageType: 'Deep pothole',
    severity: 'Critical',
    severityAccentColor: '#B93829',
    severityBgColor: '#FDF2F0',
    reviewStatus: 'Needs review',
    statusDotColor: '#B93829',
    reportTime: 'Today, 09:42',
    latitude: 28.5833,
    longitude: 77.1706,
    confidence: '98.4%',
    notes: 'Substantial asphalt cavity (>10cm depth) detected on middle lane near flyover approach. Immediate patch required.'
  },
  {
    id: 'RS-2838',
    roadLocation: 'Dwarka Road',
    subLocation: 'Sector 21, Dwarka',
    damageType: 'Surface break',
    severity: 'High',
    severityAccentColor: '#C25E00',
    severityBgColor: '#FEF6EE',
    reviewStatus: 'In review',
    statusDotColor: '#C25E00',
    reportTime: 'Today, 09:18',
    latitude: 28.5524,
    longitude: 77.0583,
    confidence: '95.1%',
    notes: 'Asphalt surface detachment with sharp edge profile. Assigned for verification.'
  },
  {
    id: 'RS-2835',
    roadLocation: 'Golf Course Road',
    subLocation: 'Sector 54, Gurugram',
    damageType: 'Longitudinal crack',
    severity: 'Moderate',
    severityAccentColor: '#B48C00',
    severityBgColor: '#FEFCE8',
    reviewStatus: 'Verified',
    statusDotColor: '#10B981',
    reportTime: 'Today, 08:51',
    latitude: 28.4382,
    longitude: 77.1086,
    confidence: '92.8%',
    notes: 'Linear crack extending 14 meters along lane boundary. Bituminous sealant scheduled.'
  },
  {
    id: 'RS-2831',
    roadLocation: 'Outer Ring Road',
    subLocation: 'Nehru Place, New Delhi',
    damageType: 'Road depression',
    severity: 'High',
    severityAccentColor: '#C25E00',
    severityBgColor: '#FEF6EE',
    reviewStatus: 'Needs review',
    statusDotColor: '#B93829',
    reportTime: 'Today, 08:23',
    latitude: 28.5494,
    longitude: 77.2536,
    confidence: '94.6%',
    notes: 'Sub-base settling creating 4cm depression across heavy bus lane.'
  },
  {
    id: 'RS-2827',
    roadLocation: 'NH 48',
    subLocation: 'IFFCO Chowk, Gurugram',
    damageType: 'Edge deterioration',
    severity: 'Low',
    severityAccentColor: '#1E6091',
    severityBgColor: '#F0F7FA',
    reviewStatus: 'Verified',
    statusDotColor: '#10B981',
    reportTime: 'Today, 07:56',
    latitude: 28.4721,
    longitude: 77.0725,
    confidence: '91.2%',
    notes: 'Shoulder gravel loss and minor asphalt edge raveling over 6 meters.'
  }
];

export const ROAD_CONDITIONS_REPORTS = [
  ...RECENT_REPORTS,
  {
    id: 'RS-2819',
    roadLocation: 'MG Road',
    subLocation: 'Sikanderpur, Gurugram',
    damageType: 'Surface depression',
    severity: 'Moderate',
    severityAccentColor: '#B48C00',
    severityBgColor: '#FEFCE8',
    reviewStatus: 'Needs review',
    statusDotColor: '#B93829',
    reportTime: 'Today, 07:22',
    latitude: 28.4816,
    longitude: 77.0932,
    confidence: '93.4%',
    notes: 'Shallow depression with rainwater retention risk during monsoon.'
  },
  {
    id: 'RS-2814',
    roadLocation: 'Noida Expressway',
    subLocation: 'Sector 128, Noida',
    damageType: 'Transverse cracking',
    severity: 'High',
    severityAccentColor: '#C25E00',
    severityBgColor: '#FEF6EE',
    reviewStatus: 'Verified',
    statusDotColor: '#10B981',
    reportTime: 'Today, 06:48',
    latitude: 28.5283,
    longitude: 77.3752,
    confidence: '96.1%',
    notes: 'Transverse thermal crack spanning lane width. Scheduled for joint sealing.'
  },
  {
    id: 'RS-2808',
    roadLocation: 'Vikas Marg',
    subLocation: 'Laxmi Nagar, East Delhi',
    damageType: 'Deep pothole',
    severity: 'Critical',
    severityAccentColor: '#B93829',
    severityBgColor: '#FDF2F0',
    reviewStatus: 'Needs review',
    statusDotColor: '#B93829',
    reportTime: 'Today, 06:15',
    latitude: 28.6318,
    longitude: 77.2798,
    confidence: '97.9%',
    notes: 'Cavity along wheel path causing traffic deceleration. Marked for emergency repair.'
  },
  {
    id: 'RS-2802',
    roadLocation: 'Mathura Road',
    subLocation: 'Ashram Chowk, South Delhi',
    damageType: 'Surface wear',
    severity: 'Low',
    severityAccentColor: '#1E6091',
    severityBgColor: '#F0F7FA',
    reviewStatus: 'Verified',
    statusDotColor: '#10B981',
    reportTime: 'Today, 05:40',
    latitude: 28.5721,
    longitude: 77.2584,
    confidence: '89.5%',
    notes: 'Gradual aggregate abrasion across outer lane. Monitoring status.'
  }
];

export const DELHI_NCR_MAP_CENTER = {
  latitude: 28.5350,
  longitude: 77.2168,
  zoom: 10.15
};

export { FLEET_OPERATORS, VEHICLE_TYPES, INITIAL_VEHICLES } from './mockVehicles';
