'use client';
import React from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Label } from '@/components';
import { DomoicAcidCoordinate, DomoicAcidSample } from '@/utils/data/api/da';
import { useMap } from './useMap';

type DomoicAcidMapProps = {
  samples: DomoicAcidSample[];
  stations: DomoicAcidCoordinate[];
};

export function DomoicAcidMap({ samples, stations }: DomoicAcidMapProps) {
  const { map, loaded, containerRef } = useMap();

  const sampleDates = React.useMemo(
    () =>
      Array.from(new Set(samples.map(({ date }) => date))).sort(
        (a, b) => a.valueOf() - b.valueOf()
      ),
    [samples]
  );
  const rangePDA = React.useMemo(
    () => Array.from(new Set(samples.map(({ pDA }) => pDA))),
    [samples]
  );
  const rangeNormDA = React.useMemo(
    () => Array.from(new Set(samples.map(({ normDA }) => normDA))),
    [samples]
  );
  const [selectedDateIndex, setSelectedDate] = React.useState(0);
  const [variable, setVariable] = React.useState<'pDA' | 'normDA'>('normDA');
  const selectedDate = React.useMemo(
    () => sampleDates[selectedDateIndex],
    [sampleDates, selectedDateIndex]
  );

  React.useEffect(() => {
    if (loaded) {
      const samplesAtDate = samples
        .filter(({ date }) => date.valueOf() === selectedDate.valueOf())
        .map((sample) => ({
          ...sample,
          ...(stations.find(({ stationName }) => stationName === sample.stationName) || {
            longitude: 0,
            latitude: 0,
          }),
        }))
        .map(({ longitude, latitude, stationName, normDA, pDA }) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          properties: {
            stationName,
            normDA,
            pDA,
          },
        }));

      map.current.addSource('da-samples', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: samplesAtDate,
        },
      });
      map.current.addLayer({
        id: 'da-circles',
        type: 'circle',
        source: 'da-samples',
        paint: {
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', variable],
            Math.min(...(variable === 'normDA' ? rangeNormDA : rangePDA)),
            '#2ac780',
            Math.max(...(variable === 'normDA' ? rangeNormDA : rangePDA)),
            '#c70e36',
          ],
          'circle-opacity': 0.75,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', variable],
            Math.min(...(variable === 'normDA' ? rangeNormDA : rangePDA)),
            20,
            Math.max(...(variable === 'normDA' ? rangeNormDA : rangePDA)),
            40,
          ],
        },
      });
      return () => {
        map.current.removeLayer('da-circles');
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.current.removeSource('da-samples');
      };
    }
  }, [map, loaded, samples, stations, selectedDate, rangeNormDA, rangePDA, variable]);
  return (
    <div className="flex flex-col gap-2">
      <div ref={containerRef} className="w-80 h-80 rounded-md" />
      <input
        type="range"
        min={1}
        max={sampleDates.length - 1}
        step={1}
        className="w-full"
        value={selectedDateIndex}
        onChange={(evt) => setSelectedDate(evt.target.valueAsNumber)}
      />
      <Label label={variable}>
        <input
          type="checkbox"
          checked={variable === 'normDA'}
          onChange={() => setVariable((current) => (current === 'normDA' ? 'pDA' : 'normDA'))}
        />
      </Label>
      <p>{selectedDate.toDateString()}</p>
    </div>
  );
}
