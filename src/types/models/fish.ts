export type StationName = 'Fox Island' | 'Whale Rock';

type FishCoordinateBase = {
  latitude: number;
  longitude: number;
};

export type FetchedFishCoordinate = FishCoordinateBase & {
  station_name: StationName;
};

export type TemperatureBase = {
  level: 'Surface' | 'Bottom';
  month: number;
  delta: number;
};

export type FetchedTemperature = TemperatureBase & {
  Station: StationName;
  year_month: string;
  mean_temp: number;
  monthly_mean: number;
};

export type SampleBase = {
  species: string;
  title: string;
  station: StationName;
  year: number;
  abun: number;
};

export interface Info {
  href?: string;
  name?: string;
  sciName?: string;
  photoUrl?: string;
  Classification?: string;
  IUCN?: string;
}
