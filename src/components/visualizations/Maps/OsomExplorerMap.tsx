'use client';

import React from 'react';
import { useMap } from './useMap';
import { Input, Label, Select } from '@/components';

type OsomExplorerMapProps = {
  variable: 'salt' | 'temp';
  rasterIndex: number;
};

const VARIABLE_OPTS = [
  { label: 'Water Salinity', value: 'salt' },
  { label: 'Surface Temperature', value: 'temp' },
];

const HALINE_GRADIENT = 'linear-gradient(0.25turn, #2a186e, #125e8e, #3c9486, #80cd64, #fbee97)';
const THERMAL_GRADIENT = 'linear-gradient(0.25turn, #032333, #634197, #b5607f, #fa973f, #e7fa5a)';

export function OsomExporerMap({
  variable: initialVariable,
  rasterIndex: initialRasterIndex,
}: OsomExplorerMapProps) {
  const { map, loaded, containerRef } = useMap();
  const [variable, setVariable] = React.useState<'salt' | 'temp'>(initialVariable);
  const [rasterIndex, setRasterIndex] = React.useState(initialRasterIndex);

  const rasterUrl = React.useMemo(
    () => getRasterUrl(rasterIndex, variable),
    [rasterIndex, variable]
  );

  React.useEffect(() => {
    if (loaded) {
      map.current.addSource('osom-data', {
        type: 'raster',
        tiles: [rasterUrl],
        attribution: 'Ocean State Ocean Model',
      });

      map.current.addLayer({
        id: 'osom-raster',
        type: 'raster',
        source: 'osom-data',
      });

      return () => {
        map.current.removeLayer('osom-raster');
        map.current.removeSource('osom-data');
      };
    }
  }, [loaded, rasterUrl]);

  return (
    <section className="full-bleed w-full min-h-[80vh] relative p-0 my-0">
      <div ref={containerRef} className="absolute w-full h-full" />
      <div className="flex flex-col gap-2 absolute top-[3%] left-3 md:top-[8%] md:left-8 bg-white/90 dark:bg-slate-800/90 p-4 rounded-md w-72 overflow-auto">
        {/*<Header size="sm">{variable === 'salt' ? 'Water Salinity' : 'Surface Temperature'}</Header>*/}
        <Select
          label="Model Variable"
          options={VARIABLE_OPTS}
          defaultValue={VARIABLE_OPTS[0]}
          value={VARIABLE_OPTS.find(({ value }) => value === variable)}
          onChange={(e) => {
            const selectedVariable = e as { value: 'salt' | 'temp'; label: string };
            setVariable(selectedVariable.value);
          }}
        />
        <Label label='Timepoint'>
          <Input type="range" min={0} max={YEARLY_VALUE_INDECIES.length - 1} value={rasterIndex} onChange={(e) => { e.preventDefault(); setRasterIndex(Number(e.target.value));}} />
        </Label>
        <div className="flex flex-row gap-2 items-center">
          <span>0 {variable === 'salt' ? 'PSU' : 'ºC'}</span>
          <div
            className="flex-1 h-4"
            style={{ backgroundImage: variable === 'salt' ? HALINE_GRADIENT : THERMAL_GRADIENT }}
          ></div>
          <span>30 {variable === 'salt' ? 'PSU' : 'ºC'}</span>
        </div>
      </div>
    </section>
  );
}

const YEARLY_VALUE_INDECIES = [
  1096, 1462, 1827, 2192, 2557, 2923, 3288, 3653, 4018, 4384, 4749, 5114, 5479, 5845, 6210,
];

const BASE_RASTER_URL =
  'https://qa-tile-server.riddc.brown.edu/services/ocean_his_<TIMEPOINT>_<VARIABLE>@1/tiles/{z}/{x}/{y}.png';

function getRasterUrl(timepoint: number, variable: 'salt' | 'temp') {
  const boundedTimepoint =
    timepoint < 0
      ? 0
      : timepoint >= YEARLY_VALUE_INDECIES.length
        ? YEARLY_VALUE_INDECIES.length - 1
        : timepoint;
  return BASE_RASTER_URL.replace(
    '<TIMEPOINT>',
    YEARLY_VALUE_INDECIES[boundedTimepoint].toString()
  ).replace('<VARIABLE>', variable);
}
