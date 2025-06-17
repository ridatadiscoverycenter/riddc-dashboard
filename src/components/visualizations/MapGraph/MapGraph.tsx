'use client';

import React from 'react';
import { compareAsc, formatDate } from 'date-fns';

import { LeftIcon } from '@/components';
import { type StreamGageData } from '@/utils/data';

import { useMap } from '../Maps/useMap';
import { StreamGageTimeSeries } from '../StreamGageTimeSeries';

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

  const [selectedBuoyNames, setSelectedBuoys] = React.useState<string[]>([]);
  const selectedBuoys = React.useMemo(
    () => streamData.filter(({ siteName }) => selectedBuoyNames.includes(siteName)),
    [streamData, selectedBuoyNames]
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

  const selectedStreamDataGeoJson = React.useMemo(
    () => ({
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: streamDataGeoJson.data.features.filter(({ properties }) =>
          selectedBuoyNames.includes(properties.site)
        ),
      },
    }),
    [streamDataGeoJson, selectedBuoyNames]
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

  const setPointer = React.useCallback(() => {
    if (loaded) {
      map.current.getCanvas().style.cursor = 'pointer';
    }
  }, [loaded, map]);

  const unsetPointer = React.useCallback(() => {
    if (loaded) {
      map.current.getCanvas().style.cursor = '';
    }
  }, [loaded, map]);

  const circleClickHandler = React.useCallback(
    (event: any) => {
      if (loaded) {
        const features = event['features'] as { properties: { site: string } }[];
        if (features && features.length > 0) {
          const site = features[0]['properties']['site'];
          setSelectedBuoys((currentNames) => {
            if (currentNames.includes(site))
              return currentNames.filter((siteName) => siteName !== site);
            return [...currentNames, site];
          });
          // On small screen sizes, the automatic slide in looks bad. So, this is commented out for now.
          // Ideally, it would only slide open *if* you're on a MD screen or bigger.
          // if (!opened) setOpened(true);
        }
      }
    },
    [loaded, setSelectedBuoys /*, opened, setOpened*/]
  );

  React.useEffect(() => {
    if (loaded) {
      const { min, mid, max } = dataRange;
      selectedStreamDataGeoJson;
      map.current.addSource('stream-data', streamDataGeoJson);
      map.current.addSource('selected-stream-data', selectedStreamDataGeoJson);
      // Pink border around selected gages
      map.current.addLayer({
        id: 'stream-gage-selected',
        type: 'circle',
        source: 'selected-stream-data',
        paint: {
          'circle-stroke-color': '#FF1DCE',
          'circle-stroke-width': 3,
          'circle-radius': ['interpolate', ['linear'], ['get', 'value'], min, 12, mid, 27, max, 42],
          'circle-opacity': 0,
        },
        filter: ['==', 'date', selectedDateIndex],
      });
      // Circle to indicate stream gage height
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
          'circle-radius': ['interpolate', ['linear'], ['get', 'value'], min, 10, mid, 25, max, 40],
          'circle-opacity': 0.75,
        },
        filter: ['==', 'date', selectedDateIndex],
      });
      // Identifier text for each gage
      map.current.addLayer({
        id: 'stream-gage-ids',
        type: 'symbol',
        source: 'stream-data',
        layout: {
          'text-field': ['get', 'site'],
          'text-size': 11,
        },
        filter: ['==', 'date', selectedDateIndex],
      });

      map.current.on('mouseenter', 'stream-gage-circles', setPointer);
      map.current.on('mouseleave', 'stream-gage-circles', unsetPointer);
      map.current.on('click', 'stream-gage-circles', circleClickHandler);

      return () => {
        map.current.off('mouseenter', 'stream-gage-circles', setPointer);
        map.current.off('mouseleave', 'stream-gage-circles', unsetPointer);
        map.current.off('click', 'stream-gage-circles', circleClickHandler);

        map.current.removeLayer('stream-gage-circles');
        map.current.removeLayer('stream-gage-ids');
        map.current.removeLayer('stream-gage-selected');
        map.current.removeSource('selected-stream-data');
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.current.removeSource('stream-data');
      };
    }
  }, [
    map,
    loaded,
    streamDataGeoJson,
    dataRange,
    streamData,
    selectedDateIndex,
    setSelectedBuoys,
    setPointer,
    unsetPointer,
    circleClickHandler,
    selectedStreamDataGeoJson,
  ]);

  return (
    <div className={`flex flex-row w-full text-base items-stretch ${className}`}>
      <div ref={containerRef} className={`relative ${MAP_SIZE_STYLES(opened)}`}>
        <button
          className={`z-50 bg-slate-100 rounded-md absolute right-2 top-2 transform-rotate duration-500 ease-in-out ${opened ? 'rotate-180' : 'rotate-0'}`}
          onClick={() => setOpened((v) => !v)}
        >
          <LeftIcon size={1.5} />
          <span className="sr-only">{opened ? 'Hide Graph' : 'Show Graph'}</span>
        </button>
        <div
          className={`z-50 absolute top-6 left-2 bg-slate-100/90 dark:bg-slate-800/90 rounded-md font-light p-2 flex flex-col gap-4 max-w-56 ${opened ? 'translate-x-[-24rem] md:translate-x-0 transition-transform duration-500' : ''}`}
        >
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
              <span>{dataRange.min.toFixed(2)} ft.</span>
              <span>{dataRange.max.toFixed(2)} ft.</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`bg-white dark:bg-black relative ${GRAPH_SIZE_STYLES(opened)}`}>
        <button
          className={`z-50 md:hidden bg-slate-100 rounded-md absolute left-2 top-2 transform-rotate duration-300 ease-in-out ${opened ? 'rotate-180' : 'rotate-0'}`}
          onClick={() => setOpened((v) => !v)}
        >
          <LeftIcon size={1.5} />
          <span className="sr-only">{opened ? 'Hide Graph' : 'Show Graph'}</span>
        </button>
        <StreamGageTimeSeries dates={dates} data={selectedBuoys} />
      </div>
    </div>
  );
}
