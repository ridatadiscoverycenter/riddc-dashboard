import FishLite from '@/components/visualizations/example';

export default function Home() {
  return (
    <main>
      <h1>RIDDC Buoy Viewer</h1>
      <h2>Explore the datasets~</h2>
      <ul>
        <li>Rhode Island Buoys (NBFSMN)</li>
        <li>Massachusetts Buoys (MassDEP / NBFSMN)</li>
        <li>Real Time Data</li>
        <li>Ocean State Ocean Model</li>
        <li>Plankton Time Series</li>
        <li>Domoic Acid</li>
        <li>Fish Trawl Survey</li>
      </ul>
      <h2>About</h2>
      <p>Text</p>
      <h2>Glossary</h2>
      <p>Text</p>
      <FishLite
        data={[
          { a: '1', b: 1 },
          { a: '2', b: 1 },
          { a: '3', b: 1 },
          { a: '4', b: 1 },
        ]}
      />
    </main>
  );
}
