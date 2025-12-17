'use client';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { LeftIcon, Link } from '@/components';

type DatasetShortcutProps = {
  className?: string;
};

export function DatasetShortcut({ className = '' }: DatasetShortcutProps) {
  return (
    <Popover className="relative">
      {({ close }) => (
        <>
          <PopoverButton className={`${className} flex flex-row gap-1 items-baseline`}>
            <span>Datasets</span>
            <div className="-rotate-90">
              <LeftIcon color="#FFFFFF" size={1} />
            </div>
          </PopoverButton>
          <PopoverPanel
            anchor="bottom"
            className="mt-6 rounded-md p-4 bg-white/80 dark:bg-gray-800/80 z-50"
          >
            <ul className="flex flex-col gap-4">
              {DATASETS.map(({ name, href }) => (
                <li key={href} className="w-full flex">
                  <Link
                    href={href}
                    onClick={() => close()}
                    className="text-lg font-light w-full py-1 px-2 rounded-md bg-cyan-300 hover:bg-cyan-400      focus:bg-cyan-400 dark:bg-cyan-800 dark:hover:bg-cyan-500 dark:focus:bg-cyan-500"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}

// Note (AM): I would love to not have to copy-paste this from src/app/page.tsx.
// Not sure if this *belongs* in utils/, but I'm happy to move this if people
// have different ideas.

const DATASETS = [
  {
    name: 'Rhode Island Buoys',
    href: '/datasets/rhode-island-buoys',
  },
  {
    name: 'Massachusetts Buoys',
    href: '/datasets/massachusetts-buoys',
  },
  // Page decomissioned until data is fixed.
  /*
  {
    name: 'Real Time Data',
    href: '/datasets/real-time',
  },
  */
  {
    name: 'Ocean State Ocean Model',
    href: '/datasets/osom',
  },
  {
    name: 'Plankton Time Series',
    href: '/datasets/plankton',
  },
  {
    name: 'Domoic Acid',
    href: '/datasets/domoic-acid',
  },
  {
    name: 'Fish Trawl Survey',
    href: '/datasets/fish-trawl',
  },
  {
    name: 'Stream Gage Data',
    href: '/datasets/stream-gage',
  },
  {
    name: 'Breathe Providence',
    href: '/datasets/breathe-pvd',
  },
];
