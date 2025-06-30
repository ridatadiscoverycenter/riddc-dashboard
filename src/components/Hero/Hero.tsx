import NarBay from '@/components/Image/NarBay';
import { Button, FullBleedColumn, Header } from '@/components';

export function Hero({ className }: { className: string }) {
  return (
    <div className={`relative overflow-hidden w-full min-h-80 max-h-[60vh] ${className}`}>
      <NarBay className="min-h-96 object-cover" />
      <FullBleedColumn className="absolute bottom-0 sm:bottom-[10%] lg:bottom-[20%] left-0 w-full my-4">
        <Header size="hero" variant="impact" colorMode="dark" className="text-center">
          Rhode Island Data Discovery Center
        </Header>
        <ul className="flex flex-row justify-center gap-8 mt-4 sm:mt-8">
          <li>
            <Button
              href="#datasets"
              className="w-40 sm:px-[calc(theme(spacing.10)-1px)] sm:py-[calc(theme(spacing[5])-1px)] sm:text-xl"
              color="cyan"
            >
              Explore Data
            </Button>
          </li>
          <li>
            <Button
              href="#about"
              className="w-40 sm:px-[calc(theme(spacing.10)-1px)] sm:py-[calc(theme(spacing[5])-1px)] sm:text-xl"
              color="cyan"
            >
              About
            </Button>
          </li>
        </ul>
      </FullBleedColumn>
    </div>
  );
}
