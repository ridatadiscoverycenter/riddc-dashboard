import React from 'react';
import maplibregl from 'maplibre-gl';

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
      style: `https://api.maptiler.com/maps/backdrop/style.json?key=${API_KEY}`,
      // More things can be set here, but I'll ignore them for now.
      center: [-71.4128, 41.584],
      zoom: 6.5,
      minZoom: 7,
    });
    map.current.on('load', () => {
      setLoaded(true);
    });
  }, [map, setLoaded]);

  return { containerRef, map, loaded };
}
