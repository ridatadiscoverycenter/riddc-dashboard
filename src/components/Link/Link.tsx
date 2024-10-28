import * as Headless from '@headlessui/react';
import React, { forwardRef } from 'react';
import NextLink, { type LinkProps } from "next/link";

function LinkComponent(
  props: LinkProps & React.ComponentPropsWithoutRef<'a'>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <Headless.DataInteractive>
      <NextLink {...props} ref={ref} />
    </Headless.DataInteractive>
  );
}

export const Link = forwardRef(LinkComponent);
