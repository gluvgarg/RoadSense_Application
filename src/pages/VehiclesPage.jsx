import React from 'react';
import { Truck } from 'lucide-react';
import { PlaceholderPage } from '../components/common/PlaceholderPage';

export function VehiclesPage() {
  return (
    <PlaceholderPage
      title="Vehicles & Devices"
      subtitle="Connected fleet vehicle management, device registration, and reporting status."
      icon={Truck}
      moduleCode="MOD-03-FLEET-DEVICES"
      plannedFeatures={[
        'Real-time vehicle list with GNSS coordinates, speed, and heading',
        'Onboard Edge AI inference model deployment and OTA version management',
        'Stereo vision camera, IMU accelerometer, and LiDAR sensor health telemetry',
        'Daily road coverage mileage tracking per vehicle and device'
      ]}
    />
  );
}
