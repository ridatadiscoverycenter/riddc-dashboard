'use client';
import React, { DetailedHTMLProps, SelectHTMLAttributes } from 'react';
import { Label } from '@/components';

const BASE_STYLES = 'p-2 rounded-md shadow-sm ';
const LIGHT_STYLES = 'bg-slate-200';
const DARK_STYLES = 'dark:bg-slate-800 dark:border-slate-600 dark:border-1';
const COLOR_STYLES = `${LIGHT_STYLES} ${DARK_STYLES}`;

type SelectProps = DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> & {
  label: string;
  options: string[] | { label: string; value: string }[];
  forceLight?: boolean;
};

export function Select({ label, options, forceLight = false, className, ...props }: SelectProps) {
  const formatted = React.useMemo(() => {
    if (options.length === 0) return [];
    // Casting because typescript doesn't like type checking like this.
    if (typeof options[0] === 'string')
      return (options as string[]).map((opt) => ({ label: opt, value: opt }));
    return options as Exclude<typeof options, string[]>;
  }, [options]);
  return (
    <Label label={label} forceLight={forceLight}>
      <select
        {...props}
        className={
          className
            ? `${BASE_STYLES} ${className}`
            : `${BASE_STYLES} ${forceLight ? LIGHT_STYLES : COLOR_STYLES}`
        }
      >
        <option disabled>~~Options:~~</option>
        {formatted.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Label>
  );
}
