import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const token = cookies().get("token");

  return (
    <div className="flex text-2xl justify-between max-w-5xl mx-auto px-4 py-3 sm:px-6">
      <div className="px-4">
        {!token ? (
          <Link href="/signup" passHref>
            Sign up
          </Link>
        ) : (
          <LogoutButton />
        )}
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
}
