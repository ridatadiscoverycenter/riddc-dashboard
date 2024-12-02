export type SvgSizeProp = {
  size: `${number}${'px' | 'rem'}` | number;
};

export function adjustSize({ size }: SvgSizeProp) {
  return typeof size === 'number' ? `${size}rem` : size;
}
