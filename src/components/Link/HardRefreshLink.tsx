'use client';
import { useRouter } from 'next/navigation';
import { Link, LinkProps } from './Link';

/**
 * This is a wrapper for the Link component that forces a hard reload on navigation.
 *
 * When navigating to a page, Next JS will cache a lot of data on that page. But, in instances
 * where you're navigating from one page to that same page with different query parameters, not
 * all the required data is invalidated. In this instance, the page needs to trigger a hard refresh
 * to force Next JS to invalidate all Server Component props and re-render the page.
 */
export function HardRefreshLink({ href, children, ...props }: LinkProps) {
  const router = useRouter();
  return (
    <Link
      {...props}
      href={href}
      onClick={(e) => {
        e.preventDefault();
        router.push(href);
        location.reload();
      }}
    >
      {children}
    </Link>
  );
}
