import React from 'react';

const BASE_STYLES =
  'p-2 rounded-md shadow-sm border-none focus:outline-none focus:border-2 focus:border-solid';
const COLOR_STYLES = 'bg-slate-200 dark:bg-slate-800 border-teal-400 dark:border-slate-600';

export function Input({
  className,
  ...props
}: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  return (
    <input
      {...props}
      className={className ? `${BASE_STYLES} ${className}` : `${BASE_STYLES} ${COLOR_STYLES}`}
    />
  );
}
