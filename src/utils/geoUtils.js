/**
 * RoadSense Geographic & Route Geometry Utilities
 * Provides planar equirectangular distance calculations, polyline proximity testing,
 * and hazard exposure heuristic scoring for the Delhi NCR corridor.
 */

export const SEVERITY_WEIGHTS = {
  Critical: 10,
  High: 6,
  Moderate: 3,
  Low: 1
};

/**
 * Calculates perpendicular or endpoint distance in meters from point P(px, py)
 * to line segment AB [(ax, ay), (bx, by)] using equirectangular projection.
 * Coordinates are in [longitude, latitude] degrees.
 */
export function distancePointToSegmentMeters(px, py, ax, ay, bx, by) {
  // Average latitude in radians for longitude scaling
  const midLatRad = ((py + ay + by) / 3) * (Math.PI / 180);
  const kx = Math.cos(midLatRad) * 111320; // meters per degree longitude
  const ky = 110540; // meters per degree latitude

  // Projected delta vectors in meters relative to point A
  const dx = (bx - ax) * kx;
  const dy = (by - ay) * ky;
  const l2 = dx * dx + dy * dy;

  const ptx = (px - ax) * kx;
  const pty = (py - ay) * ky;

  // Segment is degenerate (a single point)
  if (l2 === 0) {
    return Math.sqrt(ptx * ptx + pty * pty);
  }

  // Projection parameter t clamped to [0, 1]
  const t = Math.max(0, Math.min(1, (ptx * dx + pty * dy) / l2));
  const projX = t * dx;
  const projY = t * dy;

  const diffX = ptx - projX;
  const diffY = pty - projY;
  return Math.sqrt(diffX * diffX + diffY * diffY);
}

/**
 * Calculates the minimum distance in meters from a point [lng, lat]
 * to a route polyline coordinate array [[lng, lat], ...].
 */
export function minDistanceToPolyline(pointLng, pointLat, coordinates) {
  if (!coordinates || coordinates.length < 2) return Infinity;

  let minDistance = Infinity;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [ax, ay] = coordinates[i];
    const [bx, by] = coordinates[i + 1];
    const dist = distancePointToSegmentMeters(pointLng, pointLat, ax, ay, bx, by);
    if (dist < minDistance) {
      minDistance = dist;
    }
  }
  return minDistance;
}

/**
 * Computes road hazard exposure for a given route polyline against road damage reports.
 * Filters out 'Rejected' reports and deduplicates reports so each report contributes
 * at most once per route.
 *
 * @param {Array<[number, number]>} routeCoordinates GeoJSON coordinates array [[lng, lat], ...]
 * @param {Array<Object>} reports Road hazard report dataset
 * @param {number} thresholdMeters Proximity threshold in meters (default 150m)
 * @returns {Object} Hazard exposure metrics, nearby reports list, and demo exposure index
 */
export function calculateRouteHazards(routeCoordinates, reports = [], thresholdMeters = 150) {
  if (!routeCoordinates || routeCoordinates.length === 0 || !reports || reports.length === 0) {
    return {
      nearbyReports: [],
      criticalCount: 0,
      highCount: 0,
      moderateCount: 0,
      lowCount: 0,
      exposureIndex: 0
    };
  }

  const nearbyReports = [];
  let criticalCount = 0;
  let highCount = 0;
  let moderateCount = 0;
  let lowCount = 0;
  let exposureIndex = 0;

  reports.forEach((report) => {
    // Exclude rejected reports
    if (report.reviewStatus === 'Rejected') return;

    // Check valid coordinates
    if (typeof report.longitude !== 'number' || typeof report.latitude !== 'number') return;

    const distanceMeters = minDistanceToPolyline(report.longitude, report.latitude, routeCoordinates);
    if (distanceMeters <= thresholdMeters) {
      const weight = SEVERITY_WEIGHTS[report.severity] || 1;
      exposureIndex += weight;

      if (report.severity === 'Critical') criticalCount += 1;
      else if (report.severity === 'High') highCount += 1;
      else if (report.severity === 'Moderate') moderateCount += 1;
      else if (report.severity === 'Low') lowCount += 1;

      nearbyReports.push({
        ...report,
        distanceMeters: Math.round(distanceMeters)
      });
    }
  });

  // Sort matched reports by proximity
  nearbyReports.sort((a, b) => a.distanceMeters - b.distanceMeters);

  return {
    nearbyReports,
    criticalCount,
    highCount,
    moderateCount,
    lowCount,
    exposureIndex
  };
}

/**
 * Formats duration in seconds to a human-readable string (e.g. "28 min" or "1 hr 14 min").
 */
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0 min';
  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;
  return remainingMins > 0 ? `${hours} hr ${remainingMins} min` : `${hours} hr`;
}

/**
 * Formats distance in meters to kilometers (e.g. "12.4 km").
 */
export function formatDistance(meters) {
  if (!meters || isNaN(meters)) return '0 km';
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

/**
 * Computes bounding box [[minLng, minLat], [maxLng, maxLat]] for route coordinates
 * with optional origin and destination points.
 */
export function calculateRouteBounds(coordinates, originCoords = null, destCoords = null) {
  const allPoints = [...(coordinates || [])];
  if (originCoords) allPoints.push(originCoords);
  if (destCoords) allPoints.push(destCoords);

  if (allPoints.length === 0) return null;

  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  allPoints.forEach(([lng, lat]) => {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  });

  return [
    [minLng, minLat],
    [maxLng, maxLat]
  ];
}
