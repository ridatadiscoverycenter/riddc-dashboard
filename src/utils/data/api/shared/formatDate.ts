export function formatDateForQueryParams(d: Date) {
  return d.toISOString().split('T')[0];
}
