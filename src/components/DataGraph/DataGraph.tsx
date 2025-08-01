import { WeatherHistory } from '@/components';
import { WeatherData } from '@/utils/data';

type BuoyGraphProps = {
  description: React.ReactNode | string;
  weather: WeatherData[];
  download?: React.ReactNode;
};
export function DataGraph({
  description,
  weather,
  download,
  children,
}: React.PropsWithChildren<BuoyGraphProps>) {
  return (
    <>
      <p className="text-black">{description}</p>
      <div className="flex-1 flex flex-col justify-start items-start w-full">
        {children}
        <WeatherHistory data={weather} />
      </div>
      {download !== undefined ? download : null}
    </>
  );
}
