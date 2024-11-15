'use client';
import React, { SetStateAction } from 'react';
import { CloseIcon, Select } from '@/components';

type MultiselectProps = {
  label: string;
  options: string[] | { label: string; value: string }[];
  onChange: React.Dispatch<SetStateAction<string[]>>;
};

export function Multiselect({ label, options, onChange }: MultiselectProps) {
  const formatted = React.useMemo(() => {
    if (options.length === 0) return [];
    // Casting because typescript doesn't like type checking like this.
    if (typeof options[0] === 'string')
      return (options as string[]).map((opt) => ({ label: opt, value: opt }));
    return options as Exclude<typeof options, string[]>;
  }, [options]);
  const [selected, setSelected] = React.useState<typeof formatted>([]);
  React.useEffect(() => {
    onChange(selected.map(({ value }) => value));
  }, [onChange, selected]);
  const addNew = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) =>
      void setSelected((current) => {
        const newValue = formatted.find(({ value: v }) => v === event.target.value);
        if (newValue && !current.find(({ value }) => value === newValue?.value))
          return [...current, newValue];
        return current;
      }),
    [setSelected, formatted]
  );
  const removeSelection = React.useCallback(
    (value: string) => {
      setSelected((current) => current.filter(({ value: v }) => v !== value));
    },
    [setSelected]
  );
  /*<Label label={label}>
        <select
          onChange={addNew}
          value={undefined}
          className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 shadow-sm dark:border-slate-600 dark:border-1"
        >
          <option disabled>~~Select One~~</option>
          {formatted.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Label>*/
  return (
    <>
      <Select options={options} label={label} value={undefined} onChange={addNew} />
      {selected.length > 0 && (
        <ul className="flex flex-col items-stretch px-2 gap-1">
          {selected.map(({ label: selLabel, value }) => (
            <li key={value} className="flex flex-row">
              <span className="flex-1 text-sm italic text-slate-800 dark:text-slate-300">
                {selLabel}
              </span>
              <button
                className=" rounded-full p-1 bg-white dark:bg-slate-200"
                onClick={() => removeSelection(value)}
              >
                <CloseIcon size={1} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
