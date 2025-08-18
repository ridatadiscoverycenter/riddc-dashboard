'use client';

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
  // TODO this needs to get date indices for each site? or just
  const dates = React.useMemo(
    () => breatheData.map(({ time }) => roundToNearestHours(time)).sort((a, b) => compareAsc(a, b)),
    [breatheData]
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
            variable: 'co', // TODO: this needs to get choice of variable!
            value: co,
            dateTime: time,
            date: dates.findIndex((v) => v.valueOf() === roundToNearestHours(time).valueOf()),
          },
        })),
      },
    }),
    [breatheData, dates]
  );
  //   console.log(breatheGeoJson.data.features);
  breatheGeoJson.data.features.map((feature) =>
    console.log(feature.properties.date, feature.properties.site, feature.properties.value)
  );

  const onLoad = React.useCallback<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (map: React.MutableRefObject<any>, loaded: boolean) => () => void
  >(
    (map, loaded) => {
      //   breatheGeoJson;
      map.current.addSource('breathe-data', breatheGeoJson);
      map.current.addLayer({
        id: 'breathe-circles',
        type: 'circle',
        source: 'breathe-data',
        paint: {
          'circle-color': ['interpolate', ['linear'], ['get', 'value'], 0, '#4f14da', 1, '#99fee8'],
          'circle-radius': ['interpolate', ['linear'], ['get', 'value'], 0, 5, 0.5, 12, 1, 20],
          'circle-opacity': 0.75,
        },
        filter: ['==', 'date', selectedDateIndex],
      });
      // Identifier text for each gage
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
      return () => {
        // map.current.off('mouseenter', 'stream-gage-circles', doSetPointer);
        // map.current.off('mouseleave', 'stream-gage-circles', doUnsetPointer);
        // map.current.off('click', 'stream-gage-circles', doHandleCircleClick);

        map.current.removeLayer('breath-circles');
        map.current.removeLayer('breath-ids');
        map.current.removeLayer('breath-selected');
        // map.current.removeSource('selected-breath-data');
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.current.removeSource('stream-data');
      };
    },
    [
      breatheGeoJson,
      setSelectedDateIndex,
      setSelectedSensors,
      //   selectedBreatheDataGeoJson,
    ]
  );
  const [opened, setOpen] = React.useState(false);

  return (
    <MapGraph
      onLoad={onLoad}
      graph={<Loading />}
      syncOpenState={(isMapOpen) => setOpen(isMapOpen)}
      className="h-screen"
    >
      <div
        className={`h-screen z-50 absolute top-6 left-2 bg-slate-100/90 dark:bg-slate-800/90 rounded-md font-light p-2 flex flex-col gap-4 max-w-56 ${opened ? 'translate-x-[-24rem] md:translate-x-0 transition-transform duration-500' : ''}`}
      >
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-xl">Air Quality</h1>
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
            <span>Two Weeks Ago</span>
            <span>{selectedDateIndex}</span>
            <span>Today</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h3 className="text-base">Legend:</h3>
          <div className={`w-full h-4 bg-gradient-to-r from-[#4f14da] to-[#99fee8]`} />
          <div className="w-full flex flex-row justify-between text-sm">
            <span>0</span>
            <span>1</span>
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
