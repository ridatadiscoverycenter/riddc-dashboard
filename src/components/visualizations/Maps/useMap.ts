import React from 'react';
import maplibregl, { type LngLatBoundsLike } from 'maplibre-gl';

const BOUNDS: LngLatBoundsLike = [
  [-71.5, 41.92],
  [-71.16, 41.32],
];

export function useMap(bounds: LngLatBoundsLike = BOUNDS) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = React.useRef<any>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (map.current) return;
    map.current = new maplibregl.Map({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      container: containerRef.current as any,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      // More things can be set here, but I'll ignore them for now.
      bounds: bounds,
      center: [-71.4128, 41.584],
      zoom: 8.5,
      maxZoom: 11,
      minZoom: 8,
    });
    function setLoadedOnMapLoad() {
      setLoaded(true);
    }
    map.current.on('load', setLoadedOnMapLoad);
    return () => {
      map.current.off('load', setLoadedOnMapLoad);
    };
  }, [map, setLoaded, bounds]);

  return { containerRef, map, loaded };
}
