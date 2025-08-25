'use client';

//TO_REVIEW: I need to figure out how to make the selected variable update the map

import React from 'react';
import { compareAsc, formatDate, roundToNearestHours } from 'date-fns';

import { Loading, MapGraph } from '@/components';
import { type BreatheSensorData } from '@/utils/data/api/breathe-pvd';
import { sensorInfo } from '@/assets/sensorInfo';
import { pmInfo } from '@/assets/pmInfo';

// import { StreamGageTimeSeries } from '../StreamGageTimeSeries';

export function BreatheMapGraph({
  breatheData,
  className = '',
}: {
  breatheData: BreatheSensorData[];
  className?: string;
}) {
  const dates = React.useMemo(
    () => breatheData.map(({ time }) => roundToNearestHours(time)).sort((a, b) => compareAsc(a, b)),
    [breatheData]
  );
  const [selectedVariable, setSelectedVariable] = React.useState('co');

  const values = React.useMemo(
    () => Array.from(new Set(breatheData.map((a) => (a as Record<string, any>)[selectedVariable]))),
    [breatheData, selectedVariable]
  );

  const [selectedSensorNames, setSelectedSensors] = React.useState<string[]>([]);
  const selectedSensors = React.useMemo(
    () => breatheData.filter(({ sensorName }) => selectedSensorNames.includes(sensorName)),
    [breatheData, selectedSensorNames]
  );
  const [selectedDateIndex, setSelectedDateIndex] = React.useState(0);
  const selectedDate = React.useMemo(() => dates[selectedDateIndex], [dates, selectedDateIndex]);

  const breatheGeoJson = React.useMemo(
    () => ({
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: breatheData.map(({ node, sensorName, latitude, longitude, co, co2, time }) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          properties: {
            site: sensorName,
            node,
            variable: 'co', // TODO: this needs to get choice of variable!
            co,
            co2,
            dateTime: time,
            date: dates.findIndex((v) => v.valueOf() === roundToNearestHours(time).valueOf()),
          },
        })),
      },
    }),
    [breatheData, dates]
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
      map.current.addSource('breathe-data', breatheGeoJson);
      map.current.addLayer({
        id: 'co-circles',
        type: 'circle',
        source: 'breathe-data',
        layout: {
          visibility: selectedVariable === 'co' ? 'visible' : 'none',
        },
        paint: {
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'co'],
            min,
            '#4f14da',
            max,
            '#99fee8',
          ],
          'circle-radius': ['interpolate', ['linear'], ['get', 'co'], min, 5, mid, 12, max, 20],
          'circle-opacity': 0.75,
        },
        filter: ['all', ['==', 'date', selectedDateIndex], ['>=', 'co', 0]],
      });
      map.current.addLayer({
        id: 'co2-circles',
        type: 'circle',
        source: 'breathe-data',
        layout: {
          visibility: selectedVariable === 'co2' ? 'visible' : 'none',
        },
        paint: {
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'co2'],
            min,
            '#4f14da',
            max,
            '#99fee8',
          ],
          'circle-radius': ['interpolate', ['linear'], ['get', 'co2'], min, 5, mid, 12, max, 20],
          'circle-opacity': 0.75,
        },
        filter: ['all', ['==', 'date', selectedDateIndex], ['>=', 'co2', 0]], // TODO: I currently only have nulls, have to test with non-null
      });

      //   Identifier text for each gage

      map.current.addLayer({
        id: 'sensor-ids',
        type: 'symbol',
        source: 'breathe-data',
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
        return circleClickHandler(event, loaded, setSelectedSensors);
      }

      map.current.on('mouseenter', 'co-circles', doSetPointer);
      map.current.on('mouseleave', 'co-circles', doUnsetPointer);
      map.current.on('click', 'co-circles', doHandleCircleClick);

      return () => {
        map.current.off('mouseenter', 'co-circles', doSetPointer);
        map.current.off('mouseleave', 'co-circles', doUnsetPointer);
        map.current.off('click', 'co-circles', doHandleCircleClick);

        map.current.removeLayer('co-circles');
        map.current.removeLayer('co2-circles');
        map.current.removeLayer('sensor-ids');
        // map.current.removeLayer('breath-selected');
        // map.current.removeSource('selected-breath-data');
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.current.removeSource('breathe-data');
      };
    },
    [
      breatheGeoJson,
      dataRange,
      selectedDateIndex,
      selectedVariable,
      //   selectedBreatheDataGeoJson,
    ]
  );
  const [opened, setOpen] = React.useState(false);

  return (
    <MapGraph
      onLoad={onLoad}
      graph={<Loading />}
      //   selectedVariable={selectedVariable}
      syncOpenState={(isMapOpen) => setOpen(isMapOpen)}
      className="h-screen"
    >
      <div
        className={`h-screen z-50 absolute top-6 left-2 bg-slate-100/90 dark:bg-slate-800/90 rounded-md font-light p-2 flex flex-col gap-4 max-w-56 ${opened ? 'translate-x-[-24rem] md:translate-x-0 transition-transform duration-500' : ''}`}
      >
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-xl">Air Quality</h1>
          <input type="radio" id="co" name="variable" onClick={() => setSelectedVariable('co')} />
          <input type="radio" id="co2" name="variable" onClick={() => setSelectedVariable('co2')} />
          <p>{selectedVariable}</p>
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
          />
          <div className="w-full flex flex-row justify-between text-sm">
            <span>{dates[0].toLocaleDateString()}</span>
            <span>{selectedDateIndex}</span>
            <span>Today</span>
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
