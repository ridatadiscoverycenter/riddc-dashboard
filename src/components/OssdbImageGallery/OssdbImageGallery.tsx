'use client';
import React from 'react';

import { gallery, type GalleryData } from './data';
import { OssdbGraphic } from './OssdbGraphic';

import { Card, Select } from '@/components';

const options = gallery.map(({ id, title }) => ({ label: title, value: id.toString() }));

export function OssdbImageGallery() {
  const [galleryId, setGalleryId] = React.useState(options[0]);
  const galleryItem = React.useMemo(
    () => gallery.find(({ id }) => galleryId.value === id.toString()) as GalleryData,
    [galleryId]
  );
  return (
    <Card>
      <Select
        label="Select a Graphic:"
        options={options}
        value={galleryId}
        defaultValue={options[0]}
        onChange={(newValue) => setGalleryId(newValue as { label: string; value: string })}
      />
      <OssdbGraphic data={galleryItem} />
    </Card>
  );
}
