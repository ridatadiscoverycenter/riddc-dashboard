# RIDDC Visualizations -- Vega

When copying over a visualization from the original Buoy Viewer site, there's a whole bunch of steps you're going to need to go through to get the visualization working in this new Next JS / React context. This document should help walk you through the steps involved to make sure you haven't missed anything.

If, while you're creating visualizations, you notice that something here is missing or unclear, feel free to edit this README to include the needed information.

**Table of Contents**

- [Fetching Data](#fetching-data)
- [The Base Component](#the-base-component)
- [Copying a Vega Spec](#copying-a-vega-spec)

## Fetching Data

Before you can start on your visualization, you're going to need the data to make the visualization, All of this interface work is handled in `@/utils/erddap`. 

- If you're fetching data from the `buoy-api`, handle your fetches in `@/utils/erddap/api`.
- If you're fetching data from ERDDAP directly, hanlde your fethces in `@/utils/erddap/db`.

When fetching data, you're probably going to have to shape the data into something a little more ergonomic. Follow these rules of thumb:

1. In most circumstances, the data should be a flat array of JS objects.
1. The keys of these JS objects should all follow a standard JS style camel-case.
1. Validate data coming from either ERDDAP or the `buoy-api` with `zod`, and gracefully handle any errors that come up in this process.
1. Define the types of these objects on a Typescript level, and export these for use throughout the application. You should be able to use `zod` to define these TS types. 

Examples for how to approach all of this can be found in `@/utils/erddap`.

When fetching data, keep all fetching functions in `@/app` when possible. This keeps the `@/components` folder focused on specific reusable UI components (both server and client).

## The Base Component

The following code should act as a base starting point for any new visualization.

```tsx
"use client";
import React from 'react';
import { Vega, VisualizationSpec } from 'react-vega';

import { Loading } from '@/components';
import { Size, useScreenSize } from '@/hooks/useScreenSize';

type VisualizationProps = {
  data: WhateverYourDataTypeIs[];
};

function getGraphicWidth(size: Size | undefined) {
  // Some default width in pixels
  return 500;
}

export function Visualization({ data }: VisualizationProps) {
  const size = useScreenSize();
  const spec = React.useMemo(() => ({ /* Add spec here */ }), [data, size]);
  if (size === undefined) {
    return (
      <div className="h-[300px] flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  return <Vega spec={spec} actions={false} />;
}
```

But there's a lot going on here. 

1. `"use client";`: This directive is added to the top of visualizations because the React Vega library is dynamically inserting an element in a beyond React layer, and as such cannot be rendered on the server side. If you omit this, you'll probably get a complilation error.
1. Prop Types: You're going to be passing data of some sort to this component. Type the `data` prop as whatever data type this is. This should probably be imported from `@/types` or `@/utils` depending on the kind of data this is. Refer to the existing visualizations for reference. 
1. `getGraphicWidth`: As per an existing issue on GitHub, these visualizations will not resize dynamically based on the current window size. To account for visualizations on a variety of screen widths, manually define the graphic widths for specific layout breakpoints. The easiest way to determine these sizes is to set your window width to just above a breakpoint, and adjust the graphic width to its maximum size. Then, repeat this process for each breakpoint. It might be worth adding a `console.log({ size });` inside the component to find these boundary points. You're probably going to want to wait to do this step until you have the spec copied over.
1. `spec`: The "spec" is the schema that's used to create a Vega visualization. It's a big JSON file with a lot of quirks to it. For more information on how the spec works, you can read [Vega's documentation](https://vega.github.io/). There will be information in [a later section](#copying-a-vega-spec) on how to copy a spec from an existing visualization.
1. `<Loading />`: As long as we're manually defining the size of the graphic based on the `useScreenSize` hook, we're going to need to code around the fact that `size` (the current screen size) might not always be known. (This happens because Next JS tries to render this component on the backend where there isn't a `window`. And, without a `window`, it can't determine a `size`.) So, displaying the `<Loading />` spinner while `size === undefined` means that the initial render of the page doesn't attempt to display unsized Vega components. Instead, Next JS is about to wait until it has the requisite information to display the graphics.

## Copying a Vega Spec

If you're copying a spec from the [Buoy Viewer](https://github.com/ridatadiscoverycenter/buoy-viewer), you'll have better luck copying the spec from the [Vega Explorer](https://vega.github.io/editor/) than from the codebase itself. The Vega Explorer is a playground that lets you alter a spec for a Vega visualization outside the context of a website. This can be really helpful in isolating a bug, or figuring out how Vega wants you to handle a specific kind of visualization. For our purposes here, it's also easier / more consistent to copy-paste from the Vega explorer than it is from the Vue component in the Buoy Viewer.

To open an existing visualization in the Vega Explorer, start up a local instance of the Buoy Viewer on your machine. Find the visualization you're trying to copy in the codebase, and find the call to the `useVega` composable (you might have to sort through a few parent / child components to so), and change the `includeActions` field to `true`.

For example, in the [`LineChart`](https://github.com/ridatadiscoverycenter/buoy-viewer/blob/264a2cd1d27f9f6bb54ddb9f3eda82cf985fd55b/src/components/charts/LineChart.vue#L449-L454) component, you'd be changing the code like so:

```js
useVega({
  spec,
  el,
  maxWidth: ref(1280),
  // Replace this line:
  includeActions: ref(false),
  // With this line:
  // includeActions: ref(true),
});
```

Then, navigate to the visualization on your local version of the Buoy Viewer website. You should see a circle-meatball menu floating on the top right of the visualization. Click it to open it up in the "Vega Explorer". Copy this spec to the `React.useMemo` call, but make sure to replace the long array of data with the data prop to the component. There might still be bugs or errors after this point, but this should give you the best shot at "copy-paste"-able Vega spec. If this isn't working, you can try moving over sections at a time, making sure each one behaves as intended (`scales`, `legends`, and `axes` tend to be most stable).
