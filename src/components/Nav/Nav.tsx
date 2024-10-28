import { Link } from '@/components/Link';
import { RiddcLogo } from '../RiddcLogo';

export function Nav() {
  return (
    <nav className="flex flex-row w-full p-2 align-center">
      <Link href="/" className="flex flex-row items-center gap-4">
        <RiddcLogo size={3} />
        <h1 className="text-xl font-bold">Rhode Island Data Discovery Center</h1>
      </Link>
    </nav>
  );
}
