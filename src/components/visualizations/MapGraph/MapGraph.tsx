'use client';

import React from 'react';
import { LeftIcon } from '@/components';

import { type StreamGageData } from '@/utils/data';

import { useMap } from '../Maps/useMap';

const COMPONENT_TRANSITION_STYLES = 'transition-[width] duration-500 ease-in-out';
const MAP_SIZE_STYLES = (opened: boolean) =>
  `${COMPONENT_TRANSITION_STYLES} ${opened ? 'md:w-[50%] w-0' : 'w-full'}`;
const GRAPH_SIZE_STYLES = (opened: boolean) =>
  `${COMPONENT_TRANSITION_STYLES} ${opened ? 'md:w-[50%] w-full' : 'w-0'}`;

export function MapGraph({
  streamData,
  className = '',
}: {
  streamData: StreamGageData[];
  className?: string;
}) {
  const dates = React.useMemo(
    () =>
      Array.from(
        new Set(
          streamData.map(({ values }) => values.map(({ dateTime }) => dateTime).flat()).flat()
        )
      ).sort((a, b) => b.valueOf() - a.valueOf()),
    [streamData]
  );
  const values = React.useMemo(
    () =>
      Array.from(
        new Set(streamData.map(({ values }) => values.map(({ value }) => value).flat()).flat())
      ),
    [streamData]
  );
  const { map, loaded, containerRef } = useMap();
  const [opened, setOpened] = React.useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = React.useState(0);
  const selectedDate = React.useMemo(() => dates[selectedDateIndex], [dates, selectedDateIndex]);
  const flattenedStreamData = React.useMemo(
    () =>
      streamData
        .map(({ values, ...rest }) =>
          values
            .map(({ value, dateTime }) => ({ value, dateTime: dateTime.valueOf(), ...rest }))
            .flat()
        )
        .flat(),
    [streamData]
  );

  const streamDataGeoJson = React.useMemo(
    () => ({
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: flattenedStreamData.map(
          ({ longitude, latitude, siteName, variableName, value, dateTime }) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            properties: {
              site: siteName,
              variable: variableName,
              value,
              dateTime,
              date: dates.findIndex((v) => v.valueOf() === dateTime.valueOf()),
            },
          })
        ),
      },
    }),
    [flattenedStreamData, dates]
  );

  const dataRange = React.useMemo(() => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    return {
      min,
      mid: (min + max) / 2,
      max,
    };
  }, [values]);

  React.useEffect(() => {
    if (loaded) {
      const { min, mid, max } = dataRange;
      map.current.addSource('stream-data', streamDataGeoJson);
      map.current.addLayer({
        id: 'stream-gage-circles',
        type: 'circle',
        source: 'stream-data',
        paint: {
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'value'],
            min,
            '#00c951',
            mid,
            '#fd9a00',
            max * 0.66,
            '#c287bc',
          ],
          'circle-opacity': 0.75,
          'circle-radius': ['interpolate', ['linear'], ['get', 'value'], min, 10, mid, 25, max, 40],
        },
      });

      return () => {
        map.current.removeLayer('stream-gage-circles');
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.current.removeSource('stream-data');
      };
    }
  }, [map, loaded, streamDataGeoJson, dataRange]);

  React.useEffect(() => {
    if (loaded) {
      map.current.setFilter('stream-gage-circles', ['==', 'date', selectedDateIndex]);
    }
  }, [selectedDateIndex, loaded, map]);

  console.log({ selectedDate});

  return (
    <>
      <div className={`flex flex-row w-full items-stretch ${className}`}>
        <div ref={containerRef} className={`relative ${MAP_SIZE_STYLES(opened)}`}>
          <button
            className={`z-50 bg-slate-100 rounded-md absolute right-2 top-2 transform-rotate duration-300 ease-in-out ${opened ? 'rotate-180' : 'rotate-0'}`}
            onClick={() => setOpened((v) => !v)}
          >
            <LeftIcon size={1.5} />
            <span className="sr-only">See Graph</span>
          </button>
          <input
            type="range"
            min={0}
            max={dates.length - 1}
            value={selectedDateIndex}
            onChange={(e) => setSelectedDateIndex(Number(e.target.value))}
            className="z-50 absolute bottom-2 left-4"
          />
        </div>
        <div className={`bg-amber-300 relative ${GRAPH_SIZE_STYLES(opened)}`}>Graph</div>
      </div>
    </>
  );
}
