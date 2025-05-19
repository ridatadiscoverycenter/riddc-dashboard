import React from 'react';
import { twMerge } from 'tailwind-merge';

//import { Link } from "../Link";

const BASE_STYLES =
  'h-full flex flex-col gap-2 rounded-lg drop-shadow-md transition duration-500 p-4';
const COLOR_STYLES = 'bg-white dark:bg-black border-white dark:border-gray-500 border-2';

type CardProps = {
  className?: string;
};

export function Card({ className = '', children }: React.PropsWithChildren<CardProps>) {
  //<a onClick={(e) => {}}></a>
  //<button onClick={(e) => {}}></button>
  return (
    <section
      className={twMerge(BASE_STYLES, className ? className : COLOR_STYLES)}
      /* https://design-system.w3.org/components/cards.html#block-link-cards */ data-component="card"
    >
      {children}
    </section>
  );
}

/*
export function LinkCard({ Link, children }: React.PropsWithChildren<{ Link: React.FC }>) {
  r
} 

export function LinkForLinkCard({ ref }: { ref: Parameters<(typeof Link)>["0"]["ref"] } ) {

} */
