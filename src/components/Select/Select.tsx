'use client';
import React from 'react';
import ReactSelect from 'react-select';

import { Label } from '@/components';

type ReactSelectProps = Parameters<typeof ReactSelect>[0];

type SelectProps = ReactSelectProps & {
  label: string;
  options: string[] | { label: string; value: string }[];
  forceLight?: boolean;
};

export function Select({ label, options, forceLight = false, ...props }: SelectProps) {
  const formatted = React.useMemo(() => {
    if (options.length === 0) return [];
    // Casting because typescript doesn't like type checking like this.
    if (typeof options[0] === 'string')
      return (options as string[]).map((opt) => ({ label: opt, value: opt }));
    return options as Exclude<typeof options, string[]>;
  }, [options]);
  return (
    <Label label={label} forceLight={forceLight}>
      <ReactSelect
        {...props}
        options={formatted}
        unstyled
        classNames={{
          control: ({ isFocused }) => `p-2 rounded-md shadow-sm bg-slate-100/80 text-black ${isFocused ? "border-teal-400" : ""} ${!forceLight ? "dark:bg-slate-800 dark:border-slate-600 dark:text-white" : "" }`,
          placeholder: () => "text-slate-500 dark:text-slate-400",
          menu: () => `mt-2 rounded-md p-2 bg-slate-100/90 dark:bg-slate-900/90`,
          option: ({ isSelected }) => `m-1 ${isSelected ? "before:content-['✔_']" : ""}`,
          multiValue: () => "m-1 px-2 gap-2 rounded-md border border-solid border-slate-500",
        }}
      />
    </Label>
  );
}
    