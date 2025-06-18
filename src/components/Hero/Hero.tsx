import NarBay from '@/components/Image/NarBay';
import { Button, Header } from '@/components';

export function Hero({ className }: { className: string }) {
  return (
    <div className={`relative overflow-hidden w-full min-h-80 ${className}`}>
      <NarBay />
      <div className="-z-10 size-full object-cover"></div>
      <div className="absolute max-w-2xl bottom-0 left-2 flex flex-col gap-2">
        <Header
          size="hero"
          variant="impact"
          colorMode="dark"
          className="tracking-tight text-balance"
        >
          Rhode Island Data Discovery Center
        </Header>
        <div className="mt-5 sm:mt-10 flex items-center gap-x-6">
          <Button
            href="#about"
            className="sm:px-[calc(theme(spacing.10)-1px)] sm:py-[calc(theme(spacing[5])-1px)] sm:text-xl"
          >
            About
          </Button>
          <Button
            href="#datasets"
            className="sm:px-[calc(theme(spacing.10)-1px)] sm:py-[calc(theme(spacing[5])-1px)] sm:text-xl"
          >
            Explore Data
          </Button>
        </div>
      </div>
    </div>
  );
}
