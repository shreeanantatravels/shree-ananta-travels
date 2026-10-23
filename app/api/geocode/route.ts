import { NextResponse } from 'next/server';
import { VERIFIED_DESTINATIONS, lookupCityCoordinates } from '@/src/website/app/data/geoCities';

// In-memory cache to prevent repeated external API hits
const serverGeocodeCache: Record<string, { lat: number; lng: number; name: string; state?: string; country?: string }> = {};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || '';

    if (!query) {
      return NextResponse.json({ success: false, message: 'Query string "q" is required' }, { status: 400 });
    }

    const cleanKey = query.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();

    // 1. Check local verified dictionary (0 ms instant response)
    const localMatch = lookupCityCoordinates(cleanKey);
    if (localMatch) {
      return NextResponse.json({
        success: true,
        source: 'local_registry',
        data: localMatch,
      });
    }

    // 2. Check in-memory server cache
    if (serverGeocodeCache[cleanKey]) {
      return NextResponse.json({
        success: true,
        source: 'cache',
        data: serverGeocodeCache[cleanKey],
      });
    }

    // 3. Fallback: Live OpenStreetMap (OSM) Nominatim Global Geocoding API
    // Covers every city, town, village, temple, and tourist point on Earth
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&addressdetails=1&limit=1`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const osmRes = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'ShreeAnantaTravels-Geocoding/1.0 (info@shreeanantatravels.com)',
        'Accept-Language': 'en',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (osmRes.ok) {
      const results = await osmRes.json();
      if (Array.isArray(results) && results.length > 0) {
        const first = results[0];
        const lat = parseFloat(first.lat);
        const lng = parseFloat(first.lon);

        if (!isNaN(lat) && !isNaN(lng)) {
          const parts = (first.display_name || '').split(',');
          const displayName = parts[0]?.trim() || query;
          const state = first.address?.state || first.address?.region || '';
          const country = first.address?.country || '';

          const geoData = {
            lat,
            lng,
            name: displayName,
            state: state,
            country: country,
          };

          serverGeocodeCache[cleanKey] = geoData;

          return NextResponse.json({
            success: true,
            source: 'live_osm_global',
            data: geoData,
          });
        }
      }
    }

    return NextResponse.json({
      success: false,
      message: `Could not resolve coordinates for "${query}".`,
    }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Geocoding request failed.',
    }, { status: 500 });
  }
}
