import NarBay from '@/components/Image/NarBay';
import { Card, Link } from '@/components';
// import riddc_data_guidelines from '@/../public/r';

// TODO: figure out what's meant by "(look under Citation for Data users)" and "For more information about the RI DEM Fixed-Site Monitoring Stations please refer to RI DEM Fixed-Site Monitoring Stations and Data in Narragansett Bay"

const LEADERSHIP = [
  {
    name: 'Dr. Geoffrey Bothun',
    affiliations: [
      'RI NSF EPSCoR Principal Investigator',
      'Department of Chemical Engineering, University of Rhode Island',
    ],
  },
  {
    name: 'Dr. Jeffrey Morgan',
    affiliations: [
      'Department of Molecular Pharmacology, Physiology & Biotechnology, Brown University',
    ],
  },
  {
    name: 'Dr. Lewis Rothstein',
    affiliations: ['Graduate School of Oceanography, University of Rhode Island'],
  },
  {
    name: 'Neal Overstrom',
    affiliations: ['Nature Laboratory, Rhode Island School of Design'],
  },
  {
    name: 'Dr. Bethany Jenkins',
    affiliations: ['Department of Cell and Molecular Biology, University of Rhode Island'],
  },
  {
    name: 'Dr. Baylor Fox-Kemper',
    affiliations: ['Department of Earth, Environmental, & Planetary Sciences, Brown University'],
  },
];

export default function About() {
  return (
    <>
      <NarBay />
      <h1 className="w-full text-center text-4xl font-header font-bold mt-8">About</h1>
      <h2 className="w-full text-center text-2xl font-header font-bold">
        Rhode Island Data Discovery Center
      </h2>
      <div className="px-4 mx-6 text-xl max-w-[1000px]">
        <p className="my-4">
          The National Science Foundation in 2017 awarded the University of Rhode Island with a
          grant to establish a statewide research consortium — the RI Consortium for Coastal Ecology
          Assessment, Innovation, and Modeling (RI C-AIM) — to study the effects of climate
          variability on coastal ecosystems. The RI Data Discovery Center is one of the efforts of
          RI C-AIM consortium.
        </p>
        <p className="my-4">
          The goal of the RI Data Discovery Center is to become the national and international
          go-to-source for data on the Narragansett Bay ecosystem. For C-AIM investigators pursuing
          the research goals of the Integrated Bay Observatory, Predicting Ecosystem Response and
          Visualization & Imaging, RI Data Discovery Center will become the site where they will
          store their data, share their data internally with other C-AIM investigators and share
          their data externally with investigators around the world.
        </p>
        <p className="my-4">
          In addition to new data collected by C-AIM investigators, RI Data Discovery Center will
          also collect and share historical data on the Narragansett Bay ecosystem. In addition to
          sharing data with scientists, RIDDC will also become the go-to-source where decision
          makers, land-use managers, relevant industries, citizen scientists and students can find
          data on the Narragansett Bay ecosystem.
        </p>
      </div>
      <h2 className="w-full text-center text-2xl font-header font-bold">Leadership</h2>
      <div className="px-4 mx-8 mb-4 text-xl max-w-[1000px]">
        <ul className="margin-auto max-w-[1000px] grid sm:grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {LEADERSHIP.map(({ name, affiliations }) => (
            <li key={name}>
              <Card className="bg-clear-300 hover:bg-clear-800 dark:bg-clear-100 hover:dark:bg-clear-300">
                <h3 className="text-xl font-bold font-header">{name}</h3>
                {affiliations.map((affiliation) => (
                  <p key={affiliation}>{affiliation}</p>
                ))}
              </Card>
            </li>
          ))}
        </ul>
      </div>
      <h2 className="w-full text-center text-2xl font-header font-bold">Credits</h2>
      <div className="px-4 mx-8 mb-4 text-xl max-w-[1000px]">
        <p className="my-2">
          The historical data available for lookup on this site has been compiled from quality
          controlled data from Narragansett Bay Fixed Site Monitoring Network (NBFSMN). The RI DEM
          Office of Water Resources (RIDEM-OWR) has been leading the effort of coordinating this
          multi-agency collaboration. Folllowing agencies contributed to the network of fixed-site
          monitoring stations:
        </p>
        <ul className="list-disc list-inside ps-4">
          <li>
            Rhode Island Department of Environmental Management- Office of Water Resources
            (RIDEM-OWR)
          </li>
          <li>University of Rhode Island, Graduate School of Oceanography (URI-GSO)</li>
          <li>Narragansett Bay Commission (NBC)</li>
          <li>Narragansett Bay National Estuarine Research Reserve (NBNERR)</li>
          <li>Roger Williams University (RWU)</li>
          <li>Narragansett Bay Estuary Program (NBNEP), and URI Coastal Institute</li>
        </ul>
        <p className="my-2">
          If you use any of these historical data in any publication, presentation, poster, media
          production or similar, please remember that you need to cite the data sources listed on RI
          DEM Fixed-Site Monitoring Stations Network Data (look under Citation for Data users)
        </p>

        <p>
          For more information about the RI DEM Fixed-Site Monitoring Stations please refer to RI
          DEM Fixed-Site Monitoring Stations and Data in Narragansett Bay
        </p>
      </div>
      <div className="px-4 mx-8 mb-4 text-xl">
        <h2 className="w-full text-center text-4xl font-header mt-8">Data Acceptance Guidelines</h2>
        <p className="margin-auto px-4 mx-4 mb-4 text-lg">
          Contact us if you want us to host your Narragansett Bay related data! See our data
          acceptance guidelines <Link href="/riddc_data_guidelines.pdf">here</Link>.
        </p>
      </div>
    </>
  );
}
