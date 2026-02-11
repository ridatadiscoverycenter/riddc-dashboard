import { DomoicAcidMap, FullBleedColumn, Header, Link } from '@/components';
import { ERDDAP_URL } from '@/static/urls';
import { fetchDomoicAcidCoordinates, fetchDomoicAcidSample } from '@/utils/data/api/da';

export default async function DomoicAcid() {
  const samples = await fetchDomoicAcidSample();
  const stations = await fetchDomoicAcidCoordinates();

  return (
    <FullBleedColumn className="my-2 gap-4">
      <Header size="lg" variant="impact" tag="h1">
        Domoic Acid Dataset
      </Header>
      <p>
        This map on domoic acid concentrations in Narragansett Bay (NB) was generated from a
        research project carried out at the University of Rhode Island by Co-Principal Investigators
        Drs. Matthew Bertin and Bethany Jenkins and their research teams. This work was funded by
        Rhode Island Sea Grant and the Rhode Island Consortium for Coastal Ecology Assessment,
        Innovation, and Modeling (RI C-AIM).
      </p>
      <DomoicAcidMap samples={samples} stations={stations} />
      <Header size="md">Background</Header>
      <p>
        The project monitored species of the diatom{' '}
        <span className="italic">Pseudo-nitzschia (P-n)</span> and their production of the
        neurotoxin domoic acid at selected sites in NB, Rhode Island. While{' '}
        <span className="italic">P-n</span> species have been present in NB for over 50 years, the
        first Rhode Island shellfish harvest closure due to high levels of domoic acid in the
        plankton was not until October 2016. This precautionary closure, another subsequent closure
        in March 2017 due to domoic acid exceeding action limits in shellfish meat, and the
        continued detection of low levels of domoic acid suggests that either{' '}
        <span className="italic">P-n</span> species composition has changed to new toxic- producing
        strains of <span className="italic">P-n</span> in NB, or NB environmental conditions have
        shifted in favor of making resident <span className="italic">P-n</span> more toxic. The 2016
        and 2017 closures sparked interest in identifying environmental drivers that lead to
        increased domoic acid production as well as identifying <span className="italic">P-n</span>{' '}
        species composition in NB.
      </p>
      <Header size="md">Methods</Header>
      <p>
        Over a two-year period from September 2017 &ndash; November 2019, our research group has
        sampled NB weekly, collecting samples to measure various environmental factors such as
        dissolved nutrients, chlorophyll a, temperature, and salinity from the surface seawater.
        Additionally, we have monitored <span className="italic">P-n</span> species (through genetic
        analysis of DNA sequences), and the cell-associated domoic acid from phytoplankton samples
        using liquid chromatography-tandem mass spectrometry (LC- MS/MS). Our genetic methods can
        distinguish between <span className="italic">P-n</span> species and our analytical methods
        are very sensitive and can detect very low levels of domoic acid (ng domoic acid/L of
        seawater).
      </p>
      <Header size="md">Results</Header>
      <p>
        We have found seasonal differences in <span className="italic">P-n</span> species in NB and
        we have found a seasonal pattern in increased cell-associated domoic acid concentrations.
        All toxin concentrations are at low levels, and no closures occurred during the sampling
        period. Cell-associated domoic acid rises in the fall (September and October) and the late
        spring/early summer (May and June), and highest concentrations were observed at the sites
        closest to the entrance of NB. We hypothesize that these seasonally distinct{' '}
        <span className="italic">P-n</span> communities are responsible for low-level domoic acid
        production which likely contributed to the 2016 precautionary closure, while it appears a
        species new to NB, Pseudo-nitzschia australis, likely contributed to the 2017 closure.{' '}
        <span className="font-semibold">
          This map shows how cell-associated domoic acid increases and decreases over the sampling
          period. Sampling sites are shown with the concentration of domoic acid recorded on
          specific dates.
        </span>
      </p>
      <Header size="md">Impact</Header>
      <p>
        We hope this information will aid Rhode Island stakeholders by providing data following the
        2016 and 2017 closures on when, where, and what concentration of low- level cell-associated
        domoic acid is present. This is important as domoic acid can bioaccumulate in shellfish and
        cause illness in humans when consumed. While cooking does not destroy the toxin, live
        shellfish can naturally purge the toxin with time and become safe for consumption later.
        These domoic acid measurements and <span className="italic">P-n</span> species composition
        provide baseline data during a period of no closures for important context if additional
        closures were to occur in the future.
      </p>
      <Header size="md">Acknowledgments</Header>
      <p>
        Thanks to Dr. Tatiana Rynearson, Jacob Strock, Jessica Carney, Nina Santos, Captain Stephen
        Barber on the R/V Cap&apos;n Bert, Dr. Harold “Bud” Vincent II on the R/V Hope Hudner, and
        Steve Granger on the R/V Zostera for assistance with sampling.
      </p>
      <p>
        We thank graduate and undergraduate researchers and other research personnel Alexa Sterling,
        Riley Kirk, Katherine Bell, Dr. Laura Holland, Marissa Caponi, Meagan King, Emily McDermith,
        Erin Tully, Samantha Vaverka, Patrick Wilson, Stephanie Anderson, and Jorge Vazquez-Custodio
        for sampling assistance.
      </p>
      <Header size="md">Learn More</Header>
      <p>
        The full dataset used to power this app is available{' '}
        <Link href={`${ERDDAP_URL}/erddap/tabledap/da_4566_36f0_124a.html`}>on ERDDAP</Link>. If
        using this data, please cite the ERDDAP dataset.
      </p>
    </FullBleedColumn>
  );
}
