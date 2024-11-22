'use client';
import React, { SetStateAction } from 'react';
import { CloseIcon, Select } from '@/components';

type KeyValueArray = { label: string; value: string }[];
type StringOrKeyValueArray = string[] | KeyValueArray;

type MultiselectProps = {
  label: string;
  options: StringOrKeyValueArray;
  onChange: React.Dispatch<SetStateAction<string[]>>;
  init?: string[];
};

function formatOptionsArray(arr: StringOrKeyValueArray) {
  if (arr.length === 0) return [];
  // Casting because typescript doesn't like type checking like this.
  if (typeof arr[0] === 'string')
    return (arr as string[]).map((opt) => ({ label: opt, value: opt }));
  return arr as KeyValueArray;
}

function formatInitialSelected(formattedOpts: KeyValueArray, init: string[]) {
  //console.log({ init });
  //console.log({ foundVaules });
  //return foundVaules;
  return init
    .map((initialValue) => formattedOpts.find(({ value }) => value === initialValue))
    .filter((value) => value !== undefined);
}

export function Multiselect({ label, options, onChange, init = [] }: MultiselectProps) {
  const formatted = formatOptionsArray(options); //React.useMemo(() => formatOptionsArray(options), [options]);
  const [selected, setSelected] = React.useState<KeyValueArray>(
    formatInitialSelected(formatted, init)
  );
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
