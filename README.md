# RIDDC Buoy Dashboard

This is the Next JS re-write of the Buoy Viewer (originally written in Vue). Styling is provided through Tailwind CSS.

## Development

Install the dependencies through `npm` and start the development server.

```bash
npm run install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

After making changes to the code, format your code with Prettier using the following script.

```bash
npm run format
```

When you commit changes, `husky` will automatically format your code as well.

## Deployments

This application is deployed through Firebase App Hosting, and a new version is rolled out whenever a new commit is pushed to `main`. After a Pull Request is merged, a new deployment should be visibile after Firebase finished the build process.

## Tests

This application includes some tests written with [Playwright](link) to validate the fetching of data from the `buoy-api` and ERDDAP Database. To run these tests, run the following script:

```bash
npm run test
```

## Visualization

Visualizations in this application are created with [Vega](https://vega.github.io/) and displayed using the [React Vega](https://www.npmjs.com/package/react-vega) library. All the visualizations are located in `src/components/visualizations`.