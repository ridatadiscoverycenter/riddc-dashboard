'use client';
import { usePathname } from 'next/navigation';
import { Link, ExternalLink, RiNestLogo } from '@/components';

type HomeLinkProps = {
  className?: string;
};

export function HomeLink({ className = '' }: HomeLinkProps) {
  const pathname = usePathname();
  // The RI NEST logo is its own external link, so only the title links home
  // (nesting <a> tags is invalid HTML and causes a hydration error).
  const title = <TitleText />;
  return (
    <h1 className="flex flex-row items-center gap-4 text-2xl">
      <ExternalLink href="https://web.uri.edu/rinsfepscor/rinest/">
        <RiNestLogo size={4.5} variant="white" />
      </ExternalLink>
      {pathname !== '/' ? (
        <Link href="/" className={className}>
          {title}
        </Link>
      ) : (
        <div className={className}>{title}</div>
      )}
    </h1>
  );
}

function TitleText() {
  return (
    <>
      <span className="sm:flex hidden whitespace-nowrap">Rhode Island Data Discovery Center</span>
      <span className="sm:hidden">RIDDC</span>
    </>
  );
}
