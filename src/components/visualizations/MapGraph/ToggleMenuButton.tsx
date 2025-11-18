import { LeftIcon } from '@/components';

type ToggleMenuButtonProps = {
  opened: boolean;
  position: string;
  setOpened: (value: React.SetStateAction<boolean>) => void;
};

export function ToggleMenuButton({ opened, setOpened, position }: ToggleMenuButtonProps) {
  return (
    <button
      className={`z-50 bg-slate-100 rounded-md absolute transform-rotate duration-500 ease-in-out ${opened ? 'rotate-180' : 'rotate-0'} ${position}`}
      onClick={() => setOpened((v) => !v)}
    >
      <LeftIcon size={2} color="black" />
      <span className="sr-only">{opened ? 'Hide Graph' : 'Show Graph'}</span>
    </button>
  );
}
