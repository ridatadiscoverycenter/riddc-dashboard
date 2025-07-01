/**
 * A helper function to await several asynchonous calls simultaneously (API calls)
 * and return the data in a typed Map.
 * @param promises A map of promises that return any data type.
 * @returns A map with keys matched to resolved promises.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchMulti<T extends Record<string, Promise<any>>>(
  promises: T
): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
  const entries = await Promise.all(
    Object.entries(promises).map(async ([key, promise]) => [key, await promise])
  );
  return Object.fromEntries(entries);
}
