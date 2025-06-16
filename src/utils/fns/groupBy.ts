export function groupBy<T>(
  data: T[],
  getGroup: (item: T) => string | number
): Record<string | number, T[]> {
  return data.reduce(
    (prev, item) => {
      const group = getGroup(item);
      return { ...prev, [group]: [...(prev[group] || []), item] };
    },
    {} as Record<string | number, T[]>
  );
}
