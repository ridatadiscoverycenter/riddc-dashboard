'use client';
import React from 'react';

import { Button, Form, Select } from '@/components';

type AboutSpeciesProps = {
  fishSpecies: { label: string; value: string }[];
};

export function AboutSpecies({ fishSpecies }: AboutSpeciesProps) {
  const [species, setSpecies] = React.useState(fishSpecies[0]);
  return (
    <>
      <h2 className="text-2xl font-header font-bold">Explore</h2>
      <p>Learn more about a species from the Fish Trawl!</p>
      <Form className="self-stretch relative">
        <Select
          forceLight
          defaultValue={fishSpecies[0]}
          options={fishSpecies}
          label="Select a species:"
          onChange={(e) => setSpecies(e as { label: string; value: string })}
        />
      </Form>
      <Button
        href={`fish-trawl/${species.label}`}
        className={`sm:px-[calc(theme(spacing.10)-1px)] sm:py-[calc(theme(spacing[5])-1px)] sm:text-xl`}
      >
        Explore!
      </Button>
    </>
  );
}
