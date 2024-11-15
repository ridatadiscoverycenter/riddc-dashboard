import React from 'react';

const BASE_STYLES = 'p-2 rounded-md shadow-sm';
const COLOR_STYLES = 'bg-slate-200 dark:bg-slate-800 dark:border-slate-600 dark:border-1';

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
