# RoadSense — Vehicle-Powered Road Intelligence

RoadSense is an administrative web application designed for municipal road infrastructure operators and fleet managers. The platform collects road condition telemetry from Edge AI-equipped fleet vehicles to detect, classify, and track potholes, cracks, and surface deterioration in real time.

---

## 1. Five Main Application Pages

The application provides five core operational workflows accessible via the persistent top navigation:

1. **Command Center (`/`)**: High-level municipal dashboard presenting overall fleet coverage, total reported road defects, pending review counts, a recent reports feed with direct review navigation, and a severity tier distribution profile.
2. **Road Conditions (`/conditions`)**: Interactive geographic overview of reported defects across the Delhi NCR corridor utilizing Mapbox Standard daytime basemap, complete with multi-criteria filtering (search, severity, review status) and selected hazard inspection popups.
3. **Vehicles & Devices (`/vehicles`)**: Fleet telematics and edge unit registry allowing administrators to monitor vehicle activity, filter by status or operator, inspect mounted AI camera specs, and register new vehicles into session state.
4. **Detections (`/detections`)**: Dedicated damage assessment and review repository supporting deep search, status workflow transitions (`Needs review` → `In review` → `Verified` / `Rejected`), detection detail modals, and CSV data export. Supports pre-filtered deep-linking from the Command Center via `?reportId=`.
5. **Navigation (`/navigation`)**: Road-quality-aware route planning combining live Mapbox Directions API driving routes with localized road-damage analysis. Compares multi-alternative geometries against known defect locations within a 150-metre corridor to compute demo exposure index scores.

---

## 2. Technology Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Mapping & Geospatial**: [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) & [react-map-gl](https://visgl.github.io/react-map-gl/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Code Linter**: [Oxlint](https://oxc.rs/)

---

## 3. Installation & Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Setup & Run

```bash
# Navigate to the project directory
cd roadsense

# Install dependencies
npm install

# Start the Vite development server (default: http://localhost:5173)
npm run dev

# Run Oxlint for static analysis
npm run lint

# Compile production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 4. Mapbox Configuration

Interactive mapping, location geocoding, and driving route calculation require a public Mapbox token.

1. Copy or create a `.env` file in the `roadsense/` root directory:
   ```bash
   cp .env.example .env
   ```
2. Configure your public Mapbox access token:
   ```env
   VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1...your_token_here
   ```
3. Restart the Vite development server to load the new environment variable.

> **Security Note:** Never commit `.env` or hardcode actual Mapbox access tokens into source control. The `.gitignore` file is configured to exclude all `.env*` files except `.env.example`.

---

## 5. Architecture & Directory Structure

```text
roadsense/
├── src/
│   ├── assets/              # Static media assets
│   ├── components/
│   │   ├── command-center/  # SummaryMetrics, ConditionProfile, RecentReportsTable
│   │   ├── detections/      # DetectionDetailsModal review dialog
│   │   ├── layout/          # AppShell persistent wrapper, horizontal Navbar
│   │   ├── navigation/      # LocationSearchInput, NavigationMap, RouteComparisonPanel
│   │   ├── road-conditions/ # RoadConditionsMap interactive visualization
│   │   └── vehicles/        # VehicleDetailsModal, VehicleRegistrationModal
│   ├── data/
│   │   ├── mockData.js      # Curated Delhi NCR road hazard reports & summary metrics
│   │   └── mockVehicles.js  # Fleet operator profiles, connected vehicle records
│   ├── pages/
│   │   ├── CommandCenterPage.jsx
│   │   ├── DetectionManagementPage.jsx
│   │   ├── NavigationPage.jsx
│   │   ├── RoadConditionsPage.jsx
│   │   └── VehiclesPage.jsx
│   ├── utils/
│   │   └── geoUtils.js      # Polyline proximity math & route hazard exposure heuristic
│   ├── App.jsx              # Client router with 5 main routes
│   ├── index.css            # Tailwind CSS v4 styling rules
│   └── main.jsx             # React DOM root entry point
├── package.json
└── vite.config.js
```

---

## 6. Demonstration Data vs. Live APIs

- **Local Demonstration Data (`src/data/`)**:
  - Registered vehicles, fleet operators, device sensor IDs, and telemetry metrics.
  - Curated road damage sample reports across the Delhi NCR metropolitan region.
  - Status counts and aggregate condition profiles.
- **External Mapbox APIs**:
  - **Mapbox Standard Basemap**: Vector road geometry, daytime lighting, place labels.
  - **Mapbox Geocoding API (`/geocoding/v5/mapbox.places`)**: Autocomplete place search biased toward Delhi NCR with country filtering (`country=IN`).
  - **Mapbox Directions API (`/directions/v5/mapbox/driving`)**: Real driving route alternatives and turn-by-turn guidance coordinates.

---

## 7. Persistence Disclaimer

All runtime modifications—including newly registered vehicles, vehicle status updates, road detection review transitions (`Needs review` → `In review` → `Verified` / `Rejected`), and filters—operate strictly within in-memory React state for demonstration purposes. Changes are not persisted to a backend database or remote server and reset upon page refresh.
