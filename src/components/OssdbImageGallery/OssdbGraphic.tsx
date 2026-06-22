import Image from 'next/image';

import { type GalleryData } from './data';

type OssdbGraphicProps = {
  data: GalleryData;
};

export function OssdbGraphic({ data }: OssdbGraphicProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center">
        <div
          aria-label={`Data ranges from ${data.bounds.max}% to ${data.bounds.min}%`}
          className="flex flex-row h-1/2 gap-2"
        >
          <div className="flex flex-col justify-between">
            <span>{data.bounds.max}%</span>
            <span>{data.bounds.min}%</span>
          </div>
          <div className="h-full w-4 rounded-md bg-gradient-to-t from-[#224] to-[#1fe]" />
        </div>
        <Image src={data.src} alt={data.alt} className="w-full sm:w-[50%]" />
      </div>
      {data.note && <p className="text-sm">{data.note}</p>}
    </div>
  );
}
