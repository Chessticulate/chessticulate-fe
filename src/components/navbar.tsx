import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="flex text-2xl justify-between max-w-5xl mx-auto px-4 py-3 sm:px-6">
      <div className="px-4">
        <Link href="/login" passHref>
          Login
        </Link>
      </div>
      <div className="px-4">
        <Link href="/play" passHref>
          Play
        </Link>
      </div>
      <div className="px-4">
        <Link href="/users" passHref>
          Users
        </Link>
      </div>
    </div>
  );
};

