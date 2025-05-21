import { FullBleedColumn } from '@/components';

export default function Glossary() {
  return (
    <FullBleedColumn className="my-2 gap-4">
      <h1 className="text-4xl font-extralight">Glossary</h1>
      <h2 className="text-2xl">Agencies and Organizations</h2>
      <List
        items={[
          { label: 'GoMRI', value: 'Gulf of Maine Research Institute' },
          { label: 'MassDEP', value: 'Massachusetts Department of Environmental Protection' },
          { label: 'NBC', value: 'Narragansett Bay Commission' },
          { label: 'NBEP', value: 'Narragansett Bay Estuary Program' },
          { label: 'NBFSMN', value: 'Narragansett Bay Fixed Site Monitoring Network' },
          {
            label: 'NERACOOS',
            value: 'Northeast Regional Association Coastal Ocean Observing Systems',
          },
          {
            label: 'RI C-AIM',
            value:
              'Rhode Island Consortium for Coastal Ecology Assessment, Innovation, and Modeling',
          },
          { label: 'RIC', value: 'Rhode Island College' },
          { label: 'RIDDC', value: 'Rhode Island Data Discovery Center' },
          {
            label: 'RIDEM-OWR',
            value: 'Rhode Island Department of Environmental Monitoring-Office of Water Resources',
          },
          { label: 'RWU', value: 'Roger Williams University' },
          { label: 'SNEP', value: 'Southern New England Estuary Program' },
          { label: 'UNH', value: 'University of New Hampshire' },
          { label: 'URI-CI', value: 'University of Rhode Island-Coastal Institute' },
          {
            label: 'URI-GSO',
            value: 'University of Rhode Island, Graduate School of Oceanography',
          },
        ]}
      />
      <h2 className="text-2xl">Data Variables</h2>
      <List
        items={[
          {
            label: 'Chlorophyll (µg L-1 or RFU)',
            value: 'Concentration of chlorophyll in sea water',
          },
          { label: 'Density (g cm-3)', value: 'Density of sea water' },
          { label: 'Depth (m)', value: 'Measured water depth under buoy' },
          { label: 'DIN (µmole L-1)', value: 'Dissolved inorganic nitrogen in sea water, Moles' },
          { label: 'DIP (µmole L-1)', value: 'Dissolved inorganic phosphorus in sea water, Moles' },
          {
            label: 'FSpercent (% full scale)',
            value: 'Total fluorescence of chlorophyll in sea water',
          },
          { label: 'NH4 (µmole L-1)', value: 'Concentration of ammonium in sea water, Moles' },
          { label: 'NitrateN (mg L-1)', value: 'Concentration of nitrate in sea water, Moles' },
          { label: 'NO2 (µmole L-1)', value: 'Concentration of nitrite in sea water, Moles' },
          { label: 'NO3 (µmole L-1)', value: 'Concentration of nitrate in sea water, Moles' },
          { label: 'O2 (mg L-1)', value: 'Concentration of oxygen in sea water' },
          { label: 'O2Percent (%)', value: 'Percent oxygen in sea water' },
          { label: 'pH (SU)', value: 'Potential hydrogen in sea water, standard pH scale' },
          { label: 'Phaeo (µg L-1)', value: 'Concentration of phaeopigment in sea water' },
          {
            label: 'Phycoerythrin (µg L-1 or RFU)',
            value: 'Concentration of phycoerythrin in sea water',
          },
          { label: 'Salinity (g kg-1)', value: 'Salinity of sea water, Practical Salinity Units' },
          { label: 'Silica (µmole L-1)', value: 'Concentration of silica in sea water, Moles' },
          { label: 'SpCond (mS cm-1)', value: 'Conductivity of sea water, MilliSiemens' },
          {
            label: 'Turbidity (NTU)',
            value: 'Sea water clarity measured with white light at 90° detection angle',
          },
          { label: 'WaterTemp (°C)', value: 'Sea water temperature in degrees Celsius' },
        ]}
      />
      <h2 className="text-2xl">Other Acronyms</h2>
      <List
        items={[
          { label: 'ERDDAP', value: 'Environmental Research Division Data Access Program' },
          { label: 'NABATS', value: 'Narragansett Bay Time Series' },
          { label: 'OSOM', value: 'Ocean State Ocean Model' },
          { label: 'ROMS', value: 'Regional Ocean Modelling System' },
        ]}
      />
    </FullBleedColumn>
  );
}

function List({ items }: { items: { label: string; value: string }[] }) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map(({ label, value }) => (
        <li key={label}>
          <span className="font-bold">{label}</span>: {value}
        </li>
      ))}
    </ul>
  );
}
