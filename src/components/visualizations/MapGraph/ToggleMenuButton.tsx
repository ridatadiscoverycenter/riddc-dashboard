import { LeftIcon } from '@/components';

type ToggleMenuButtonProps = {
  opened: boolean;
  position: string;
  setOpened: (value: React.SetStateAction<boolean>) => void;
};

export function ToggleMenuButton({ opened, setOpened, position }: ToggleMenuButtonProps) {
  return (
    <button
      className={`z-50 w-[45px] bg-slate-100 rounded-md absolute aspect-square transform-rotate duration-500 ease-in-out  ${position}`}
      onClick={() => setOpened((v) => !v)}
    >
      <div className={`justify-items-center ${opened ? 'rotate-180' : 'rotate-0'}`}>
        <LeftIcon size={1} color="black" />
      </div>
      <div className="text-sm">{opened ? 'Map' : 'Graph'}</div>
    </button>
  );
}
