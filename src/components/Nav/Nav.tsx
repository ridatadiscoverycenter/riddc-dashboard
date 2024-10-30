import { Link, RiddcLogo } from '@/components';

const LINK_HOVER_STYLES = 'text-white hover:text-cyan-200 transition-all duration-300 ease-in';

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex flex-row w-full p-2 gap-4 items-center text-xl bg-cyan-800 dark:bg-black dark:border-b-slate-400 dark:border-b">
      <Link href="/" className="flex flex-row items-center gap-4">
        <RiddcLogo size={3} />
        <h1 className={`sm:flex hidden font-bold ${LINK_HOVER_STYLES}`}>
          Rhode Island Data Discovery Center
        </h1>
        <h1 className={`sm:hidden font-bold ${LINK_HOVER_STYLES}`}>RIDDC</h1>
      </Link>
      <div className="flex-1" aria-hidden />
      <Link className="hidden sm:flex" href="/about">
        <h2 className={LINK_HOVER_STYLES}>About</h2>
      </Link>
      <Link className="hidden sm:flex" href="/glossary">
        <h2 className={LINK_HOVER_STYLES}>Glossary</h2>
      </Link>
      <a className="hidden sm:flex" href="https://pricaimcit.services.brown.edu/erddap/index.html">
        <h2 className={LINK_HOVER_STYLES}>ERDDAP</h2>
      </a>
      <Link href="/datasets">
        <h2 className={LINK_HOVER_STYLES}>Datasets</h2>
      </Link>
    </nav>
  );
}
