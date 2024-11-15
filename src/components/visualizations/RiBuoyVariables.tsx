'use client';
import React from 'react';
import { Vega, VisualizationSpec } from 'react-vega';

import type { RiBuoyData } from '@/utils/erddap/api/buoy';

type RiBuoyVariablesProps = {
  data: RiBuoyData[];
  height?: number;
  width?: number;
  colors?: string[];
};

const BASE_COLORS = [
  '#2e0d93',
  '#fd5925',
  '#3f6f94',
  '#daa4f9',
  '#6fcf1d',
  '#801967',
  '#f1d438',
  '#1dfee1',
  '#f35c79',
  '#faa566',
  '#456fe7',
  '#9f6c3b',
  '#87c4c1',
  '#5a3100',
  '#972b2d',
  '#1fa562',
  '#ca50d3',
  '#1d2150',
  '#7212ff',
  '#6a7d54',
];

export function RiBuoyVariables({
  data,
  colors = BASE_COLORS,
  height = 200,
  width = 600,
}: RiBuoyVariablesProps) {
  //console.log({ RiBuoyVariables: "component", data });
  const stations = React.useMemo(
    () => Array.from(new Set(data.map((value) => value.stationName))),
    [data]
  );
  const variables = React.useMemo(
    () => Array.from(new Set(data.map((value) => value.variable))),
    [data]
  );
  const colorsUsed = React.useMemo(
    () => colors.sort((_, __) => Math.random() * 2 - 1).slice(0, stations.length),
    [colors, stations]
  );
  const buoyVariablesSpec = React.useMemo<VisualizationSpec>(
    () => ({
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      description: 'Weather History Chart',
      width,
      height,
      background: 'white',
      signals: [
        {
          name: 'hover',
          value: null,
          on: [
            { events: '@points_voronoi:mouseover', update: 'datum' },
            { events: '@points_voronoi:mouseout', update: 'null' },
          ],
        },
      ],
      data: [
        {
          name: 'data',
          values: data,
          transform: [{ type: 'formula', as: 'value', expr: 'toNumber(datum.value)' }],
        },
        {
          name: 'filtered',
          source: 'data',
          transform: [
            { type: 'formula', as: 'value', expr: 'toNumber(datum.value)' },
            { type: 'filter', expr: 'datum.value !== null' },
          ],
        },
        {
          name: 'highlightedPoint',
          source: 'data',
          transform: [
            {
              type: 'filter',
              expr: 'hover && hover.datum.time === datum.time',
            },
          ],
        },
      ],
      scales: [
        {
          name: 'xscale',
          type: 'time',
          domain: { data: 'data', field: 'time' },
          range: 'width',
          round: true,
        },
        {
          name: 'yscale',
          type: 'linear',
          domain: { data: 'filtered', field: 'value' },
          nice: true,
          zero: false,
          range: 'height',
        },
        {
          name: 'colorScale',
          type: 'ordinal',
          range: colorsUsed,
          domain: stations,
        },
        {
          name: 'variableScale',
          type: 'ordinal',
          range: [
            [1, 0],
            [1, 1],
            [3, 1],
            [5, 2],
          ].slice(0, variables.length),
          domain: variables,
        },
      ],
      legends: [
        {
          stroke: 'colorScale',
          orient: 'top',
          direction: 'horizontal',
          title: 'Buoys',
          symbolType: 'stroke',
        },
        {
          title: 'Variables',
          strokeDash: 'variableScale',
          orient: 'top',
          symbolType: 'stroke',
        },
      ],
      axes: [
        { orient: 'bottom', scale: 'xscale', title: 'Time' },
        {
          orient: 'left',
          scale: 'yscale',
          title: 'Variables',
          grid: false,
        },
      ],
      marks: [
        {
          type: 'group',
          from: {
            facet: {
              name: 'groupedData',
              data: 'data',
              groupby: ['stationName', 'variable'],
            },
          },
          marks: [
            {
              type: 'line',
              name: 'lines',
              from: { data: 'groupedData' },
              encode: {
                enter: {
                  x: { scale: 'xscale', field: 'time' },
                  y: { scale: 'yscale', field: 'value' },
                  stroke: { scale: 'colorScale', field: 'stationName' },
                  strokeWidth: { value: 1 },
                  strokeDash: {
                    scale: 'variableScale',
                    field: 'variable',
                  },
                  //"interactive": false,
                  defined: { signal: 'datum.value !== null' },
                },
              },
            },
          ],
        },
        /*,
        {
            type: "line",
            name: "dataLine",
            from: { data: "data" },
            encode: {
              enter: {
                x: { scale: "xscale", field: "time" },
                y: { scale: "yscale", field: "value" },
                stroke: { scale: "colorScale", field: "stationName" },
                strokeWidth: { value: 1 },
                
              }
            }
        },*/
      ],
      //config: {
      //    mark: { invalid: "break-paths-filter-domains", },
      //}
    }),
    [data, stations, colorsUsed, variables, width, height]
  );
  return <Vega spec={buoyVariablesSpec} />;
}

/*const buoyVariablesSpec = React.useMemo<VisualizationSpec>(
    () => ({
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    description: 'Weather History Chart',
    width,
    height,
    background: 'white',
    signals: [],
    data: [{
      name: "data",
      data,
    }],
    scales: [
      {
          "name": "timeScale",
          "type": "time",
          "domain": {
            "fields": [
              { "data": "data", "field": "time" }
            ]
          },
          "range": "width",
          "padding": 0.05,
          "round": true
      },
      {
          "name": "valueScale",
          "type": "linear",
          "domain": {"fields": [{"data": "data", "field": "value"}]},
          "nice": true,
          "zero": false,
          "range": [500, 0]
      },
      {
          "name": "colorScale",
          "type": "ordinal",
          "range": colorsUsed,
          "domain": stations,
      },
    ],
    legends: [
      {
        "stroke": "colorScale",
        "orient": "bottom",
        "direction": "horizontal",
        "title": "Buoys",
        "symbolType": "stroke"
      },
    ],
    axes: [
      {"orient": "bottom", "scale": "timeScale"},
      {"orient": "left", "scale": "valueScale", "title": "Variables"}
    ],
    marks: [
      {
          "type": "line",
          "name": "lines",
          "from": {"data": "data"},
          "encode": {
            "enter": {
              "x": {"scale": "timeScale", "field": "time"},
              "y": {"scale": "valueScale", "field": "value"},
              "stroke": {"scale": "color", "field": "stationName"},
              "strokeWidth": {"scale": "lineWidth", "field": "dataset"},
              "strokeDash": {
                "scale": "lineDash",
                "field": "unittedVariable"
              },
              //"interactive": false,
              "strokeOpacity": {"value": 0.9},
              "defined": {"signal": "datum.value !== null"}
            }
          }
        }
    ],
  }),
  [data, stations, width, height]
);*/
