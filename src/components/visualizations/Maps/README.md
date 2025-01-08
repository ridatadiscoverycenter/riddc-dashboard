# RIDDC Visualizations -- Map Libre

For map style visualizations in this Dashboard, we're using a combination of Maplibre + MapTiler to get the job done. Maplibre handles that visualization component, and MapTiler fetches map tiles based on zoom level and such. [Maplibre](https://maplibre.org/) is free and open source, but [MapTiler](https://www.maptiler.com/) is a paid service with a generous free tier. If you need to access the account, CCV-Bot has the login information.

## Getting Started

Here's some example code to get you started with a new component.

```tsx
'use client';
import React from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useMap } from './useMap';

export function YourVisualization() {
  const { containerRef, /*map,*/ loaded } = useMap();
  React.useEffect(() => {
    // Do "on load" map actions
  }, [loaded]);
  return <div className="h-64 w-64" ref={containerRef} />;
}
```

1. Maplibre uses JavaScript to attach elements to the DOM dynamically. This has Implications, but for our purposes now, all we need to know is that map visualizations need to be client components.
1. To make sure the map is styled correctly, we also need to import the Maplibre stylesheet. Omitting this will cause your visualization to not render (I think).
1. `useMap` is a hook that handles most of the MapLibre specific interactions. It returns two `ref`'s (one for the container and one for the map itself), and a boolean `loaded` that says if the map has "loaded".
1. The `useEffect` here is optional, but is useful if you need to perform actions after the map has loaded. Eg, loading data or adding elements to the map.
1. The `<div />` needs to be passed the `containerRef` from the `useMap` hook, and **an explicit width and height need to be set**. Without a width and height, the container with have a width and height of zero, and not display. It's very upsetting.

From here on, the [Maplibre documentation](https://maplibre.org/maplibre-gl-js/docs/examples/) will be your best friend. There's a plethora of examples, and you should be able to figure out what you need to do.