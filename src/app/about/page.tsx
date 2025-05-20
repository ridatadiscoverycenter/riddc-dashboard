import Image from 'next/image';
import NarBay from '@/components/Image/NarBay';
import { Card, Link } from '@/components';
import ridemImage from '@/assets/ridem-crest.svg';
import urigsolight from '@/assets/urigso-light.svg';
import urigsodark from '@/assets/urigso-dark.svg';
import narrabay from '@/assets/narrabay-logo.svg';
import nbnerr from '@/assets/nbnerr.svg';
import rwu from '@/assets/RWUSeal_Light_Blue.svg';
import nbep from '@/assets/nbep.svg';

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

const CREDITS = [
  {
    title:
      'Rhode Island Department of Environmental Management- Office of Water Resources (RIDEM-OWR)',
    logoLight: ridemImage,
    logoDark: ridemImage,
  },
  {
    title: 'University of Rhode Island, Graduate School of Oceanography (URI-GSO)',
    logoLight: urigsolight,
    logoDark: urigsodark,
  },
  {
    title: 'Narragansett Bay Commission (NBC)',
    logoLight: narrabay,
    logoDark: narrabay,
  },
  {
    title: 'Narragansett Bay National Estuarine Research Reserve (NBNERR)',
    logoLight: nbnerr,
    logoDark: nbnerr,
  },
  { title: 'Roger Williams University (RWU)', logoLight: rwu, logoDark: rwu },
  {
    title: 'Narragansett Bay Estuary Program (NBEP), and URI Coastal Institute',
    logoLight: nbep,
    logoDark: nbep,
  },
];

export default function About() {
  return (
    <>
      <NarBay />
      <div className="max-w-[1000px]">
        <h1 className="w-full text-center text-4xl font-header font-bold mt-8 mb-8">About</h1>
        <h2 className="w-full text-center text-2xl font-header font-bold">
          Rhode Island Data Discovery Center
        </h2>
        <div className="px-4 mx-6 text-xl">
          <p className="my-4">
            The National Science Foundation in 2017 awarded the University of Rhode Island with a
            grant to establish a statewide research consortium — the RI Consortium for Coastal
            Ecology Assessment, Innovation, and Modeling (RI C-AIM) — to study the effects of
            climate variability on coastal ecosystems. The RI Data Discovery Center is one of the
            efforts of RI C-AIM consortium.
          </p>
          <p className="my-4">
            The goal of the RI Data Discovery Center is to become the national and international
            go-to-source for data on the Narragansett Bay ecosystem. For C-AIM investigators
            pursuing the research goals of the Integrated Bay Observatory, Predicting Ecosystem
            Response and Visualization & Imaging, RI Data Discovery Center will become the site
            where they will store their data, share their data internally with other C-AIM
            investigators and share their data externally with investigators around the world.
          </p>
          <p className="my-4">
            In addition to new data collected by C-AIM investigators, RI Data Discovery Center will
            also collect and share historical data on the Narragansett Bay ecosystem. In addition to
            sharing data with scientists, RIDDC will also become the go-to-source where decision
            makers, land-use managers, relevant industries, citizen scientists and students can find
            data on the Narragansett Bay ecosystem.
          </p>
        </div>
        <h2 className="w-full text-center text-2xl font-header font-bold mb-4">Leadership</h2>
        <div className="px-4 mb-4 mx-6">
          <ul className="margin-auto grid sm:grid-cols-1 md:grid-cols-3 gap-4">
            {LEADERSHIP.map(({ name, affiliations }) => (
              <li key={name}>
                <Card className="bg-clear-300 hover:bg-clear-800 dark:bg-clear-100 hover:dark:bg-clear-300">
                  <h3 className="text-xl font-bold font-header">{name}</h3>
                  {affiliations.map((affiliation) => (
                    <p className="pb-4" key={affiliation}>
                      {affiliation}
                    </p>
                  ))}
                </Card>
              </li>
            ))}
          </ul>
        </div>
        <h2 className="w-full text-center text-2xl font-header font-bold mb-2">Credits</h2>
        <div className="px-4 mx-6 mb-4 text-xl">
          <p className="my-2">
            The historical data available for lookup on this site has been compiled from quality
            controlled data from Narragansett Bay Fixed Site Monitoring Network (NBFSMN). The RI DEM
            Office of Water Resources (RIDEM-OWR) has been leading the effort of coordinating this
            multi-agency collaboration. Folllowing agencies contributed to the network of fixed-site
            monitoring stations:
          </p>
          <ul className="margin-auto grid sm:grid-cols-1 md:grid-cols-3 gap-4">
            {CREDITS.map(({ title, logoDark, logoLight }) => (
              <li key={title}>
                <Card className="bg-clear-300 hover:bg-clear-800 dark:bg-clear-100 hover:dark:bg-clear-300 place-items-center">
                  <h3 className="text-xl font-bold font-header text-center dark:hidden">
                    <Image src={logoLight} height={100} alt={title} title={title} />
                  </h3>
                  <h3 className="text-xl font-bold font-header text-center hidden dark:block">
                    <Image src={logoDark} height={100} alt={title} title={title} />
                  </h3>
                </Card>
              </li>
            ))}
          </ul>
          <p className="my-2">
            If you use any of these historical data in any publication, presentation, poster, media
            production or similar, please remember that you need to cite the data sources listed on
            RI DEM Fixed-Site Monitoring Stations Network Data (look under Citation for Data users)
          </p>
          <p>
            For more information about the RI DEM Fixed-Site Monitoring Stations please refer to RI
            DEM Fixed-Site Monitoring Stations and Data in Narragansett Bay
          </p>
        </div>
        <div className="px-4 mx-6 mb-4 text-xl">
          <h2 className="w-full text-center text-2xl font-header mt-8 mb-2">
            Data Acceptance Guidelines
          </h2>
          <p>
            Contact us if you want us to host your Narragansett Bay related data! See our data
            acceptance guidelines <Link href="/riddc_data_guidelines.pdf">here</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
