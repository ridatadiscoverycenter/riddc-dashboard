export function Card({ children }: React.PropsWithChildren) {
  return (
    <section className="h-full flex flex-col gap-2 rounded-lg drop-shadow-md hover:drop-shadow-lg transition duration-500 bg-white dark:bg-black border-2 border-white dark:border-gray-500 p-4">
      {children}
    </section>
  );
}