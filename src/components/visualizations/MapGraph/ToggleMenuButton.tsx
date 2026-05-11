import { LeftIcon } from '@/components';

type ToggleMenuButtonProps = {
  opened: boolean;
  position: string;
  setOpened: (value: React.SetStateAction<boolean>) => void;
};

export function ToggleMenuButton({ opened, setOpened, position }: ToggleMenuButtonProps) {
  return (
    <button
      className={`z-50 p-2 bg-slate-100 rounded-md absolute motion-safe:transform-rotate duration-500 ease-in-out flex flex-row items-center justify-center gap-1 ${position}`}
      onClick={() => setOpened((v) => !v)}
    >
      {opened && <span className="text-sm text-black">Map</span>}
      <div className={`justify-items-center ${opened ? 'rotate-180' : 'rotate-0'}`}>
        <LeftIcon size={1} color="black" />
      </div>
      {!opened && <span className="text-sm text-black">Graph</span>}
    </button>
  );
}
