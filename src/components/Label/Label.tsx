import React from 'react';

export function Label({
  label,
  forceLight = false,
  children,
}: React.PropsWithChildren<{ label: string; forceLight?: boolean }>) {
  return (
    <label className="flex flex-col gap-1">
      <span className={`text-slate-600 ${!forceLight && 'dark:text-slate-300'} text-sm`}>
        {label}
      </span>
      {children}
    </label>
  );
}
