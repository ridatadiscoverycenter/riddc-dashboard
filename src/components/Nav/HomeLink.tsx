'use client';
import { usePathname } from 'next/navigation';
import { Link, RiddcLogo } from '@/components';

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
    <h1 className="flex flex-row items-center gap-4 font-bold">
      <RiddcLogo size={3} />
      <span className="sm:flex hidden">Rhode Island Data Discovery Center</span>
      <span className="sm:hidden">RIDDC</span>
    </h1>
  );
}
