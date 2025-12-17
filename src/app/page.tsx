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
                <ExternalLink href={href}>{name}</ExternalLink>
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
        variability on coastal ecosystems. The RI Data Discovery Center (RIDDC) is one of the
        efforts founded by the RI C-AIM consortium.
      </p>
      <p>
        This legacy continues with funding for the RIDDC through the NSF Rhode Island Network for
        Excellence in Science and Technology (
        <ExternalLink href="https://web.uri.edu/rinsfepscor/welcome-ri-nest/">RI-NEST</ExternalLink>
        ) and the Brown University{' '}
        <ExternalLink href="http://ecf.brown.edu">
          Equitable Climate Futures Initiative (ECF)
        </ExternalLink>
        . The RIDDC also supports data for efforts by the{' '}
        <ExternalLink href="https://www.uri.edu/news/2025/07/uri-awarded-7-million-nsf-grant-to-boost-research-excellence-in-environmental-microplastics/">
          NSF SIMCoast
        </ExternalLink>
        , <ExternalLink href="https://www.3crs.org/">NSF 3CRS</ExternalLink>, and{' '}
        <ExternalLink href="https://pamspublic.science.energy.gov/WebPAMSExternal/Interface/Common/ViewPublicAbstract.aspx?rv=6e7a1289-0296-4323-bba0-b0d8c6c575c9&rtc=24&PRoleId=10">
          DoE EPSCOR
        </ExternalLink>{' '}
        projects.
      </p>
      <p>
        The goal of the RI Data Discovery Center is to become the national and international
        go-to-source for data on the Narragansett Bay ecosystem, including neighboring land areas
        and hydrological basins in RI, MA, and CT. For researchers involved in these projects, the
        Data Discovery Center will become the site where they will store their data, share their
        data internally with other investigators and share their data externally with investigators
        around the world. If you are a researcher interested in environmental data in this region,
        please contact <ExternalLink href="mailto:baylor@brown.edu">Baylor Fox-Kemper</ExternalLink>{' '}
        to inquire, suggest, or add new datasets to the repository.
      </p>
      <p>
        In addition to new data collected by project investigators, RI Data Discovery Center will
        also collect and share historical data on the Narragansett Bay ecosystem. In addition to
        sharing data with scientists, RIDDC will also become the go-to-source where decision makers,
        land-use managers, relevant industries, citizen scientists and students can find data on the
        Narragansett Bay ecosystem.
      </p>
      <Header size="lg" variant="impact" className="w-full text-center">
        Current Leadership
      </Header>
      <Header size="md" className="w-full text-center">
        <ExternalLink href="https://web.uri.edu/rinsfepscor/welcome-ri-nest/">
          NSF RI-NEST Project
        </ExternalLink>
      </Header>
      <ul className="margin-auto grid sm:grid-cols-1 md:grid-cols-3 md:gap-8 gap-4">
        {NEST_LEADERSHIP.map(({ name, role, affiliations }) => (
          <li key={name}>
            <Card className="bg-white/30 hover:bg-white/80 dark:bg-white/10 hover:dark:bg-white/30 flex flex-col py-5">
              <Header size="md">{name}</Header>
              <p className="text-cyan-600 dark:text-cyan-200">{role}</p>
              {affiliations.map((affiliation) => (
                <p key={affiliation}>{affiliation}</p>
              ))}
            </Card>
          </li>
        ))}
      </ul>
      <Header size="md" className="w-full text-center mt-3">
        <ExternalLink href="http://ecf.brown.edu">
          Equitable Climate Futures Initiative
        </ExternalLink>
      </Header>
      <ul className="margin-auto grid sm:grid-cols-1 md:grid-cols-3 md:gap-8 gap-4">
        {CLIMATE_FUTURES_LEADERSHIP.map(({ name, role, affiliations }) => (
          <li key={name}>
            <Card className="bg-white/30 hover:bg-white/80 dark:bg-white/10 hover:dark:bg-white/30 flex flex-col py-5">
              <Header size="md">{name}</Header>
              <p className="text-cyan-600 dark:text-cyan-200">{role}</p>
              {affiliations.map((affiliation) => (
                <p key={affiliation}>{affiliation}</p>
              ))}
            </Card>
          </li>
        ))}
      </ul>
      <Header size="lg" variant="impact" className="w-full text-center mt-3">
        Past Leadership
      </Header>
      <Header size="md" className="w-full text-center">
        <Link href="https://web.uri.edu/rinsfepscor/welcome/">NSF C-AIM Project</Link>
      </Header>
      <ul className="margin-auto grid sm:grid-cols-1 md:grid-cols-3 md:gap-8 gap-4">
        {PAST_LEADERSHIP.map(({ name, affiliations }) => (
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
            <Image src={logoLight} height="100" alt={title} className="dark:hidden" />
            <Image src={logoDark} height="100" alt={title} className="hidden dark:block" />
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
        Contact us if you want us to host your Narragansett Bay related data! See our{' '}
        <Link href="/riddc_data_guidelines.pdf">data acceptance guidelines</Link>.
      </p>
    </FullBleedColumn>
  );
}

const NEST_LEADERSHIP = [
  {
    name: 'Dr. Elin Torell',
    role: 'RI NSF EPSCoR Principal Investigator',
    affiliations: ['Director of the Coastal Institute at the University of Rhode Island'],
  },
  {
    name: 'Dr. Jill Pipher',
    role: 'Brown U. Principal Investigator',
    affiliations: ['Elisha Benjamin Andrews Professor of Mathematics'],
  },
  {
    name: 'Dr. Baylor Fox-Kemper',
    role: 'Second Director of the RIDDC, Senior Personnel',
    affiliations: ['Department of Earth, Environmental, & Planetary Sciences, Brown University'],
  },
];

const CLIMATE_FUTURES_LEADERSHIP = [
  {
    name: 'Dr. Baylor Fox-Kemper',
    role: 'Second Director of the RIDDC, Faculty Co-Chair of ECF',
    affiliations: ['Professor of Earth, Environmental, & Planetary Sciences, Brown University'],
  },
  {
    name: 'Dr. Elizabeth Fussell',
    role: 'Faculty Co-Chair of the ECF',
    affiliations: [
      'Professor of Population Studies and Environment and Society (Research)',
      'Professor of Epidemiology (Research)',
    ],
  },
];

const PAST_LEADERSHIP = [
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
  // Page decomissioned until data is fixed. 
  /*
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
  */
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
        A map of stream gage height across streams and waterways in Rhode Island over the last 2
        weeks. Data from the{' '}
        <ExternalLink href="https://waterservices.usgs.gov/">US Geological Survey</ExternalLink>.
      </>
    ),
  },
  {
    name: 'Air Quality',
    href: '/datasets/breathe-pvd',
    description: () => (
      <>
        A map of air quality in Providence, RI. Data from the{' '}
        <ExternalLink href="https://www.breatheprovidence.com/">Breathe Providence</ExternalLink>{' '}
        team.
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
