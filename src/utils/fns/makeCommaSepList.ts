import { getTitleFromSpecies } from '../data';

export function makeCommaSepList(list: string[]) {
  if (list.length === 0) return '';
  if (list.length === 1) return list[0];

  const listCopy = [...list];
  const last = listCopy.pop();
  return `${listCopy.join(', ')} and ${last}`;
}

export function makeCommaSepFish(list: string[]) {
  if (list.length === 0) return '';
  if (list.length === 1) return getTitleFromSpecies(list[0]);

  const listCopy = [...list];
  const last = listCopy.pop();
  return `${listCopy.map(getTitleFromSpecies).join(', ')} and ${last !== undefined && getTitleFromSpecies(last)}`;
}
