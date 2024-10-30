import { Waves, Link } from '@/components';
import { BrownLogo, GithubLogo, NsfLogo, RicaimLogo, ThreeCrsLogo, UriLogo } from '../Logo';

const LOGO_SIZE = 5;
const QUICK_LINKS_COLOR = 'hover:text-cyan-200 transition-all duration-300 ease-in';

export function Footer() {
  return (
    <footer className="flex flex-col items-center overflow-clip gap-4 bg-cyan-100 dark:bg-black dark:border-t dark:border-white text-slate-800 dark:text-slate-200 pt-4 text-xs">
      <div className="flex items-center justify-around flex-wrap gap-4 mx-8 dark:bg-cyan-100 rounded-md">
        <RicaimLogo size={LOGO_SIZE} />
        <UriLogo size={LOGO_SIZE - 2} />
        <ThreeCrsLogo size={LOGO_SIZE} />
        <BrownLogo size={LOGO_SIZE - 1} />
        <NsfLogo size={LOGO_SIZE} />
      </div>
      <p className="text-justify m-2 max-w-[65ch] ">
        This material is based upon work conducted by the Rhode Island Consortium for Coastal
        Ecology Assessment, Innovation & Modeling (RI C-AIM), and supported in full by the National
        Science Foundation EPSCoR Cooperative Agreement 1655221. Any opinions, findings, and
        conclusions or recommendations expressed in this material are those of the author(s) and do
        not necessarily reflect the views of the National Science Foundation.
      </p>
      <p className="">© {new Date().getFullYear()} RI Data Discovery Center</p>
      <div className="flex flex-col gap-2 items-center">
        <h2 className="font-bold">Quick Links:</h2>
        <ul className="flex flex-row flex-wrap items-baseline gap-4 underline">
          <li>
            <Link className={QUICK_LINKS_COLOR} href="/">
              Home
            </Link>
          </li>
          <li>
            <Link className={QUICK_LINKS_COLOR} href="/about">
              About
            </Link>
          </li>
          <li>
            <Link className={QUICK_LINKS_COLOR} href="/glossary">
              Glossary
            </Link>
          </li>
          <li>
            <a
              className={QUICK_LINKS_COLOR}
              href="https://pricaimcit.services.brown.edu/erddap/index.html"
            >
              ERDDAP
            </a>
          </li>
          <li>
            <Link className={QUICK_LINKS_COLOR} href="/datasets">
              Datasets
            </Link>
          </li>
          <li>
            <a
              className={`${QUICK_LINKS_COLOR} flex flex-row items-center gap-1`}
              href="https://github.com/brown-ccv/buoy-dashboard"
            >
              Code on GitHub <GithubLogo size={1} />
            </a>
          </li>
        </ul>
      </div>
      <div className="pointer-events-none max-h-12 sm:max-h-36 overflow-clip">
        <Waves />
      </div>
    </footer>
  );
}
