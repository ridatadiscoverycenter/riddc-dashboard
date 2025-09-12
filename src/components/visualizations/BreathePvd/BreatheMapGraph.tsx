'use client';

import React from 'react';
import { eachHourOfInterval, formatDate, roundToNearestHours } from 'date-fns';

import { MapGraph } from '@/components';
import {
  BREATHE_SENSOR_VIEWER_VARS,
  type BreatheSensorData,
  type BreatheSensorViewerVars,
  BREATHE_PM_VIEWER_VARS,
  type BreathePmData,
  BreathePmViewerVars,
} from '@/utils/data/api/breathe-pvd';
import { BreatheTimeSeries } from './BreatheTimeSeries';
import { FormattedVar } from './FormattedVar';

type CombinedData = BreatheSensorData & BreathePmData;

type Vars = BreatheSensorViewerVars | BreathePmViewerVars;

export function BreatheMapGraph({
  breatheSensorData,
  breathePmData,
  className = '',
}: {
  breatheSensorData: BreatheSensorData[];
  breathePmData: BreathePmData[];
  className?: string;
}) {
  const dates = React.useMemo(
    () =>
      eachHourOfInterval({
        start: breatheSensorData[0].time,
        end: breatheSensorData[breatheSensorData.length - 1].time,
      }),
    [breatheSensorData]
  );

  const [selectedVariable, setSelectedVariable] = React.useState<Vars>('co');
  const values = React.useMemo(
    () =>
      Array.from(
        new Set(
          ([...breatheSensorData, ...breathePmData] as CombinedData[])
            .filter((e) => selectedVariable in e && e[selectedVariable] !== null)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((a) => (a as Record<string, any>)[selectedVariable])
        )
      ),
    [breatheSensorData, breathePmData, selectedVariable]
  );

  const [selectedSensorNames, setSelectedSensors] = React.useState<string[]>([]);
  const selectedSensors = React.useMemo(
    () =>
      [...breatheSensorData, ...breathePmData].filter(
        ({ sensorName, ...rest }) =>
          selectedSensorNames.includes(sensorName) && Object.keys(rest).includes(selectedVariable)
      ) as (BreatheSensorData & BreathePmData)[],
    [breatheSensorData, breathePmData, selectedSensorNames, selectedVariable]
  );
  const [selectedDateIndex, setSelectedDateIndex] = React.useState(0);
  const selectedDate = React.useMemo(() => dates[selectedDateIndex], [dates, selectedDateIndex]);

  function clickHandler(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    const newValue = e.currentTarget.value as Vars;
    setSelectedVariable(newValue);
    setSelectedSensors(
      Array.from(
        new Set(
          selectedSensors.filter((sensor) => newValue in sensor).map(({ sensorName }) => sensorName)
        )
      )
    );
  }

  const coGeoJson = React.useMemo(
    () => createGeoJson(breatheSensorData, 'co', dates),
    [breatheSensorData, dates]
  );
  const co2GeoJson = React.useMemo(
    () => createGeoJson(breatheSensorData, 'co2', dates),
    [breatheSensorData, dates]
  );
  const pm1GeoJson = React.useMemo(
    () => createGeoJson(breathePmData, 'pm1', dates),
    [breathePmData, dates]
  );
  const pm10GeoJson = React.useMemo(
    () => createGeoJson(breathePmData, 'pm10', dates),
    [breathePmData, dates]
  );
  const pm25GeoJson = React.useMemo(
    () => createGeoJson(breathePmData, 'pm25', dates),
    [breathePmData, dates]
  );

  const selectedBreatheGeoJson = React.useMemo(
    () => ({
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          ...coGeoJson.data.features.filter(({ properties }) =>
            selectedSensorNames.includes(properties.site)
          ),
          ...co2GeoJson.data.features.filter(({ properties }) =>
            selectedSensorNames.includes(properties.site)
          ),
        ],
      },
    }),
    [coGeoJson, co2GeoJson, selectedSensorNames]
  );
  const selectedPmGeoJson = React.useMemo(
    () => ({
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          ...pm1GeoJson.data.features.filter(({ properties }) =>
            selectedSensorNames.includes(properties.site)
          ),
          ...pm10GeoJson.data.features.filter(({ properties }) =>
            selectedSensorNames.includes(properties.site)
          ),
          ...pm25GeoJson.data.features.filter(({ properties }) =>
            selectedSensorNames.includes(properties.site)
          ),
        ],
      },
    }),
    [pm1GeoJson, pm10GeoJson, pm25GeoJson, selectedSensorNames]
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
      map.current.addSource('co-data', coGeoJson);
      map.current.addSource('co2-data', co2GeoJson);
      map.current.addSource('pm1-data', pm1GeoJson);
      map.current.addSource('pm10-data', pm10GeoJson);
      map.current.addSource('pm25-data', pm25GeoJson);
      map.current.addSource('selected-breathe-data', selectedBreatheGeoJson);
      map.current.addSource('selected-pm-data', selectedPmGeoJson);
      // Pink border around selected gages
      // TODO we basically need one of these for each var
      map.current.addLayer({
        id: 'breathe-selected',
        type: 'circle',
        source: 'selected-breathe-data',
        paint: {
          'circle-stroke-color': '#FF1DCE',
          'circle-stroke-width': 3,
          'circle-radius': ['interpolate', ['linear'], ['get', 'v'], min, 6, mid, 13, max, 21],
          'circle-opacity': 0,
        },
        filter: ['all', ['==', 'date', selectedDateIndex], ['==', 'variable', selectedVariable]],
      });
      map.current.addLayer({
        id: 'pm-selected',
        type: 'circle',
        source: 'selected-pm-data',
        paint: {
          'circle-stroke-color': '#FF1DCE',
          'circle-stroke-width': 3,
          'circle-radius': ['interpolate', ['linear'], ['get', 'v'], min, 6, mid, 13, max, 21],
          'circle-opacity': 0,
        },
        filter: ['all', ['==', 'date', selectedDateIndex], ['==', 'variable', selectedVariable]],
      });
      map.current.addLayer({
        id: 'circles',
        type: 'circle',
        source: `${selectedVariable}-data`,
        paint: {
          'circle-color': ['interpolate', ['linear'], ['get', 'v'], min, '#8e44ad', max, '#c0392b'],
          'circle-radius': ['interpolate', ['linear'], ['get', 'v'], min, 5, mid, 12, max, 20],
          'circle-opacity': 0.75,
        },
        // layout: { visibility: selectedVariable === 'co' ? 'visible' : 'none' },
        filter: ['all', ['==', 'date', selectedDateIndex]],
      });

      //   Identifier text for each gage

      map.current.addLayer({
        id: 'sensor-ids',
        type: 'symbol',
        source: `${selectedVariable}-data`,
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
      map.current.on('mouseenter', 'circles', doSetPointer);
      map.current.on('mouseleave', 'circles', doUnsetPointer);
      map.current.on('click', 'circles', doHandleCircleClick);

      return () => {
        map.current.off('mouseenter', 'circles', doSetPointer);
        map.current.off('mouseleave', 'circles', doUnsetPointer);
        map.current.off('click', 'circles', doHandleCircleClick);

        map.current.removeLayer('circles');
        map.current.removeLayer('sensor-ids');
        map.current.removeLayer('breathe-selected');
        map.current.removeLayer('pm-selected');
        map.current.removeSource('selected-breathe-data');
        map.current.removeSource('selected-pm-data');
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.current.removeSource('pm1-data');
        map.current.removeSource('pm10-data');
        map.current.removeSource('pm25-data');
        map.current.removeSource('co-data');
        map.current.removeSource('co2-data');
      };
    },
    [
      coGeoJson,
      co2GeoJson,
      dataRange,
      selectedDateIndex,
      selectedVariable,
      selectedBreatheGeoJson,
      selectedPmGeoJson,
      pm1GeoJson,
      pm10GeoJson,
      pm25GeoJson,
    ]
  );
  const [opened, setOpen] = React.useState(false);

  return (
    <MapGraph
      onLoad={onLoad}
      graph={
        <BreatheTimeSeries
          data={selectedSensors}
          names={selectedSensorNames}
          variable={selectedVariable}
        />
      }
      syncOpenState={(isMapOpen) => setOpen(isMapOpen)}
      className={className}
      bounds={[
        [-71.5, 41.92],
        [-71.32, 41.6],
      ]}
    >
      <div
        className={`z-50 absolute top-6 left-2 bg-slate-100/90 dark:bg-slate-800/90 rounded-md font-light p-2 flex flex-col gap-4 max-w-56 ${opened ? 'translate-x-[-24rem] md:translate-x-0 transition-transform duration-500' : ''}`}
      >
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-xl">Air Quality</h1>
          <fieldset>
            <legend>Choose a variable</legend>
            {[...BREATHE_SENSOR_VIEWER_VARS, ...BREATHE_PM_VIEWER_VARS].map((option, index) => {
              return (
                <li className="list-none" key={option}>
                  <label htmlFor={option} className="text-xl">
                    <input
                      type="radio"
                      id={option}
                      name="variable"
                      value={option}
                      onClick={(e) => clickHandler(e)}
                      defaultChecked={index === 0}
                    />{' '}
                    {FormattedVar(option)}
                  </label>
                </li>
              );
            })}
          </fieldset>
        </div>
        <h2 className="text-lg">{formatDate(selectedDate, "p 'at' P")}</h2>
        <p>Use the date slider to view hourly air quality data across Providence.</p>
        <div className="flex flex-col gap-1 w-full">
          <input
            type="range"
            min={0}
            max={dates.length - 1}
            value={selectedDateIndex}
            onChange={(e) => setSelectedDateIndex(Number(e.target.value))}
            aria-label="date slider"
          />
          <div className="w-full flex flex-row justify-between text-sm">
            <span>{dates[0].toLocaleDateString()}</span>
            <span>{dates[dates.length - 1].toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h3 className="text-base">Legend:</h3>
          <div className={`w-full h-4 bg-gradient-to-r from-[#8e44ad] to-[#c0392b]`} />
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
  setSelectedSensors: React.Dispatch<React.SetStateAction<string[]>>
) {
  if (loaded) {
    const features = event['features'] as { properties: { site: string } }[];
    if (features && features.length > 0) {
      const site = features[0]['properties']['site'];
      setSelectedSensors((currentNames) => {
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

function createGeoJson(
  data: BreatheSensorData[] | BreathePmData[],
  variable: 'co' | 'co2' | 'pm1' | 'pm10' | 'pm25',
  dates: Date[]
) {
  return {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: (data as CombinedData[])
        .filter((entry) => entry[variable] !== null)
        .map(({ [variable]: v, longitude, latitude, sensorName, time, node }) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [longitude, latitude] },
          properties: {
            site: sensorName,
            node,
            v,
            datetime: time,
            date: dates.findIndex((v) => v.valueOf() === roundToNearestHours(time).valueOf()),
            variable,
          },
        })),
    },
  };
}
