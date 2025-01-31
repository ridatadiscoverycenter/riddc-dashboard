import { HardRefreshLink } from '../Link';

type GraphErrorPanelProps = {
  error?: string;
  links: {
    href: string;
    description: string;
  }[];
};

export function GraphErrorPanel({ error, links }: GraphErrorPanelProps) {
  return (
    <>
      {error ? (
        <div className="w-full rounded-md under p-4 bg-rose-400 dark:bg-rose-600">{error}</div>
      ) : (
        <p className="text-black">
          Generate a line plot using the dropdown menus to compare data points from buoys in the
          dataset! Select some buoys, up to four variables, and a time range to start exploring. Or,
          choose one of the examples below.
        </p>
      )}
      <p className="text-black">Want some examples?</p>
      {links.map(({ href, description }) => (
        <HardRefreshLink
          key={href}
          href={href}
          className="no-underline w-full bg-cyan-300 hover:bg-cyan-400 focus:bg-cyan-400 dark:bg-cyan-700 hover:dark:bg-cyan-600 focus:dark:bg-cyan-600 p-2 rounded-md drop-shadow-md hover:drop-shadow-lg focus:drop-shadow-lg"
        >
          {description}
        </HardRefreshLink>
      ))}
    </>
  );
}
