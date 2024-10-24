'use client';
import { VegaLite, VisualizationSpec } from 'react-vega';

const TEST_SPEC: VisualizationSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  description: 'A simple bar chart with embedded data.',
  mark: 'bar',
  encoding: {
    x: { field: 'a', type: 'ordinal' },
    y: { field: 'b', type: 'quantitative' },
  },
  data: { name: 'table' },
};

type FishLiteProps = {
  data: Array<{ a: string; b: number }>;
};

export default function FishLite({ data }: FishLiteProps) {
  return <VegaLite spec={TEST_SPEC} data={{ table: data }} />;
}
