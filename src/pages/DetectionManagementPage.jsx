import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { PlaceholderPage } from '../components/common/PlaceholderPage';

export function DetectionManagementPage() {
  return (
    <PlaceholderPage
      title="Detections"
      subtitle="Catalog of reported road damage detections with triage and review workflows."
      icon={ShieldAlert}
      moduleCode="MOD-04-DETECTIONS"
      plannedFeatures={[
        'Comprehensive list of incoming road reports with search and filtering',
        'Status tracking for reported damage (Needs Review, In Review, Verified)',
        'Export report records for municipal review'
      ]}
    />
  );
}
