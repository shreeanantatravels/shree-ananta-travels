import { NextResponse } from 'next/server';
import { VERIFIED_DESTINATIONS } from '@/src/website/app/data/geoCities';

// In-memory cache to ensure instant (0 ms) repeat responses
const suggestCache = new Map<string, any[]>();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').trim();

    if (!query || query.length < 1) {
      return NextResponse.json({ success: true, data: [] });
    }

    const cleanKey = query.toLowerCase();

    // 1. Check in-memory cache
    if (suggestCache.has(cleanKey)) {
      return NextResponse.json({
        success: true,
        source: 'cache',
        data: suggestCache.get(cleanKey),
      });
    }

    const resultsMap = new Map<string, any>();

    // 2. Search Local Verified Destinations (Top Priority)
    const localEntries = Object.values(VERIFIED_DESTINATIONS);
    for (const point of localEntries) {
      const name = point.name.toLowerCase();
      const state = (point.state || '').toLowerCase();
      const aliases = (point.aliases || []).map(a => a.toLowerCase());

      const isMatch =
        name.startsWith(cleanKey) ||
        name.includes(cleanKey) ||
        aliases.some(a => a.startsWith(cleanKey) || a.includes(cleanKey)) ||
        state.startsWith(cleanKey);

      if (isMatch) {
        const key = `${point.name.toLowerCase()}_${point.state || ''}`.trim();
        resultsMap.set(key, {
          name: point.name,
          state: point.state || '',
          country: point.country || 'India',
          lat: point.lat,
          lng: point.lng,
          isVerified: true,
          source: 'verified_registry',
        });
      }
    }

    // 3. Query External Photon OpenStreetMap Autocomplete API
    // (Biased to India lat=22, lon=79, covers EVERY town, village, city on Earth)
    try {
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=22&lon=79&limit=10`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(photonUrl, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'ShreeAnantaTravels-Autocomplete/1.0',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json?.features && Array.isArray(json.features)) {
          for (const feature of json.features) {
            const props = feature.properties || {};
            const coords = feature.geometry?.coordinates;
            const cityName = props.name;

            if (cityName && coords && coords.length >= 2) {
              const state = props.state || props.county || '';
              const country = props.country || '';
              const key = `${cityName.toLowerCase()}_${state.toLowerCase()}`.trim();

              if (!resultsMap.has(key)) {
                resultsMap.set(key, {
                  name: cityName,
                  state: state,
                  country: country,
                  lat: coords[1],
                  lng: coords[0],
                  isVerified: true,
                  source: 'external_gps',
                });
              }
            }
          }
        }
      }
    } catch {
      // Fallback: If Photon times out, try Nominatim
      try {
        const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=6`;
        const nomController = new AbortController();
        const nomTimeout = setTimeout(() => nomController.abort(), 2000);

        const nomRes = await fetch(nomUrl, {
          headers: {
            'User-Agent': 'ShreeAnantaTravels-Autocomplete/1.0 (info@shreeanantatravels.com)',
            'Accept-Language': 'en',
          },
          signal: nomController.signal,
        });
        clearTimeout(nomTimeout);

        if (nomRes.ok) {
          const list = await nomRes.json();
          if (Array.isArray(list)) {
            for (const item of list) {
              const parts = (item.display_name || '').split(',');
              const cityName = parts[0]?.trim() || item.name;
              const state = item.address?.state || item.address?.region || '';
              const country = item.address?.country || '';
              const lat = parseFloat(item.lat);
              const lng = parseFloat(item.lon);

              if (cityName && !isNaN(lat) && !isNaN(lng)) {
                const key = `${cityName.toLowerCase()}_${state.toLowerCase()}`.trim();
                if (!resultsMap.has(key)) {
                  resultsMap.set(key, {
                    name: cityName,
                    state: state,
                    country: country,
                    lat,
                    lng,
                    isVerified: true,
                    source: 'nominatim_gps',
                  });
                }
              }
            }
          }
        }
      } catch {
        // graceful fallback to local results
      }
    }

    const data = Array.from(resultsMap.values()).slice(0, 10);

    // Cache if results exist
    if (data.length > 0) {
      suggestCache.set(cleanKey, data);
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message || 'Failed to fetch suggestions',
      data: [],
    });
  }
}
