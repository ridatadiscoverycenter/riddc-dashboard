import React from 'react';

const DEFAULT_SERIALIZE = JSON.stringify;
const DEFAULT_DESERIALIZE = JSON.parse;

export type UseLocalStorageParams<T> = {
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  validate?: (value: T) => boolean;
};

export function useLocalStorageState<T>(
  defaultValue: T,
  key: string,
  useLocalStorageParams: UseLocalStorageParams<T> = {}
) {
  const { serialize, deserialize, validate } = useLocalStorageParams;
  const [data, setData] = React.useState<T>(defaultValue);

  React.useEffect(() => {
    const storedSerializedData = localStorage.getItem(key);
    // If key exists in LocalStorage, maybe update React value
    if (storedSerializedData !== null) {
      const storedData = (deserialize || DEFAULT_DESERIALIZE)(storedSerializedData);
      // Update React value if validate is provided and succeeds, OR if validate isn't provided at all.
      if ((validate && validate(storedData)) || !validate) {
        setData(storedData as T);
      }
    }
    // If key doesn't exist, store the default value.
    else {
      localStorage.setItem(key, (serialize || DEFAULT_SERIALIZE)(defaultValue));
    }
    // Only execute this on first run!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update LocalStorage when data updates.
  React.useEffect(() => {
    localStorage.setItem(key, (serialize || DEFAULT_SERIALIZE)(data));
  }, [key, data, serialize]);

  return [data, setData] as const;
}
