export interface RouteLocation {
  id: string;
  name: string;
  hindiName?: string;
  coordinates: [number, number]; // [lat, lng]
  altitude?: string;
  dayNumbers: number[];
  description: string;
  type: "start" | "stop" | "sacred_site" | "mountain_pass" | "camp" | "airport";
  badge?: string;
}

export interface RouteSegment {
  id: string;
  title: string;
  fromId: string;
  toId: string;
  dayNumbers: number[];
  mode: "road" | "flight" | "helicopter" | "trek";
  distance?: string;
  path: [number, number][]; // Array of [lat, lng] waypoints
}

export interface PackageRouteData {
  packageSlug: string;
  slugAliases: string[];
  title: string;
  totalDistance?: string;
  maxAltitude?: string;
  locations: RouteLocation[];
  segments: RouteSegment[];
}

/**
 * 100% Dynamic Routing Architecture:
 * No package route is hardcoded here.
 * All package routes, locations, and segments are synthesized dynamically from MongoDB
 * (the `itinerary` array entered/edited via the Admin Dashboard or database).
 */
export const PACKAGE_ROUTES: PackageRouteData[] = [];

/**
 * Always returns null so that PackageRouteMap dynamically generates the route
 * directly from the package's MongoDB itinerary days & cities.
 */
export function findPackageRoute(_slugOrId: string, _title?: string): PackageRouteData | null {
  return null;
}
