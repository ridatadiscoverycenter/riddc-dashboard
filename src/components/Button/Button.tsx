'use client';

import React from 'react';
import { clsx } from 'clsx';

import { styles, type Color } from './styles';
import { TouchTarget } from './TouchTarget';
import { Link } from '@/components/Link';

export type ButtonProps = (
  | { color?: Color; outline?: never; plain?: never }
  | { color?: never; outline: true; plain?: never }
  | { color?: never; outline?: never; plain: true }
) & { className?: string; children: React.ReactNode } & (
    | Omit<React.ComponentPropsWithoutRef<'button'>, 'className'>
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
  );

export const Button = React.forwardRef(function Button(
  { color, outline, plain, className, children, ...props }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  const classes = clsx(
    className,
    styles.base,
    outline
      ? styles.outline
      : plain
        ? styles.plain
        : clsx(styles.solid, styles.colors[color ?? 'dark/zinc'])
  );

  return 'href' in props ? (
    <Link {...props} className={classes} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
      <TouchTarget>{children}</TouchTarget>
    </Link>
  ) : (
    <button
      {...props}
      className={clsx(classes, 'cursor-default')}
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
    >
      <TouchTarget>{children}</TouchTarget>
    </button>
  );
});
