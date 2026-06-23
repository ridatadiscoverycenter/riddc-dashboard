import { StaticImageData } from 'next/image';

import choroplethAgeUnder15 from '@/assets/ossdb/ossdb_choropleth_age_under_15.png';
import choroplethAgeCollege from '@/assets/ossdb/ossdb_choropleth_age_college.png';
import choroplethAgeOver70 from '@/assets/ossdb/ossdb_choropleth_age_over_70.png';

import choroplethHousingVacant from '@/assets/ossdb/ossdb_choropleth_housing_vacant.png';
import choroplethHousingOwnerOccupied from '@/assets/ossdb/ossdb_choropleth_housing_owner_occupied.png';
import choroplethHousingRenterOccupied from '@/assets/ossdb/ossdb_choropleth_housing_renter_occupied.png';

import choroplethRaceWhite from '@/assets/ossdb/ossdb_choropleth_race_white.png';
import choroplethRaceBlackAfricanAmerican from '@/assets/ossdb/ossdb_choropleth_race_black_african_american.png';
import choroplethRaceAmericanIndianAlaskaNative from '@/assets/ossdb/ossdb_choropleth_race_american_indian_alaska_native.png';
import choroplethRaceAsian from '@/assets/ossdb/ossdb_choropleth_race_asian.png';
import choroplethRaceNativeHawaiianPacificIslander from '@/assets/ossdb/ossdb_choropleth_race_native_hawaiian_pacific_islander.png';
import choroplethRaceOther from '@/assets/ossdb/ossdb_choropleth_race_other.png';

export type GalleryData = {
  id: number;
  title: string;
  bounds: { min: number; max: number };
  src: StaticImageData;
  alt: string;
  note?: React.ReactNode;
};

const ALT_TEMPLATE = 'A choropleth map of Rhode Island census tracts displaying';

export const gallery: Array<GalleryData> = [
  {
    id: 0,
    title: 'Rhode Island Residents Under 15 Years Old',
    bounds: {
      min: 0,
      max: 100, //30,
    },
    src: choroplethAgeUnder15,
    alt: `${ALT_TEMPLATE} percentage populations of residents under 15 years of age. Concentrations (~25-30%) appear in the Providence / Pawtucket area, Woonsocket, Barrington, and Newport.`,
  },
  {
    id: 1,
    title: 'College Age (20-24) Residents of Rhode Island',
    bounds: {
      min: 0,
      max: 100, //15,
    },
    src: choroplethAgeCollege,
    note: 'Locations of colleges are noted on the map.',
    alt: `${ALT_TEMPLATE} percentage populations of college-age residents and the locations of college across the state. The highest concentrations appear in Providence (near Brown University), Newport (near Salve Regina University), and Narragansett (near University of Rhode Island's Bay Campus).`,
  },
  {
    id: 2,
    title: 'Rhode Island Residents Over 70 Years Old',
    bounds: {
      min: 0,
      max: 100, //35,
    },
    src: choroplethAgeOver70,
    alt: `${ALT_TEMPLATE} percentage populations of residents over 70 years of age. Concentrations appear in along the south coast of Rhode Island and East Greenwhich.`,
  },

  {
    id: 10,
    title: 'Vacant Housing Units In Rhode Island',
    bounds: {
      min: 0,
      max: 100, //70,
    },
    src: choroplethHousingVacant,
    alt: `${ALT_TEMPLATE} percentage of vacant housing units. Tracts along the south coast and Block Island have upwards of 70% vacant housing, mostly due people owned seasonal homes.`,
  },
  {
    id: 11,
    title: 'Housing Units Occupied by their Owner',
    bounds: {
      min: 0,
      max: 100,
    },
    src: choroplethHousingOwnerOccupied,
    alt: `${ALT_TEMPLATE} percentage of housing units occupied by their owner. Most of the state has high percentages of owner occupied housing units, with the rural areas of the state (eg Foster, Little Compton, and Burrillville) having the highest concentrations.`,
  },
  {
    id: 12,
    title: 'Housing Units Occupied by Renters',
    bounds: {
      min: 0,
      max: 100,
    },
    src: choroplethHousingRenterOccupied,
    alt: `${ALT_TEMPLATE} percentage of housing units occupied by a renter. The urban areas of the state (Providence, Woonsocket, and Newport) have the highest concentrations of renter occupied housing (~100%).`,
  },

  {
    id: 20,
    title: 'White Residents',
    bounds: {
      min: 0,
      max: 100,
    },
    src: choroplethRaceWhite,
    alt: `${ALT_TEMPLATE} percentage populations of White residents. Most tracts have high percentages of White residents except for the urban areas of Providence, Pawtucket, and Woonsocket, with Greenville also having a smaller percentage. `,
  },
  {
    id: 21,
    title: 'Black or African American Residents',
    bounds: {
      min: 0,
      max: 100, //45,
    },
    src: choroplethRaceBlackAfricanAmerican,
    alt: `${ALT_TEMPLATE} percentage populations of Black or African American residents. The tracts in and around Providence, Woonsocket, and Newport have the highest concentrations of Black or African American residents.`,
  },
  {
    id: 22,
    title: 'American Indian or Alaskan Native Residents',
    bounds: {
      min: 0,
      max: 100, //10,
    },
    src: choroplethRaceAmericanIndianAlaskaNative,
    alt: `${ALT_TEMPLATE} percentage populations of American Indian or Alaskan Native residents. `,
  },
  {
    id: 23,
    title: 'Asian Residents',
    bounds: {
      min: 0,
      max: 100, //35,
    },
    src: choroplethRaceAsian,
    alt: `${ALT_TEMPLATE} percentage populations of Asian residents. Greenville and some areas of Providence have high populations of Asian residents (~35%), with other suburban areas of the state having lower but still notable populations of Asian residents.`,
  },
  {
    id: 24,
    title: 'Native Hawaiian or Pacific Islander Residents',
    bounds: {
      min: 0,
      max: 100, //2,
    },
    src: choroplethRaceNativeHawaiianPacificIslander,
    alt: `${ALT_TEMPLATE} percentage populations of Native Hawaiian or Pacific Islander Residents residents. There aren't any census tracts with high proportions of Native Hawaiian or Pacific Islander residents, but the greatest conentrations exist around Providence and Newport.`,
  },
  {
    id: 25,
    title: 'Residents Reporting "Other" on Census Surveys',
    bounds: {
      min: 0,
      max: 100, //70,
    },
    src: choroplethRaceOther,
    alt: `${ALT_TEMPLATE} percentage populations of residents who reported "other" on census surveys. This group of residents is highly concentrated in and around the Providence area.`,
  },
];
