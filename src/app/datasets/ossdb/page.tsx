import { ExternalLink, FullBleedColumn, Header } from '@/components';

export default function Ossdb() {
  return (
    <FullBleedColumn className="my-2 gap-4 w-full">
      <Header size="lg">Ocean State Spatial Database</Header>
      <p>
        The Ocean State Spatial Database (
        <ExternalLink href="https://github.com/Brown-University-Library/geodata_ossdb">
          OSSDB
        </ExternalLink>
        ) is a geodatabase created by the Brown University Library{' '}
        <ExternalLink href="https://libguides.brown.edu/geodata/">GeoData@SciLi</ExternalLink> team,
        for conducting basic geographic analysis and thematic mapping within the State of Rhode
        Island. This database contains geographic features and data compiled from several public
        sources, and is intented to serve as a basic foundation for mapping projects in Rhode
        Island.
      </p>
      <p>
        This data is hosted publically on{' '}
        <ExternalLink href="https://github.com/Brown-University-Library/geodata_ossdb#downloads">
          Github
        </ExternalLink>{' '}
        and can be{' '}
        <ExternalLink href="https://github.com/Brown-University-Library/geodata_ossdb/raw/main/current_db/ossdb_sqlite.zip">
          downloaded as a full SQLite file
        </ExternalLink>
        .
      </p>
    </FullBleedColumn>
  );
}
