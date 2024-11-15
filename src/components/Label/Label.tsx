import React from 'react';

const BASE_STYLES = 'text-sm';
const LIGHT_STYLES = 'text-slate-600';
const DARK_STYLES = 'dark:text-slate-300';
const COLOR_STYLES = `${LIGHT_STYLES} ${DARK_STYLES}`;

export function Label({
  label,
  forceLight = false,
  children,
}: React.PropsWithChildren<{ label: string; forceLight?: boolean }>) {
  console.log({ label, forceLight });
  return (
    <label className="flex flex-col gap-1">
      <span className={`${BASE_STYLES} ${forceLight ? LIGHT_STYLES : COLOR_STYLES}`}>{label}</span>
      {children}
    </label>
  );
}
