'use client';
import React from 'react';

import { Button, Select } from '@/components';

export function AboutSpecies({ fishSpecies }) {
  console.log(fishSpecies);
  const [species, setSpecies] = React.useState();
  return (
    <>
      <h2 className="text-xl font-header font-bold">Learn more</h2>
      <form className="self-stretch relative">
        <Select forceLight options={fishSpecies} label="Select a species:" dataset="na"></Select>
      </form>
      <Button
        href={`/species/${species}`}
        className="sm:px-[calc(theme(spacing.10)-1px)] sm:py-[calc(theme(spacing[5])-1px)] sm:text-xl"
      >
        About
      </Button>
    </>
  );
}
