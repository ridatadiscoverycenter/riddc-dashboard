export function makeCommaSepList(list: string[]) {
  return list.reduce(
    (prev, next, index) =>
      `${prev}${index === 0 ? '' : `${index === list.length - 1 ? '' : ','} `}${index === list.length - 1 ? 'and ' : ''}${next}`,
    ''
  );
}
