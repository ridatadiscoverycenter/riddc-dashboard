export function makeCommaSepList(list: string[]) {
  if (list.length === 0) return '';
  if (list.length === 1) return list[0];

  const listCopy = [...list];
  const last = listCopy.pop();
  return `${listCopy.join(', ')} and ${last}`;
}
