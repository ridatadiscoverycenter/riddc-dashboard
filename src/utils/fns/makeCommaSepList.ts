export function makeCommaSepList(list: string[]) {
  if (list.length === 0) return '';
  if (list.length === 1) return list[0];

  return list.reduce(
    (prev, next, index) =>
      `${prev}${index === 0 ? '' : `${index === list.length - 1 ? '' : ','} `}${index === list.length - 1 ? 'and ' : ''}${next}`,
    ''
  );
}
