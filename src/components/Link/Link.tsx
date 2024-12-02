import * as Headless from '@headlessui/react';
import React from 'react';
import NextLink, { type LinkProps as NextLinkProps } from 'next/link';

const BASE_STYTLES = 'underline transition duration-500';
const LINK_STYLES = `${BASE_STYTLES} hover:text-teal-500 dark:hover:text-teal-300`;

export type LinkProps = NextLinkProps & React.ComponentPropsWithoutRef<'a'>;

function LinkComponent(props: LinkProps, ref: React.ForwardedRef<HTMLAnchorElement>) {
  return (
    <Headless.DataInteractive>
      <NextLink
        {...props}
        className={props.className ? `${props.className} ${BASE_STYTLES}` : LINK_STYLES}
        ref={ref}
      />
    </Headless.DataInteractive>
  );
}

function ExternalLinkComponent(props: LinkProps, ref: React.ForwardedRef<HTMLAnchorElement>) {
  return (
    <Headless.DataInteractive>
      <a
        {...props}
        className={props.className ? `${props.className} ${BASE_STYTLES}` : LINK_STYLES}
        ref={ref}
      />
    </Headless.DataInteractive>
  );
}

export const Link = React.forwardRef(LinkComponent);
export const ExternalLink = React.forwardRef(ExternalLinkComponent);
