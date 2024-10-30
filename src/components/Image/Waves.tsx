import Image, { type ImageProps } from 'next/image';

import wavesimage from '@/assets/waves.png';

export function Waves({ ...props }: Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'>) {
  return <Image {...props} src={wavesimage} width={3001} height={885} alt="" />;
}
