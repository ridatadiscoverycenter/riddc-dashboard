import React from 'react';
import maplibregl from 'maplibre-gl';
import { fetchMapTilerSecret } from '@/utils/fns/fetchMapTilerSecret';

export function useMap() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = React.useRef<any>(null);
  const [loaded, setLoaded] = React.useState(false);
  const [apiKey, setApiKey] = React.useState('');

  React.useEffect(() => {
    async function getApiKey() {
      const apiKey = await fetchMapTilerSecret();
      setApiKey(apiKey);
    }
    getApiKey();
  }, []);

  React.useEffect(() => {
    const API_KEY = apiKey;
    if (map.current) return;
    if (API_KEY == '') return;
    if (!API_KEY) {
      console.error('missing Maptiler API key');
      return;
    }
    map.current = new maplibregl.Map({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      container: containerRef.current as any,
      style: `https://api.maptiler.com/maps/basic/style.json?key=${API_KEY}`,
      // More things can be set here, but I'll ignore them for now.
      // TODO: flexible bounds to work with fish trawl locations? Or just expand?
      bounds: [
        [-71.5, 41.92],
        [-71.16, 41.32],
      ],
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
  }, [map, setLoaded, apiKey]);

  return { containerRef, map, loaded };
}
