'use client';
import React from 'react';

import { Button, Select } from '@/components';
type AboutSpeciesProps = {
  fishSpecies: { label: string; value: string }[];
};

export function AboutSpecies({ fishSpecies }: AboutSpeciesProps) {
  const [species, setSpecies] = React.useState();
  return (
    <>
      <h2 className="text-2xl font-header font-bold">Explore</h2>
      <p>Learn more about a species from the Fish Trawl!</p>
      <form className="self-stretch relative">
        <Select
          forceLight
          options={fishSpecies}
          label="Select a species:"
          dataset="na"
          onChange={(e) => setSpecies(e.label)}
        ></Select>
      </form>
      <Button
        href={`fish-trawl/${species}`}
        className={`sm:px-[calc(theme(spacing.10)-1px)] sm:py-[calc(theme(spacing[5])-1px)] sm:text-xl ${species === undefined ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        About
      </Button>
    </>
  );
}
