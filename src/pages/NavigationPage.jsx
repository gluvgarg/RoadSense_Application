import React from 'react';
import { Navigation } from 'lucide-react';
import { PlaceholderPage } from '../components/common/PlaceholderPage';

export function NavigationPage() {
  return (
    <PlaceholderPage
      title="Navigation"
      subtitle="Road-quality-aware navigation for drivers and fleet operators."
      icon={Navigation}
      moduleCode="MOD-05-NAVIGATION"
      plannedFeatures={[
        'Route planning with road damage hazard awareness',
        'Visual alerts for known potholes and road defects along routes',
        'Driver report submission for newly encountered road hazards'
      ]}
    />
  );
}
