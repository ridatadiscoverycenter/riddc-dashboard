import React from 'react';

const COLORS = [
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

const LABELED_COLORS = ['Whale Rock', 'Fox Island'] as const;

const COLOR_MAP: { [key in (typeof LABELED_COLORS)[number]]: `#${string}` } = {
  'Whale Rock': '#2e0d93',
  'Fox Island': '#fd5925',
};

export function useColorMap(colorIds: Array<(typeof LABELED_COLORS)[number]>) {
  const uniqueIds = Array.from(new Set(colorIds));
  const mappedColors = React.useMemo(
    () => uniqueIds.map((id) => ({ id, color: COLOR_MAP[id] })),
    [uniqueIds]
  );
  return mappedColors;
}
