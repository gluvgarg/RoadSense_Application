import React from 'react';
import { Truck } from 'lucide-react';
import { PlaceholderPage } from '../components/common/PlaceholderPage';

export function VehiclesPage() {
  return (
    <PlaceholderPage
      title="Vehicles & Devices"
      subtitle="Management of registered fleet vehicles and connected road observation devices."
      icon={Truck}
      moduleCode="MOD-03-FLEET-DEVICES"
      plannedFeatures={[
        'Directory of registered fleet vehicles and operators',
        'Connected device status and recent report timestamps',
        'Vehicle registration and assignment management'
      ]}
    />
  );
}
