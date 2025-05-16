import { DetailedHTMLProps, HTMLAttributes } from 'react';

import './FullBleedColumn.css';

type FullBleedColumnProps = {
  className?: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>['className'];
};

export function FullBleedColumn({
  className = '',
  children,
}: React.PropsWithChildren<FullBleedColumnProps>) {
  return <article className={`full-bleed-column-wrapper ${className}`}>{children}</article>;
}
