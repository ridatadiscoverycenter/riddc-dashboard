import NarBay from '@/components/Image/NarBay';
import { Button, FullBleedColumn, Header } from '@/components';

export function Hero({ className }: { className: string }) {
  return (
    <div className={`relative overflow-hidden w-full min-h-80 max-h-[60vh] ${className}`}>
      <NarBay className="min-h-96 object-cover" />
      <FullBleedColumn className="absolute bottom-0 sm:bottom-[10%] lg:bottom-[20%] left-0 w-full my-4">
        <Header
          size="hero"
          variant="impact"
          colorMode="dark"
          //className="tracking-tight text-balance"
        >
          Rhode Island Data Discovery Center
        </Header>
        <ul className="flex flex-row gap-8 mt-4 sm:mt-8">
          <li>
            <Button
              href="#about"
              className="sm:px-[calc(theme(spacing.10)-1px)] sm:py-[calc(theme(spacing[5])-1px)] sm:text-xl"
              color="cyan"
            >
              About
            </Button>
          </li>
          <li>
            <Button
              href="#datasets"
              className="sm:px-[calc(theme(spacing.10)-1px)] sm:py-[calc(theme(spacing[5])-1px)] sm:text-xl"
              color="cyan"
            >
              Explore Data
            </Button>
          </li>
        </ul>
      </FullBleedColumn>
    </div>
  );
}
/*
      <div className="absolute max-w-2xl bottom-0 left-2 flex flex-col gap-2">
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
      */
