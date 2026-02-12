'use client';
import React from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { formatDate } from 'date-fns';

import { useMap } from './useMap';
import buoymarker from '@/assets/buoy-marker.svg';
import { DomoicAcidCoordinate, DomoicAcidSample } from '@/utils/data/api/da';

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
  const rangeStations = React.useMemo(
    () => Array.from(new Set(samples.map(({ stationName }) => stationName))),
    [samples]
  );
  const [selectedDateIndex, setSelectedDate] = React.useState(0);
  const selectedDate = React.useMemo(
    () => sampleDates[selectedDateIndex],
    [sampleDates, selectedDateIndex]
  );

  const samplesAtDate = React.useMemo(
    () =>
      samples
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
        })),
    [samples, selectedDate, stations]
  );

  const popup = React.useMemo(() => new maplibregl.Popup(), []);

  React.useEffect(() => {
    if (loaded) {
      map.current.addSource('da-stations', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: stations.map((station) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [station.longitude, station.latitude],
            },
            properties: {
              name: station.stationName,
            },
          })),
        },
      });
      map.current.addSource('da-samples', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: samplesAtDate,
        },
      });
      const minVar = Math.min(...rangePDA);
      const maxVar = Math.max(...rangePDA);
      const midVar = (maxVar + minVar) / 2;
      map.current.addLayer({
        id: 'da-circles',
        type: 'circle',
        source: 'da-samples',
        paint: {
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'pDA'],
            minVar,
            '#00c951',
            midVar,
            '#fd9a00',
            maxVar * 0.66,
            '#c287bc',
          ],
          'circle-opacity': 0.75,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'pDA'],
            minVar,
            10,
            midVar,
            25,
            maxVar,
            40,
          ],
        },
      });

      const buoyImg = new Image(45, 45);
      buoyImg.src = buoymarker.src;
      buoyImg.onload = () => {
        map.current.addImage('buoy-marker', buoyImg);
        map.current.addLayer({
          id: 'da-buoys',
          type: 'symbol',
          source: 'da-stations',
          layout: {
            'icon-image': 'buoy-marker',
            'icon-size': 0.5,
          },
        });
        map.current.on('click', () => {
          popup.remove();
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.current.on('click', 'da-buoys', (e: any) => {
          const station = stations.find((station) => {
            const { lng, lat } = e.lngLat;
            const lngDiff = Math.abs(station.longitude - lng);
            const latDiff = Math.abs(station.latitude - lat);
            return lngDiff <= 0.005 && latDiff <= 0.005;
          });
          if (station) {
            const sample = samplesAtDate.find(
              (sample) => sample.properties.stationName === station.stationName
            );
            popup.setLngLat(e.lngLat);
            popup.setHTML(
              `<div style="display: flex; flex-flow: column; gap: 2px;"><h3 style="color: black; font-weight: bold">${station.stationName}</h3>${sample === undefined ? '' : `<p style="color: black">${Math.round(sample.properties.pDA * 1000) / 1000} ng of DA / L</p>`}</div>`
            );
            popup.addTo(map.current);
          }
        });
      };

      return () => {
        map.current.removeLayer('da-circles');
        map.current.removeLayer('da-buoys');
        map.current.removeSource('da-samples');
        map.current.removeSource('da-stations');
        map.current.removeImage('buoy-marker');
      };
    }
  }, [map, loaded, samples, stations, selectedDate, rangePDA, popup, samplesAtDate]);
  return (
    <>
      <section className="full-bleed w-full min-h-[70vh] relative p-0 my-0">
        <div ref={containerRef} className="absolute w-full h-full" />
        {/* MD - Date Icon */}
        <div className="md:hidden absolute top-[10%] left-8 bg-white/75 dark:bg-slate-800/75 flex text-lg font-bold p-4 rounded-md drop-shadow-md w-[225px]">
          <h2>{formatDate(selectedDate, 'MM/dd/yyyy')}</h2>
        </div>
        {/* LG - Buoy List */}
        <div className="hidden md:flex flex-col absolute top-[10%] left-8 h-[80%] bg-white/75 dark:bg-slate-800/75 p-4 rounded-md w-[225px] overflow-clip">
          <h2 className="text-lg font-bold">{formatDate(selectedDate, 'MM/dd/yyyy')}</h2>
          <ul className="flex flex-col gap-2">
            {rangeStations.map((stationName) => {
              const sample = samplesAtDate.find((s) => s.properties.stationName === stationName);
              if (sample) {
                return (
                  <li key={stationName} className="flex flex-col">
                    <h3>{stationName}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {Math.round(sample.properties.pDA * 1000) / 1000} ng of DA / L of seawater
                    </p>
                    <div
                      className={`rounded-sm not-sr-only h-3 ${getProgressBarClasses(
                        sample.properties.pDA,
                        rangePDA[0],
                        rangePDA[rangePDA.length - 1]
                      )} transition-all duration-200`}
                    />
                  </li>
                );
              }
              return (
                <li key={stationName} className="flex flex-col">
                  <h3>{stationName}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">No Data</p>
                  <div
                    className={`rounded-sm not-sr-only h-3 w-[1%] bg-red-400 transition-all duration-200`}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <div className="w-full">
        <div className="px-1 sm:px-10">
          <input
            title="Date"
            type="range"
            className="flex justify-self-center w-full"
            aria-label="Date"
            min={0}
            max={sampleDates.length - 1}
            step={1}
            value={selectedDateIndex}
            onChange={(evt) => setSelectedDate(evt.target.valueAsNumber)}
            list="beep"
          />
        </div>
        <datalist id="beep" className="flex flex-row w-full justify-between">
          {[
            1,
            Math.ceil(sampleDates.length / 4),
            Math.ceil(sampleDates.length / 2),
            Math.ceil((sampleDates.length * 3) / 4),
            sampleDates.length,
          ].map((index) => (
            <option
              key={index}
              value={index - 1}
              label={formatDate(sampleDates[index - 1], 'MM/dd/yyyy')}
              className="justify-center [writing-mode:vertical-lr] sm:[writing-mode:horizontal-tb]"
            >
              {formatDate(sampleDates[index - 1], 'MM/dd/yyyy')}
            </option>
          ))}
        </datalist>
      </div>
    </>
  );
}

function getProgressBarClasses(value: number, min: number, max: number) {
  const PROGRESS_BAR_WIDTHS = [
    'w-[1%]',
    'w-[10%]',
    'w-[20%]',
    'w-[30%]',
    'w-[40%]',
    'w-[50%]',
    'w-[60%]',
    'w-[70%]',
    'w-[80%]',
    'w-[90%]',
    'w-[100%]',
  ];
  const PROGRESS_BAR_COLORS = [
    'bg-green-500 dark:bg-green-300',
    'bg-amber-500 dark:bg-amber-300',
    'bg-red-500 dark:bg-red-400',
  ];
  const valuePercent = (value - min) / (max - min);
  return `${PROGRESS_BAR_WIDTHS[Math.round(valuePercent * 10)]} ${PROGRESS_BAR_COLORS[Math.floor(valuePercent * 2.999)]}`;
}
