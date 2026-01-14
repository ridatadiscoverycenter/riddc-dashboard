'use client';

import React from 'react';
import { compareAsc, formatDate } from 'date-fns';

import { MapGraph, Select } from '@/components';
import { variableToLabel, type StreamGageData } from '@/utils/data';
import { RI_BUOY_VARIABLES, RiBuoyVariable } from '@/utils/data/api/buoy';
import { BuoyTimeSeries } from './BuoyTimeSeries';

//import { StreamGageTimeSeries } from '../StreamGageTimeSeries';

export function BuoyMap({
  streamData,
  className = '',
}: {
  streamData: StreamGageData[];
  className?: string;
}) {
  const [selectedVariable, setSelectedVariable] = React.useState<{
    label: RiBuoyVariable;
    value: RiBuoyVariable;
  }>({ label: RI_BUOY_VARIABLES[0], value: RI_BUOY_VARIABLES[0] });
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

  const filteredData = React.useMemo(
    () => streamData.filter(({ variableName }) => variableName === selectedVariable.value),
    [streamData, selectedVariable]
  );

  const values = React.useMemo(
    () =>
      Array.from(
        new Set(filteredData.map(({ values }) => values.map(({ value }) => value).flat()).flat())
      ),
    [filteredData]
  );

  const [selectedBuoyNames, setSelectedBuoys] = React.useState<string[]>([]);
  const selectedBuoys = React.useMemo(
    () =>
      streamData.filter(
        ({ siteName, variableName }) =>
          selectedBuoyNames.includes(siteName) && variableName === selectedVariable.value
      ),
    [streamData, selectedBuoyNames, selectedVariable.value]
  );
  const [selectedDateIndex, setSelectedDateIndex] = React.useState(0);
  const selectedDate = React.useMemo(() => dates[selectedDateIndex], [dates, selectedDateIndex]);
  const flattenedStreamData = React.useMemo(
    () =>
      filteredData
        .map(({ values, ...rest }) =>
          values
            .map(({ value, dateTime }) => ({ value, dateTime: dateTime.valueOf(), ...rest }))
            .flat()
        )
        .flat(),
    [filteredData]
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

  const onLoad = React.useCallback<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (map: React.MutableRefObject<any>, loaded: boolean) => () => void
  >(
    (map, loaded) => {
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

      function doSetPointer() {
        return setPointer(map, loaded);
      }

      function doUnsetPointer() {
        return unsetPointer(map, loaded);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function doHandleCircleClick(event: any) {
        return circleClickHandler(event, loaded, setSelectedBuoys);
      }

      map.current.on('mouseenter', 'stream-gage-circles', doSetPointer);
      map.current.on('mouseleave', 'stream-gage-circles', doUnsetPointer);
      map.current.on('click', 'stream-gage-circles', doHandleCircleClick);

      return () => {
        map.current.off('mouseenter', 'stream-gage-circles', doSetPointer);
        map.current.off('mouseleave', 'stream-gage-circles', doUnsetPointer);
        map.current.off('click', 'stream-gage-circles', doHandleCircleClick);

        map.current.removeLayer('stream-gage-circles');
        map.current.removeLayer('stream-gage-ids');
        map.current.removeLayer('stream-gage-selected');
        map.current.removeSource('selected-stream-data');
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.current.removeSource('stream-data');
      };
    },
    [streamDataGeoJson, dataRange, selectedDateIndex, setSelectedBuoys, selectedStreamDataGeoJson]
  );

  const [opened, setOpen] = React.useState(false);

  return (
    <MapGraph
      onLoad={onLoad}
      graph={<BuoyTimeSeries dates={dates} data={selectedBuoys} />}
      syncOpenState={(isMapOpen) => setOpen(isMapOpen)}
      className={className}
    >
      <div
        className={`z-50 absolute top-6 left-2 bg-slate-100/90 dark:bg-slate-800/90 rounded-md font-light p-2 flex flex-col gap-4 max-w-56 ${opened ? 'translate-x-[-24rem] md:translate-x-0 transition-transform duration-500' : ''}`}
      >
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-xl">RI Buoy Data</h1>
          <h2 className="text-lg">{formatDate(selectedDate, 'P')}</h2>
          <p>Use the Date Slider to view averaged monthly buoy data across Rhode Island.</p>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <input
            type="range"
            min={0}
            max={dates.length - 1}
            value={selectedDateIndex}
            onChange={(e) => setSelectedDateIndex(Number(e.target.value))}
          />
          <Select
            label="Variable"
            options={RI_BUOY_VARIABLES.map((value) => ({ label: value, value }))}
            value={selectedVariable}
            defaultValue={{ label: RI_BUOY_VARIABLES[0], value: RI_BUOY_VARIABLES[0] }}
            onChange={(newValue) => {
              setSelectedVariable(newValue as { value: RiBuoyVariable; label: RiBuoyVariable });
            }}
          />
          <div className="w-full flex flex-row justify-between text-sm">
            <span>{formatDate(dates[0], 'P')}</span>
            <span>{formatDate(dates[dates.length - 1], 'P')}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h3 className="text-base">Legend:</h3>
          <div className={`w-full h-4 bg-gradient-to-r from-[#4f14da] to-[#99fee8]`} />
          <div className="w-full flex flex-row justify-between text-sm">
            <span>{dataRange.min.toFixed(2)}</span>
            <span>{dataRange.max.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </MapGraph>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setPointer(map: React.MutableRefObject<any>, loaded: boolean) {
  if (loaded) {
    map.current.getCanvas().style.cursor = 'pointer';
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unsetPointer(map: React.MutableRefObject<any>, loaded: boolean) {
  if (loaded) {
    map.current.getCanvas().style.cursor = '';
  }
}

function circleClickHandler(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any,
  loaded: boolean,
  setSelectedBuoys: React.Dispatch<React.SetStateAction<string[]>>
) {
  if (loaded) {
    const features = event['features'] as { properties: { site: string } }[];
    if (features && features.length > 0) {
      console.log(features);
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
}
