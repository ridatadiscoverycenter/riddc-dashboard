'use client';

import React from 'react';
import { compareAsc, formatDate } from 'date-fns';

import { LeftIcon } from '@/components';
import { type StreamGageData } from '@/utils/data';

import { useMap } from '../Maps/useMap';

const COMPONENT_TRANSITION_STYLES = 'transition-[width] duration-500 ease-in-out';
const MAP_SIZE_STYLES = (opened: boolean) =>
  `${COMPONENT_TRANSITION_STYLES} ${opened ? 'md:w-[50%] w-0' : 'w-[100%]'}`;
const GRAPH_SIZE_STYLES = (opened: boolean) =>
  `${COMPONENT_TRANSITION_STYLES} ${opened ? 'md:w-[50%] w-[100%]' : 'w-0'}`;

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
          streamData
            .map(({ values }) => values.map(({ dateTime }) => dateTime.valueOf()).flat())
            .flat()
        )
      )
        .map((dateValue) => new Date(dateValue))
        .sort((a, b) => compareAsc(a, b)),
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
  console.log({ ...dataRange });

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
            '#4f14da',
            max,
            '#99fee8',
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

  return (
    <div className={`flex flex-row w-full text-base items-stretch ${className}`}>
      <div ref={containerRef} className={`relative ${MAP_SIZE_STYLES(opened)}`}>
        <button
          className={`z-50 bg-slate-100 rounded-md absolute right-2 top-2 transform-rotate duration-300 ease-in-out ${opened ? 'rotate-180' : 'rotate-0'}`}
          onClick={() => setOpened((v) => !v)}
        >
          <LeftIcon size={1.5} />
          <span className="sr-only">{opened ? 'Hide Graph' : 'Show Graph'}</span>
        </button>
        <div className="z-50 absolute top-6 left-2 bg-slate-100/90 rounded-md font-light p-2 flex flex-col gap-4 max-w-56">
          <div className="flex flex-col gap-2 w-full">
            <h1 className="text-xl">Stream Gage Height</h1>
            <h2 className="text-lg">{formatDate(selectedDate, "p 'at' P")}</h2>
            <p>
              Use the Date Slider to view hourly Stream Gage data across Rhode Island. Data is
              displayed in feet.
            </p>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <input
              type="range"
              min={0}
              max={dates.length - 1}
              value={selectedDateIndex}
              onChange={(e) => setSelectedDateIndex(Number(e.target.value))}
              className={``}
            />
            <div className="w-full flex flex-row justify-between text-sm">
              <span>Two Weeks Ago</span>
              <span>Today</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <h3 className="text-base">Legend:</h3>
            <div className={`w-full h-4 bg-gradient-to-r from-[#4f14da] to-[#99fee8]`} />
            <div className="w-full flex flex-row justify-between text-sm">
              <span>{dataRange.min} ft.</span>
              <span>{dataRange.max} ft.</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`bg-slate-400 relative ${GRAPH_SIZE_STYLES(opened)}`}>
        <button
          className={`z-50 md:hidden bg-slate-100 rounded-md absolute left-2 top-2 transform-rotate duration-300 ease-in-out ${opened ? 'rotate-180' : 'rotate-0'}`}
          onClick={() => setOpened((v) => !v)}
        >
          <LeftIcon size={1.5} />
          <span className="sr-only">{opened ? 'Hide Graph' : 'Show Graph'}</span>
        </button>
      </div>
    </div>
  );
}
