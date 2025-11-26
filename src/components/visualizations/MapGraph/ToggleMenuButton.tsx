import { LeftIcon } from '@/components';

type ToggleMenuButtonProps = {
  opened: boolean;
  position: string;
  setOpened: (value: React.SetStateAction<boolean>) => void;
};

export function ToggleMenuButton({ opened, setOpened, position }: ToggleMenuButtonProps) {
  return (
    <button
      className={`z-50 px-2 bg-slate-100 rounded-md absolute transform-rotate duration-500 ease-in-out  ${position}`}
      onClick={() => setOpened((v) => !v)}
    >
      <div className={`justify-items-center ${opened ? 'rotate-180' : 'rotate-0'}`}>
        <LeftIcon size={2} color="black" />
      </div>

      <span>{opened ? 'Map' : 'Graph'}</span>
    </button>
  );
}
