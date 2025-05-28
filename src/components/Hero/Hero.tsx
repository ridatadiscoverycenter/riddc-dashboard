import NarBay from '@/components/Image/NarBay';
import { Button } from '@/components';

export function Hero({ className }: { className: string }) {
  return (
    <div className={`relative overflow-hidden w-full ${className}`}>
      <div className="inset-0 -z-10 size-full object-cover">
        <NarBay />
        <div className="absolute max-w-2xl" style={{ bottom: 20, left: 10 }}>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-balance text-white sm:text-7xl ">
              Rhode Island Data Discovery Center
            </h1>
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
      </div>
    </div>
  );
}
