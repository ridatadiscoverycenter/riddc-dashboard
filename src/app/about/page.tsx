import { Card, Link } from '@/components';

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
      <h1 className="w-full text-center text-4xl font-header mt-4">
        About the Rhode Island Data Discovery Center
      </h1>
      <p className="margin-auto px-4 mx-4 text-lg">
        The National Science Foundation in 2017 awarded the University of Rhode Island with a grant
        to establish a statewide research consortium — the RI Consortium for Coastal Ecology
        Assessment, Innovation, and Modeling (RI C-AIM) — to study the effects of climate
        variability on coastal ecosystems. The RI Data Discovery Center is one of the efforts of RI
        C-AIM consortium. The goal of the RI Data Discovery Center is to become the national and
        international go-to-source for data on the Narragansett Bay ecosystem. For C-AIM
        investigators pursuing the research goals of the Integrated Bay Observatory, Predicting
        Ecosystem Response and Visualization & Imaging, RI Data Discovery Center will become the
        site where they will store their data, share their data internally with other C-AIM
        investigators and share their data externally with investigators around the world. In
        addition to new data collected by C-AIM investigators, RI Data Discovery Center will also
        collect and share historical data on the Narragansett Bay ecosystem. In addition to sharing
        data with scientists, RIDDC will also become the go-to-source where decision makers,
        land-use managers, relevant industries, citizen scientists and students can find data on the
        Narragansett Bay ecosystem.
      </p>
      <h2 className="w-full text-center text-4xl font-header mt-8">Leadership</h2>
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
      <h2 className="w-full text-center text-4xl font-header mt-8">Data Acceptance Guidelines</h2>
      <p className="margin-auto px-4 mx-4 mb-4 text-lg">
        Contact us if you want us to host your Narragansett Bay related data! See our data
        acceptance guidelines{' '}
        <Link href="https://riddc.brown.edu/files/riddc_data_guidelines.pdf">here</Link>.
      </p>
    </>
  );
}
