import React from 'react';

const BASE_STYLES = 'flex flex-col gap-3';

export function Form({
  className,
  children,
  ...props
}: React.PropsWithChildren<
  React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
>) {
  return (
    <form {...props} className={`${BASE_STYLES} ${className || ''}`}>
      {children}
    </form>
  );
}
