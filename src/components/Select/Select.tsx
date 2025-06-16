'use client';
import React from 'react';
import ReactSelect from 'react-select';

import { Label } from '@/components';
import { Dataset } from '@/utils/data/api/buoy/types';
import { variableToLabel } from '@/utils/data/shared/variableConverter';

type ReactSelectProps = Parameters<typeof ReactSelect>[0];

type SelectProps = ReactSelectProps & {
  label: string;
  options: string[] | { label: string; value: string }[];
  forceLight?: boolean;
  dataset: Dataset;
};

export function Select({
  label,
  options,
  forceLight = false,
  dataset = 'ma',
  ...props
}: SelectProps) {
  const formatted = React.useMemo(() => {
    if (options.length === 0) return [];
    // Casting because typescript doesn't like type checking like this.
    if (typeof options[0] === 'string')
      return (options as string[]).map((opt) => ({
        label: variableToLabel(dataset, opt),
        value: opt,
      }));
    return options as Exclude<typeof options, string[]>;
  }, [options, dataset]);
  return (
    <Label label={label} forceLight={forceLight}>
      <ReactSelect
        {...props}
        options={formatted}
        unstyled
        classNames={{
          control: ({ isFocused }) =>
            `p-2 rounded-md shadow-sm hover:shadow-md duration-300 transition-shadow bg-slate-100/80 text-black ${isFocused ? 'border-teal-400 border-solid border-2' : ''} ${!forceLight ? 'dark:bg-slate-800 dark:border-slate-600 dark:text-white' : ''}`,
          placeholder: () => 'text-slate-500 dark:text-slate-400',
          menu: () =>
            `mt-2 rounded-md p-2 bg-slate-100/90 border-slate-400 border-solid border-2 ${!forceLight ? 'dark:bg-slate-900/90' : 'text-black'}`,
          option: ({ isSelected, isFocused }) =>
            `p-1 rounded-md ${isSelected ? "before:content-['✔_']" : ''} ${isFocused ? 'bg-slate-200 dark:bg-slate-800' : ''}`,
          multiValue: () => 'm-1 px-2 gap-2 rounded-md border border-solid border-slate-500',
        }}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
    </Label>
  );
}
