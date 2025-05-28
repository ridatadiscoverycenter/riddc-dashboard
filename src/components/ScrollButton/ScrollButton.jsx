'use client';

import React from 'react';
import { ArrowUpCircleIcon } from '@heroicons/react/24/outline';

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState({}, document.title, window.location.pathname);
}

function useScrollPosition() {
  const [scroll, setScroll] = React.useState(window.scrollY);
  React.useEffect(() => {
    const doSetScroll = () => setScroll(window.scrollY);
    window.addEventListener('scroll', doSetScroll);
    return () => window.removeEventListener('scroll', doSetScroll);
  }, [setScroll]);
  return scroll;
}

export default function ScrollButton() {
  const scroll = useScrollPosition();

  return (
    <>
      {scroll !== 0 && (
        <div className="fab fixed bottom-0">
          <a type="button">
            <ArrowUpCircleIcon
              aria-hidden="true"
              className="flex flex-1 size-12"
              onClick={scrollToTop}
            />
          </a>
        </div>
      )}
    </>
  );
}
