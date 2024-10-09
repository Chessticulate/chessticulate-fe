import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const token = cookies().get("token");

  return (
    <div className="text-2xl py-3 pr-10">
      {!token ? (
        <>
          <Link href="/signup" passHref>
            Sign up
          </Link>
          <> | </>
          <Link href="/login" passHref>
            Log in
          </Link>
        </>
      ) : (
        <LogoutButton />
      )}
    </div>
  );
}
