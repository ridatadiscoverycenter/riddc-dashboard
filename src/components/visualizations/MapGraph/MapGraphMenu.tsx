import { Header } from '@/components/Header';

type MapGraphMenuProps = {
  opened: boolean;
  header: string;
  subHead?: string;
};

export function MapGraphMenu({
  opened,
  header,
  subHead,
  children,
}: React.PropsWithChildren<MapGraphMenuProps>) {
  return (
    <menu
      className={`text-sm transition-all motion-reduce:transition-none z-50 absolute top-6 left-2 bg-slate-100/90 dark:bg-slate-800/90 rounded-md font-light p-2 flex flex-col gap-4 max-w-36 md:max-w-56 ${opened ? 'translate-x-[-24rem] md:translate-x-0 duration-500' : ''}`}
    >
      <Header tag="h3" size="sm" variant="impact">
        {header}
      </Header>
      {subHead && <p className="text-md md:text-lg leading-none md:leading-normal">{subHead}</p>}
      {children}
    </menu>
  );
}
