'use client';
import { usePathname } from 'next/navigation';
import { Link, ExternalLink, RiNestLogo } from '@/components';

type HomeLinkProps = {
  className?: string;
};

export function HomeLink({ className = '' }: HomeLinkProps) {
  const pathname = usePathname();
  if (pathname !== '/') {
    return (
      <Link href="/" className={className}>
        <LinkContents />
      </Link>
    );
  }
  return (
    <div className={className}>
      <LinkContents />
    </div>
  );
}

function LinkContents() {
  return (
    <h1 className="flex flex-row items-center gap-4 text-2xl">
      <ExternalLink href="https://web.uri.edu/rinsfepscor/rinest/">
        <RiNestLogo size={4.5} variant="white" />
      </ExternalLink>
      <span className="sm:flex hidden whitespace-nowrap">Rhode Island Data Discovery Center</span>
      <span className="sm:hidden">RIDDC</span>
    </h1>
  );
}
