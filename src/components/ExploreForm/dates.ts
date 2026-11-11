export function handleDate(date: Date | number, mode: 'date' | 'year' = 'date') {
  if (mode === 'year') {
    if (typeof date === 'number') {
      return date;
    } else {
      return date.getFullYear();
    }
  }
  if (typeof date === 'number') throw new Error("Type 'number' is incompatible with date");
  // Format from local date parts so the query matches the date shown in the picker.
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Date-only strings (e.g. `2010-01-22` in query params and date bounds) are parsed as midnight UTC, which displays as the
 * previous day in US timezones. Convert to local midnight on the same calendar date.
 */
export function utcDateToLocal(date: Date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}
