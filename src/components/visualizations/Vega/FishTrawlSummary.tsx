'use client';

import React from 'react';
import { Vega, VisualizationSpec } from 'react-vega';

import { Loading, Select } from '@/components';
import { Size, useScreenSize } from '@/hooks/useScreenSize';
import type { Sample } from '@/types';

type FishTrawlSummaryProps = {
  data: Sample[];
  options: { label: string; value: string }[];
};

//TODO: none of these really work, gotta figure out sizing (and maybe 2xl vs 3xl?)
function getGraphicWidth(size: Size | undefined) {
  if (size === 'sm' || size === 'xs') return 250;
  if (size === 'md') return 520;
  if (size === 'lg') return 370;
  if (size === 'xl') return 600;
  return 1100;
}

export function FishTrawlSummary({ data, options }: FishTrawlSummaryProps) {
  const size = useScreenSize();
  const [station, setStation] = React.useState(options[0]);
  const fishTrawlSpec = React.useMemo<VisualizationSpec>(
    () => ({
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      description: 'Fish Trawl Summary Chart',
      background: 'transparent',
      width: getGraphicWidth(size),
      height: 600,
      autosize: 'pad',
      data: [
        {
          name: 'rawData',
          values: data,
        },
        {
          name: 'data',
          source: 'rawData',
          transform: [
            {
              type: 'filter',
              expr: `datum.station == "${station.value}"`,
            },
          ],
        },
        {
          name: 'dataNoZeros',
          source: 'data',
          transform: [
            {
              type: 'filter',
              expr: 'datum.abun > 0',
            },
          ],
        },
      ],
      scales: [
        {
          name: 'x',
          type: 'band',
          domain: { data: 'data', field: 'year', sort: true },
          range: 'width',
        },
        {
          name: 'y',
          type: 'band',
          domain: { data: 'data', field: 'title', sort: true },
          range: 'height',
          padding: 0.02,
        },
        {
          name: 'color',
          type: 'log',
          range: { scheme: 'tealblues' },
          domain: { data: 'dataNoZeros', field: 'abun' },
          reverse: false,
          zero: false,
          nice: true,
          clamp: true,
        },
        {
          name: 'size',
          type: 'log',
          domain: { data: 'dataNoZeros', field: 'abun' },
          range: [0.15, 1],
          clamp: true,
        },
        {
          name: 'shape',
          type: 'ordinal',
          domain: ['fish', 'lobster', 'crab', 'starfish', 'squid'],
          range: [
            'm 0.127 -0.532 c -0.3037 0 -0.5689 0.1849 -0.7163 0.3429 v 0 l -0.2948 -0.223 c -0.041 -0.0311 -0.1021 0.0022 -0.0915 0.0494 v 0 l 0.0815 0.3704 l -0.0815 0.3704 c -0.0105 0.0475 0.0508 0.0805 0.0915 0.0494 v 0 l 0.2948 -0.223 c 0.1477 0.1582 0.4128 0.3429 0.7166 0.3429 c 0.4639 0 0.84 -0.432 0.84 -0.54 c 0 -0.108 -0.3761 -0.54 -0.84 -0.54 z m 0.2951 0.621 c -0.0448 0 -0.081 -0.0362 -0.081 -0.081 c 0 -0.0448 0.0362 -0.081 0.081 -0.081 c 0.0448 0 0.081 0.0362 0.081 0.081 c 0 0.0448 -0.0362 0.081 -0.081 0.081 z',
            'm 0.494 -0.231 c 0.1927 -0.0411 0.3368 -0.228 0.3368 -0.391 c 0 -0.3225 -0.1843 -0.3686 -0.1843 -0.3686 c 0 0.3302 -0.0885 0.3945 -0.0921 0.3993 v -0.2611 c -0.2304 0.0461 -0.2304 0.4454 -0.2304 0.5375 c 0 0.0342 -0.0249 0.0625 -0.0576 0.0681 c -0.0266 -0.2034 -0.0948 -0.3308 -0.1554 -0.4069 c 0.0266 -0.0291 0.0575 -0.0795 0.0696 -0.1623 c 0.0303 -0.0151 0.0513 -0.0463 0.0513 -0.0825 c 0 -0.0509 -0.0413 -0.0921 -0.0921 -0.0921 c -0.0509 0 -0.0921 0.0413 -0.0921 0.0921 c 0 0.0319 0.0162 0.0599 0.0407 0.0765 c -0.0088 0.0526 -0.0269 0.084 -0.0414 0.1015 c -0.0271 -0.0229 -0.0454 -0.0321 -0.0454 -0.0321 s -0.0183 0.0092 -0.0454 0.0321 c -0.0145 -0.0175 -0.0326 -0.0489 -0.0414 -0.1015 c 0.0246 -0.0166 0.0407 -0.0446 0.0407 -0.0765 c 0 -0.0509 -0.0413 -0.0921 -0.0921 -0.0921 c -0.0509 0 -0.0921 0.0413 -0.0921 0.0921 c 0 0.0362 0.0209 0.0674 0.0513 0.0825 c 0.012 0.0828 0.043 0.1332 0.0696 0.1623 c -0.0606 0.0761 -0.1288 0.2034 -0.1554 0.4069 c -0.0326 -0.0055 -0.0576 -0.0339 -0.0576 -0.0681 c 0 -0.0921 0 -0.4915 -0.2304 -0.5375 v 0.2611 c -0.0036 -0.0048 -0.0921 -0.0691 -0.0921 -0.3993 c 0 0 -0.1843 0.0461 -0.1843 0.3686 c 0 0.163 0.1442 0.35 0.3368 0.391 c 0.0323 0.0917 0.1158 0.1594 0.2161 0.1684 c 0 0.0004 0 0.0007 0 0.0011 v 0.0691 h -0.0968 c -0.0635 0 -0.1152 -0.0517 -0.1152 -0.1152 h -0.0921 c 0 0.1143 0.093 0.2073 0.2073 0.2073 h 0.0968 v 0.0691 h -0.0968 c -0.1143 0 -0.2073 0.093 -0.2073 0.2073 h 0.0921 c 0 -0.0635 0.0517 -0.1152 0.1152 -0.1152 h 0.0968 c 0 0.0373 0.0148 0.0711 0.0388 0.096 c -0.024 0.0249 -0.0388 0.0587 -0.0388 0.096 c 0 0.048 0.0244 0.0902 0.0615 0.115 l -0.1077 0.2152 c 0 0 0.0885 0.1075 0.3225 0.1075 c 0.234 0 0.3225 -0.1075 0.3225 -0.1075 l -0.1076 -0.2152 c 0.0371 -0.0248 0.0615 -0.067 0.0615 -0.115 c 0 -0.0373 -0.0148 -0.0711 -0.0388 -0.096 c 0.024 -0.0249 0.0388 -0.0587 0.0388 -0.096 h 0.0968 c 0.0635 0 0.1152 0.0517 0.1152 0.1152 h 0.0921 c 0 -0.1143 -0.093 -0.2073 -0.2073 -0.2073 h -0.0968 v -0.0691 h 0.0968 c 0.1143 0 0.2073 -0.093 0.2073 -0.2073 h -0.0921 c 0 0.0635 -0.0517 0.1152 -0.1152 0.1152 h -0.0968 v -0.0691 c 0 -0.0004 0 -0.0007 0 -0.0011 c 0.1002 -0.0091 0.1838 -0.0767 0.216 -0.1684 z',
            'm 0.8676 -0.0277 c 0 0.075 -0.0609 0.1358 -0.1358 0.1358 h -0.0976 c -0.0189 -0.0622 -0.0535 -0.12 -0.1006 -0.1706 c 0.0452 -0.0348 0.0802 -0.0822 0.0996 -0.1369 c 0.2163 -0.0426 0.3432 -0.2343 0.3432 -0.4262 c 0 -0.2171 -0.163 -0.2715 -0.163 -0.2715 c 0 0.163 -0.1087 0.2717 -0.1087 0.2717 v -0.2174 c -0.2717 0.0543 -0.2717 0.4347 -0.2717 0.5434 c 0 0.045 -0.0365 0.0815 -0.0815 0.0815 h -0.0543 c -0.0354 -0.0137 -0.073 -0.0252 -0.1119 -0.0339 c 0.0146 -0.0376 0.0256 -0.0846 0.0291 -0.143 c 0.033 -0.0187 0.0556 -0.0541 0.0556 -0.0948 c 0 -0.06 -0.0487 -0.1087 -0.1087 -0.1087 c -0.06 0 -0.1087 0.0487 -0.1087 0.1087 c 0 0.0396 0.0213 0.0741 0.053 0.0932 c -0.0041 0.058 -0.0172 0.0991 -0.0315 0.1276 c -0.0248 -0.0022 -0.0502 -0.0033 -0.0759 -0.0033 s -0.0509 0.0011 -0.0759 0.0033 c -0.0143 -0.0285 -0.0274 -0.0693 -0.0315 -0.1276 c 0.0317 -0.0189 0.053 -0.0535 0.053 -0.0932 c 0 -0.06 -0.0487 -0.1087 -0.1087 -0.1087 c -0.06 0 -0.1087 0.0487 -0.1087 0.1087 c 0 0.0406 0.0224 0.0761 0.0556 0.0948 c 0.0035 0.0585 0.0146 0.1054 0.0291 0.143 c -0.0389 0.0087 -0.0765 0.0202 -0.1119 0.0339 h -0.0543 c -0.045 0 -0.0815 -0.0365 -0.0815 -0.0815 c 0 -0.1087 0 -0.4891 -0.2717 -0.5434 v 0.2174 c 0 0 -0.1087 -0.1087 -0.1087 -0.2717 c 0 0 -0.163 0.0543 -0.163 0.2717 c 0 0.1917 0.1269 0.3834 0.3432 0.426 c 0.0196 0.0548 0.0546 0.1022 0.0996 0.1369 c -0.0472 0.0506 -0.0819 0.1085 -0.1006 0.1706 h -0.0976 c -0.075 0 -0.1358 -0.0609 -0.1358 -0.1358 v -0.1358 h -0.1087 v 0.1358 c 0 0.1348 0.1098 0.2445 0.2445 0.2445 h 0.0815 c 0 0.0374 0.0057 0.0737 0.0161 0.1087 h -0.0976 c -0.1348 0 -0.2445 0.1098 -0.2445 0.2445 v 0.1358 h 0.1087 v -0.1358 c 0 -0.075 0.0609 -0.1358 0.1358 -0.1358 h 0.1493 c 0.015 0.0226 0.0322 0.0443 0.0515 0.0648 c -0.1004 0.0304 -0.1737 0.1237 -0.1737 0.2341 v 0.0815 h 0.1087 v -0.0815 c 0 -0.075 0.0609 -0.1358 0.1358 -0.1358 h 0.0522 c 0.1119 0.068 0.2545 0.1087 0.4097 0.1087 c 0.1552 0 0.2978 -0.0406 0.4097 -0.1087 h 0.0522 c 0.075 0 0.1358 0.0609 0.1358 0.1358 v 0.0815 h 0.1087 v -0.0815 c 0 -0.1102 -0.0733 -0.2037 -0.1739 -0.2341 c 0.0193 -0.0204 0.0365 -0.0422 0.0515 -0.0648 h 0.1495 c 0.075 0 0.1358 0.0609 0.1358 0.1358 v 0.1358 h 0.1087 v -0.1358 c 0 -0.1348 -0.1098 -0.2445 -0.2445 -0.2445 h -0.0976 c 0.0107 -0.035 0.0161 -0.0713 0.0161 -0.1087 h 0.0815 c 0.1348 0 0.2445 -0.1098 0.2445 -0.2445 v -0.1358 h -0.1087 v 0.1359 z',
            'm -0.5868 0.8752 c -0.0052 -0.0048 -0.0052 -0.0059 -0.0022 -0.021 c 0.0007 -0.0026 -0.0004 -0.0059 -0.0015 -0.0074 c -0.0037 -0.0044 -0.003 -0.0269 0.0018 -0.0421 c 0.0048 -0.0148 0.0339 -0.0753 0.0653 -0.1336 c 0.0118 -0.0218 0.0277 -0.0517 0.0354 -0.0664 c 0.0077 -0.0148 0.0192 -0.0365 0.0255 -0.048 c 0.0199 -0.038 0.0841 -0.1664 0.0989 -0.1981 c 0.0317 -0.069 0.0391 -0.0915 0.0373 -0.1114 c -0.003 -0.0277 -0.0192 -0.0417 -0.0705 -0.0601 c -0.142 -0.0517 -0.3081 -0.1373 -0.4261 -0.2192 c -0.0963 -0.0671 -0.1524 -0.1258 -0.1646 -0.173 c -0.0041 -0.0155 -0.003 -0.0347 0.003 -0.0461 c 0.0048 -0.0103 0.0125 -0.0192 0.0148 -0.0177 c 0.0011 0.0007 0.003 -0.0004 0.0044 -0.0022 c 0.0026 -0.003 0.0022 -0.003 -0.0011 -0.0004 c -0.0033 0.0022 -0.0033 0.0022 -0.0015 0 c 0.0015 -0.0015 0.0033 -0.003 0.0041 -0.003 c 0.0011 -0.0004 0.003 -0.0004 0.0041 -0.0007 c 0.0011 0 0.0015 -0.0015 0.0007 -0.0026 c -0.0007 -0.0015 -0.0007 -0.0018 0 -0.0015 c 0.0007 0.0007 0.007 -0.0007 0.0137 -0.003 c 0.0214 -0.0074 0.0421 -0.0089 0.0922 -0.0077 c 0.0671 0.0015 0.1299 0.0092 0.2361 0.0284 c 0.0196 0.0037 0.0365 0.0059 0.0376 0.0052 c 0.0015 -0.0011 0.0015 -0.0007 0.0007 0.0011 c -0.0011 0.0018 -0.0004 0.0022 0.0037 0.0015 c 0.0026 -0.0007 0.0055 -0.0004 0.0059 0.0007 c 0.0007 0.0011 0.0033 0.0015 0.0059 0.0007 c 0.0033 -0.0007 0.0041 -0.0004 0.0033 0.0011 c -0.0011 0.0015 0.0007 0.0018 0.0044 0.0015 c 0.0033 -0.0007 0.0059 -0.0004 0.0059 0.0011 c 0 0.0011 0.0022 0.0015 0.0048 0.0007 c 0.0033 -0.0011 0.0044 -0.0007 0.0037 0.0011 c -0.0011 0.0015 0.0004 0.0018 0.0048 0.0007 c 0.0044 -0.0011 0.0059 -0.0007 0.0048 0.0007 c -0.0011 0.0015 0.0004 0.0018 0.0041 0.0011 c 0.0037 -0.0011 0.0048 -0.0007 0.0037 0.0011 c -0.0011 0.0018 -0.0004 0.0018 0.0026 0.0011 c 0.0055 -0.0018 0.0181 0.0007 0.0148 0.003 c -0.0015 0.0011 0 0.0015 0.0037 0.0007 c 0.0041 -0.0007 0.0059 -0.0007 0.0059 0.0011 c 0 0.0015 0.0007 0.0018 0.0018 0.0011 c 0.003 -0.0018 0.0151 0.0011 0.0137 0.0033 c -0.0007 0.0011 -0.0004 0.0015 0.0011 0.0007 c 0.003 -0.0018 0.0173 0.0007 0.0159 0.003 c -0.0007 0.0011 0.0004 0.0011 0.0018 0.0007 c 0.0055 -0.0022 0.1114 0.0258 0.2133 0.0564 c 0.0299 0.0092 0.0553 0.0118 0.0668 0.0066 c 0.0081 -0.0037 0.0137 -0.0103 0.0166 -0.0199 c 0.0018 -0.007 0.0026 -0.0502 0.0011 -0.0601 c -0.0059 -0.0358 -0.0077 -0.2398 -0.0033 -0.3402 c 0.0066 -0.1491 0.0196 -0.2712 0.0339 -0.318 c 0.0059 -0.0192 0.0159 -0.0365 0.0262 -0.0454 c 0.0048 -0.0044 0.0096 -0.0077 0.0103 -0.0081 c 0.0011 0 0.0048 -0.0033 0.0085 -0.007 c 0.0063 -0.0059 0.0081 -0.007 0.0159 -0.007 c 0.0494 0 0.1454 0.148 0.2077 0.3206 c 0.0314 0.0867 0.0509 0.1668 0.0616 0.2524 c 0.0048 0.0373 0.0048 0.1266 0 0.1561 c -0.003 0.0184 -0.0107 0.0561 -0.0137 0.0671 c -0.0007 0.003 -0.0007 0.003 0.0007 0.0011 c 0.0015 -0.0022 0.0026 -0.0022 0.0063 0.0007 c 0.0103 0.0074 0.0303 0.003 0.0775 -0.0177 c 0.0775 -0.0336 0.1251 -0.048 0.204 -0.0624 c 0.0937 -0.017 0.2037 -0.0207 0.2992 -0.0092 c 0.0114 0.0015 0.0184 0.003 0.0177 0.0041 c -0.0007 0.0011 0.0015 0.0015 0.0059 0.0007 c 0.0041 -0.0007 0.0063 -0.0004 0.0059 0.0007 c -0.0007 0.0011 0.0015 0.0018 0.0044 0.0018 c 0.0081 0 0.0398 0.0066 0.0686 0.014 c 0.066 0.0173 0.1044 0.041 0.1099 0.0686 c 0.0033 0.0151 -0.0196 0.0384 -0.062 0.0631 c -0.0077 0.0044 -0.0144 0.0085 -0.0148 0.0092 c -0.0015 0.0018 -0.0181 0.0111 -0.0199 0.0111 c -0.0011 0 -0.0144 0.0066 -0.0295 0.0148 c -0.0151 0.0081 -0.0295 0.0151 -0.0317 0.0159 c -0.0022 0.0004 -0.0077 0.003 -0.0129 0.0055 c -0.0048 0.0026 -0.017 0.0081 -0.0273 0.0125 c -0.0103 0.0044 -0.0258 0.0114 -0.0347 0.0159 c -0.0089 0.0044 -0.017 0.0081 -0.0184 0.0081 c -0.0011 0 -0.0192 0.007 -0.0395 0.0159 c -0.0207 0.0089 -0.038 0.0159 -0.0387 0.0159 c -0.0007 0 -0.003 0.0011 -0.0044 0.0026 c -0.0018 0.0015 -0.0107 0.0052 -0.0203 0.0085 c -0.0096 0.0033 -0.0203 0.0074 -0.024 0.0096 c -0.0037 0.0018 -0.0077 0.0037 -0.0089 0.0037 c -0.0033 0 -0.0328 0.0114 -0.0476 0.0184 c -0.0066 0.0033 -0.0151 0.0063 -0.0184 0.007 c -0.0033 0.0007 -0.0081 0.0026 -0.0114 0.0044 c -0.003 0.0018 -0.0092 0.0044 -0.0137 0.0055 c -0.0114 0.0033 -0.0483 0.017 -0.0509 0.0188 c -0.0026 0.0018 -0.0166 0.0074 -0.0225 0.0081 c -0.0063 0.0011 -0.0339 0.0118 -0.0365 0.0137 c -0.0011 0.0011 -0.0066 0.003 -0.0125 0.0044 c -0.0059 0.0015 -0.0166 0.0052 -0.024 0.0077 c -0.0221 0.0081 -0.0432 0.0159 -0.0435 0.0159 c -0.0004 0 -0.0004 0.0007 0.0004 0.0018 c 0.0007 0.0007 -0.0011 0.0033 -0.0037 0.0059 c -0.0052 0.0048 -0.0081 0.0125 -0.0089 0.0236 c -0.0004 0.0077 0.0011 0.0096 0.041 0.0646 c 0.2051 0.28 0.3273 0.4734 0.3439 0.5453 c 0.0033 0.0133 0.0037 0.024 0.0011 0.0291 c -0.0041 0.007 -0.024 0.0144 -0.0494 0.0181 c -0.0181 0.003 -0.0686 0.003 -0.0834 0.0004 c -0.0653 -0.0118 -0.1332 -0.0428 -0.2166 -0.0992 c -0.0173 -0.0114 -0.0321 -0.0218 -0.0332 -0.0229 c -0.0015 -0.0011 -0.0122 -0.0096 -0.0244 -0.0188 c -0.0612 -0.0469 -0.1417 -0.1203 -0.1882 -0.1712 c -0.0063 -0.0066 -0.0155 -0.0166 -0.0207 -0.0221 c -0.0052 -0.0055 -0.0162 -0.0184 -0.0247 -0.0284 c -0.0207 -0.0247 -0.0362 -0.0406 -0.0461 -0.0476 c -0.0081 -0.0055 -0.0207 -0.0103 -0.0262 -0.0096 c -0.0015 0.0004 -0.0041 0.0004 -0.0059 0.0007 c -0.0018 0.0004 -0.0052 0.0052 -0.0081 0.0129 c -0.01 0.0236 -0.0373 0.079 -0.0491 0.0992 c -0.0384 0.0664 -0.076 0.1159 -0.1284 0.1679 c -0.041 0.041 -0.048 0.0469 -0.0786 0.0694 c -0.0118 0.0085 -0.0232 0.0173 -0.0255 0.0192 c -0.0022 0.0022 -0.0085 0.0066 -0.0137 0.0096 c -0.0055 0.0033 -0.0162 0.0096 -0.0244 0.0144 c -0.0218 0.0125 -0.0694 0.0365 -0.0897 0.0446 c -0.0096 0.0041 -0.0181 0.0077 -0.0184 0.0081 c -0.0007 0.0007 -0.0048 0.0022 -0.0092 0.0037 c -0.0048 0.0011 -0.014 0.0041 -0.0214 0.0059 c -0.007 0.0022 -0.0148 0.0041 -0.0166 0.0048 c -0.0022 0.0004 -0.0063 0.0022 -0.0092 0.0033 c -0.0033 0.0015 -0.0122 0.003 -0.0199 0.0037 c -0.0077 0.0007 -0.0162 0.0018 -0.0188 0.003 c -0.0089 0.0033 -0.0184 0.0022 -0.0236 -0.0026 z',
            'm 0.4295 -0.1017 c 0.0401 0 0.0726 -0.0325 0.0726 -0.0726 v -0.183 l 0.0494 -0.0252 c 0.018 -0.0091 0.0399 -0.0309 0.0492 -0.0486 l 0.0434 -0.0821 c 0.0093 -0.0178 0.0034 -0.0411 -0.0131 -0.0524 l -0.1626 -0.1093 c -0.0718 -0.184 -0.2499 -0.3143 -0.4589 -0.3143 c -0.2009 0 -0.3734 0.1204 -0.45 0.2931 l -0.1938 0.1305 c -0.0167 0.0111 -0.0226 0.0347 -0.0131 0.0524 l 0.0434 0.0821 c 0.0093 0.0178 0.0315 0.0395 0.0492 0.0486 l 0.072 0.0367 v 0.1715 c 0 0.0401 0.0325 0.0726 0.0726 0.0726 h 0.0748 v 0.3584 c -0.0016 0.0063 -0.0026 0.0131 -0.0022 0.0206 c 0.0056 0.1668 -0.1767 0.2112 -0.2784 0.3119 c -0.0666 0.066 0.0361 0.1686 0.1027 0.1027 c 0.0637 -0.0631 0.145 -0.1029 0.2144 -0.1587 c 0.0474 -0.0381 0.0771 -0.0879 0.0928 -0.1428 c 0.0214 0.1521 0.1021 0.2901 0.1089 0.45 c 0.004 0.0934 0.1495 0.0936 0.1452 0 c -0.0081 -0.1823 -0.1351 -0.3586 -0.1152 -0.5402 h 0.0815 c -0.0331 0.0678 -0.0416 0.1416 -0.0139 0.2249 c 0.0462 0.1386 0.183 0.2388 0.1838 0.3925 c 0.0006 0.0936 0.1458 0.0936 0.1452 0 c -0.0006 -0.1045 -0.0418 -0.1912 -0.097 -0.278 c -0.0775 -0.122 -0.1499 -0.2156 -0.0438 -0.3397 h 0.0202 c 0.0147 0.1126 0.1061 0.1826 0.1979 0.2431 c 0.1089 0.0718 0.2408 0.1317 0.1503 0.2739 c -0.0504 0.0793 0.0752 0.1521 0.1255 0.0734 c 0.0823 -0.1291 0.0714 -0.2596 -0.0444 -0.3623 c -0.0716 -0.0635 -0.2624 -0.1317 -0.2838 -0.2378 v -0.3919 l 0.0752 0 l 0 0 z',
          ],
        },
      ],
      axes: [
        {
          orient: 'bottom',
          scale: 'x',
          domain: false,
          title: 'Year',
          labelOverlap: 'parity',
          ticks: false,
          bandPosition: 0.5,
          labelAlign: 'center',
          labelFontSize: 15,
          titleFontSize: 20,
        },
        {
          orient: 'left',
          scale: 'y',
          domain: false,
          title: 'Species',
          ticks: false,
          labelFontSize: 15,
          titleFontSize: 20,
          labelPadding: 10,
        },
      ],
      legends: [
        {
          title: ['Abundance', 'of Species'],
          fill: 'color',
          type: 'gradient',
          gradientLength: { signal: 'height - 20' },
        },
      ],
      marks: [
        {
          type: 'symbol',
          from: { data: 'data' },
          encode: {
            enter: {
              tooltip: {
                signal:
                  "{'Year': datum.year, 'Species': datum.title, 'Abundance': format(datum.abun, ',.3f')}",
              },
            },
            update: {
              y: {
                signal: "scale('y', datum.title) + bandwidth('y') / 2",
              },
              x: {
                signal: "scale('x', datum.year) + bandwidth('x') / 2",
              },
              fill: [
                { test: 'datum.abun === 0', value: 'transparent' },
                { scale: 'color', field: 'abun' },
              ],
              stroke: { scale: 'color', field: 'abun' },
              strokeWidth: [{ test: 'datum.abun === 0', value: 0.3 }, { value: 0 }],
              shape: { scale: 'shape', field: 'animal' },
              width: { signal: "bandwidth('x') * scale('size', datum.abun)" },
              height: {
                signal: "bandwidth('y') * scale('size', datum.abun)",
              },
              size: {
                signal: "scale('size', datum.abun) * bandwidth('x') * bandwidth('y')",
              },
            },
          },
        },
      ],
    }),
    [data, station, size]
  );
  return (
    <>
      <form className="self-stretch">
        <Select
          forceLight
          label="Select a station:"
          value={station}
          options={options}
          defaultValue={options[0]}
          onChange={(newValue) => {
            setStation(newValue as { value: string; label: string });
          }}
        />
      </form>
      {size === undefined ? (
        <div className={`w-[1000px] h-[1000px] flex justify-center items-center`}>
          <Loading />
        </div>
      ) : (
        <Vega spec={fishTrawlSpec} actions={false} />
      )}
    </>
  );
}
