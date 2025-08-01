import Image from 'next/image';

import { Card, Link, ExternalLink, FullBleedColumn, Hero, Header } from '@/components';
import nbnerr from '@/assets/nbnerr.svg';
import nbep from '@/assets/nbep.svg';
import narrabay from '@/assets/narrabay-logo.svg';
import ridemImage from '@/assets/ridem.svg';
import urigsoDark from '@/assets/urigso-dark.svg';
import urigsoLight from '@/assets/urigso-light.svg';
import rwuDark from '@/assets/RWUSeal_Light_Blue.svg';
import rwuLight from '@/assets/RWUSeal_Blue.svg';
import { ERDDAP_URL } from '@/static/urls';

export default function Home() {
  return (
    <FullBleedColumn className="gap-4 mb-8">
      <Hero className="full-bleed" />
      <p className="my-5">
        This webtool hosts datasets and visualizations relating to the waterways of Rhode Island and
        the South Coast of New England. This project is maintained by the Rhode Island Data
        Discovery Center.
      </p>
      <Header id="datasets" size="xl" variant="accent" className="w-full text-center scroll-mt-20">
        Explore our collection of present and historical data from Narragansett Bay
      </Header>
      <ul className="w-full grid sm:grid-cols-2 md:grid-cols-3 md:gap-8 gap-4">
        {DATASETS.map(({ name, href, description }) => (
          <li key={href}>
            <Card className="bg-white/90 dark:bg-white/10">
              <Header size="sm" tag="h3">
                <Link href={href}>{name}</Link>
              </Header>
              <p className="text-sm">{description()}</p>
            </Card>
          </li>
        ))}
      </ul>
      <Header size="lg" variant="impact" className="w-full text-center my-4">
        External Resources
      </Header>
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 md:gap-8 gap-4 mb-4">
        {EXTERNAL_RESOURCES.map(({ name, href, description }) => (
          <li key={href}>
            <Card className="bg-white/90 dark:bg-white/10">
              <Header size="sm" tag="h3">
                <Link href={href}>{name}</Link>
              </Header>
              <p className="text-sm">{description}</p>
            </Card>
          </li>
        ))}
      </ul>
      <Header id="about" size="xl" variant="accent" className="w-full text-center scroll-mt-20">
        About
      </Header>
      <p>
        The National Science Foundation in 2017 awarded the University of Rhode Island with a grant
        to establish a statewide research consortium — the RI Consortium for Coastal Ecology
        Assessment, Innovation, and Modeling (RI C-AIM) — to study the effects of climate
        variability on coastal ecosystems. The RI Data Discovery Center is one of the efforts of RI
        C-AIM consortium.
      </p>
      <p>
        The goal of the RI Data Discovery Center is to become the national and international
        go-to-source for data on the Narragansett Bay ecosystem. For C-AIM investigators pursuing
        the research goals of the Integrated Bay Observatory, Predicting Ecosystem Response and
        Visualization & Imaging, RI Data Discovery Center will become the site where they will store
        their data, share their data internally with other C-AIM investigators and share their data
        externally with investigators around the world.
      </p>
      <p>
        In addition to new data collected by C-AIM investigators, RI Data Discovery Center will also
        collect and share historical data on the Narragansett Bay ecosystem. In addition to sharing
        data with scientists, RIDDC will also become the go-to-source where decision makers,
        land-use managers, relevant industries, citizen scientists and students can find data on the
        Narragansett Bay ecosystem.
      </p>
      <Header size="lg" variant="impact" className="w-full text-center">
        Leadership
      </Header>
      <ul className="margin-auto grid sm:grid-cols-1 md:grid-cols-3 md:gap-8 gap-4">
        {LEADERSHIP.map(({ name, affiliations }) => (
          <li key={name}>
            <Card className="bg-white/30 hover:bg-white/80 dark:bg-white/10 hover:dark:bg-white/30 flex flex-col py-5">
              <Header size="sm">{name}</Header>
              {affiliations.map((affiliation) => (
                <p key={affiliation}>{affiliation}</p>
              ))}
            </Card>
          </li>
        ))}
      </ul>
      <div className="px-4 mx-6"></div>
      <Header size="lg" variant="impact" className="w-full text-center">
        Credits
      </Header>
      <p>
        The historical data available for lookup on this site has been compiled from quality
        controlled data from Narragansett Bay Fixed Site Monitoring Network (NBFSMN). The RI DEM
        Office of Water Resources (RIDEM-OWR) has been leading the effort of coordinating this
        multi-agency collaboration. The following agencies contributed to the network of fixed-site
        monitoring stations:
      </p>
      <ul className="margin-auto grid sm:grid-cols-1 md:grid-cols-3 gap-4 my-4">
        {CREDITS.map(({ title, logoDark, logoLight }) => (
          <li key={title} className="flex items-center justify-center">
            <Image src={logoLight} height="100" alt={title} title={title} className="dark:hidden" />
            <Image
              src={logoDark}
              height="100"
              alt={title}
              title={title}
              className="hidden dark:block"
            />
          </li>
        ))}
      </ul>
      <p>
        If you use any of these historical data in any publication, presentation, poster, media
        production or similar, please remember that you need to cite the data sources listed on RI
        DEM Fixed-Site Monitoring Stations Network Data (look under Citation for Data users)
      </p>
      <p>
        For more information about the RI DEM Fixed-Site Monitoring Stations please refer to RI DEM
        Fixed-Site Monitoring Stations and Data in Narragansett Bay
      </p>
      <Header size="lg" variant="impact" className="w-full text-center">
        Data Acceptance Guidelines
      </Header>
      <p>
        Contact us if you want us to host your Narragansett Bay related data! See our data
        acceptance guidelines <Link href="/riddc_data_guidelines.pdf">here</Link>.
      </p>
    </FullBleedColumn>
  );
}

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
    logoLight: urigsoLight,
    logoDark: urigsoDark,
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
  { title: 'Roger Williams University (RWU)', logoLight: rwuLight, logoDark: rwuDark },
  {
    title: 'Narragansett Bay Estuary Program (NBEP), and URI Coastal Institute',
    logoLight: nbep,
    logoDark: nbep,
  },
];

const DATASETS = [
  {
    name: 'Rhode Island Buoys',
    href: '/datasets/rhode-island-buoys',
    description: () => (
      <>
        Collected over 16 years by the{' '}
        <ExternalLink href="https://dem.ri.gov/environmental-protection-bureau/water-resources/research-monitoring/narraganset-bay-assessment-fixed-site-monitoring">
          Fixed-Site Monitoring Stations and Data in Narragansett Bay
        </ExternalLink>
        . Records 19 values from 13 buoys across Narragansett Bay.
      </>
    ),
  },
  {
    name: 'Massachusetts Buoys',
    href: '/datasets/massachusetts-buoys',
    description: () => (
      <>
        Two years of data from two buoys in Narragansett Bay. Collected by the{' '}
        <ExternalLink href="https://dem.ri.gov/environmental-protection-bureau/water-resources/research-monitoring/narraganset-bay-assessment-fixed-site-monitoring">
          Fixed-Site Monitoring Stations and Data in Narragansett Bay
        </ExternalLink>{' '}
        with{' '}
        <ExternalLink href="https://www.mass.gov/orgs/massachusetts-department-of-environmental-protection">
          MassDEP
        </ExternalLink>{' '}
        as the lead agency.
      </>
    ),
  },
  {
    name: 'Real Time Data',
    href: '/datasets/real-time',
    description: () => (
      <>
        Data collected from buoys across Narraganset Bay at 10-15 minute intervals, funded by{' '}
        <ExternalLink href="https://seagrant.gso.uri.edu/">Rhode Island Sea Grant</ExternalLink> and
        the <ExternalLink href="https://web.uri.edu/rinsfepscor/welcome/">RI C-AIM</ExternalLink>.
        The buoys collecting this data are currently being repaired, and are not reporting data.
      </>
    ),
  },
  {
    name: 'Ocean State Ocean Model',
    href: '/datasets/osom',
    description: () => (
      <>
        An application of the Regional Ocean Modeling System that models data across all of Rhode
        {"Island's"} major waterways, developed in collaboration between University of Rhode Island
        and Brown University.
      </>
    ),
  },
  {
    name: 'Plankton Time Series',
    href: '/datasets/plankton',
    description: () => (
      <>
        One of the world’s longest-running plankton surveys. Since 1957, weekly samples have been
        collected to assess the phytoplankton community and characterize the physical parameters of
        Narragansett Bay.
      </>
    ),
  },
  {
    name: 'Domoic Acid',
    href: '/datasets/domoic-acid',
    description: () => (
      <>
        A survey of Domoic Acid, a neurotoxin produced by{' '}
        <span className="italic">Pseudo-nitzschia</span>, in Narragansett Bay between 2017 and 2019.
        This research was funded by{' '}
        <ExternalLink href="https://seagrant.gso.uri.edu/">Rhode Island Sea Grant</ExternalLink> and
        the <ExternalLink href="https://web.uri.edu/rinsfepscor/welcome/">RI C-AIM</ExternalLink>.
      </>
    ),
  },
  {
    name: 'Fish Trawl Survey',
    href: '/datasets/fish-trawl',
    description: () => (
      <>
        Survey of seasonal invertebrate and migratory fish populations in the Narragansett Bay,
        collected by the University of Rhode Island Graduate School of Oceanography.
      </>
    ),
  },
  {
    name: 'Stream Gage Data',
    href: '/datasets/stream-gage',
    description: () => (
      <>
        A map of water levels across streams and waterways in Rhode Island over the last 2 weeks.
        Data from the{' '}
        <ExternalLink href="https://waterservices.usgs.gov/">US Geological Survey</ExternalLink>.
      </>
    ),
  },
];

const EXTERNAL_RESOURCES = [
  {
    name: 'ERDDAP',
    description: 'The database that stores raw data for RIDDC.',
    href: `${ERDDAP_URL}/erddap/index.html`,
  },
  {
    name: 'Narragansett Bay Volume Viewer',
    description:
      'An accessible and interactive environment to explore and showcase volumetric Narragansett Bay data.',
    href: 'https://bay-viewer.riddc.brown.edu/',
  },
  {
    name: 'RIDDC Data Articles',
    description:
      'Articles and jupyter notebooks with stories, exploratory data analyses, and code examples using data stored in ERDDAP.',
    href: 'https://riddc-jupyter-book.web.app/notebooks/fox-kemper/first_example_aquarius.html',
  },
];
