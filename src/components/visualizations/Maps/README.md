# RIDDC Visualizations -- Map Libre

Placeholder readme to describe how to make a Map Libre visualization.

### Base Code

```tsx
'use client';
import React from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useMap } from './useMap';

export function MapBase() {
  const { containerRef, /*map,*/ loaded } = useMap();
  React.useEffect(() => {
    // Do "on load" map actions
  }, [loaded]);
  return <div className="h-64 w-64" ref={containerRef} />;
}

```
