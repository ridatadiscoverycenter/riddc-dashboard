import React from 'react';
import maplibregl from 'maplibre-gl';

// Note (AM): This needs to be scoped in MapTiler or hidden with a Secret Manager.
const API_KEY = 'VStCFFYMJAABHpPVId3w';

export function useMap() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = React.useRef<any>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (map.current) return;
    map.current = new maplibregl.Map({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      container: containerRef.current as any,
      style: `https://api.maptiler.com/maps/basic/style.json?key=${API_KEY}`,
      // More things can be set here, but I'll ignore them for now.
      bounds: [
        [-71.5, 41.86],
        [-71.16, 41.42],
      ],
    });
    map.current.scrollZoom.disable();
    map.current.on('load', () => {
      setLoaded(true);
    });
  }, [map, setLoaded]);

  return { containerRef, map, loaded };
}
