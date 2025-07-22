export type StationName = 'Fox Island' | 'Whale Rock';
export type FishVariable =
  | 'Alewife'
  | 'Atlantic Herring'
  | 'Bluefish'
  | 'Butterfish'
  | 'Cancer Crab'
  | 'Cunner'
  | 'Fourspot Flounder'
  | 'Horseshoe Crab'
  | 'Lady Crab'
  | 'Little Skate'
  | 'Lobster'
  | 'Long Finned_squid'
  | 'Longhorn Sculpin'
  | 'Northern Searobin'
  | 'Red Hake'
  | 'Scup'
  | 'Starfish'
  | 'Silver Hake'
  | 'Spider Crabs'
  | 'Striped Searobin'
  | 'Summer Flounder'
  | 'Tautog'
  | 'Weakfish'
  | 'Windowpane Flounder'
  | 'Winter Flounder';

type FishCoordinateBase = {
  latitude: number;
  longitude: number;
};

export type FetchedFishCoordinate = FishCoordinateBase & {
  station_name: StationName;
};

export type FishCoordinate = FishCoordinateBase & {
  stationName: StationName;
  buoyId: string;
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

export type Temperature = TemperatureBase & {
  station: StationName;
  timestamp: Date;
  year: number;
  meanTemp: number;
  monthlyMean: number;
  avg?: number;
};

export type AverageTemperature = Temperature & {
  avg: number;
};

export type SampleBase = {
  species: string;
  title: string;
  station: StationName;
  year: number;
  abun: number;
};

export type Sample = { animal: string } & SampleBase;

export interface Info {
  href?: string;
  name?: string;
  sciName?: string;
  photoUrl?: string;
  sectionData?: {
    Classification?: {
      Classification?: string;
    };
    IUCN?: string;
  };
}
