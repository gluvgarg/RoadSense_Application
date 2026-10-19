import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { PlaceholderPage } from '../components/common/PlaceholderPage';

export function DetectionManagementPage() {
  return (
    <PlaceholderPage
      title="Detections"
      subtitle="Complete damage catalog, manual review, false positive filtering, and maintenance dispatch."
      icon={ShieldAlert}
      moduleCode="MOD-04-DETECTIONS"
      plannedFeatures={[
        'Full operational detection repository with advanced spatial and temporal filters',
        'Multi-frame Edge AI optical bounding box review and vibration waveform validation',
        'Severity reclassification, civil engineer approval, and contractor dispatch',
        'Bulk CSV / GeoJSON export for municipal GIS and road authority integration'
      ]}
    />
  );
}
