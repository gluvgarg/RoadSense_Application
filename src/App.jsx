import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { RoadConditionsPage } from './pages/RoadConditionsPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { DetectionManagementPage } from './pages/DetectionManagementPage';
import { NavigationPage } from './pages/NavigationPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<CommandCenterPage />} />
          <Route path="/conditions" element={<RoadConditionsPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/detections" element={<DetectionManagementPage />} />
          <Route path="/navigation" element={<NavigationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
