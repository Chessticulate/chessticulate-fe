import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { MobileNav } from "./Navigation";

export default function Banner() {
  const token = cookies().get("token");
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-[#1f1f1f]">
      <Link href="/" passHref className="text-xl md:text-2xl lg:text-4xl">
        Chessticulate
      </Link>
      <div className="md:text-xl lg:text-2xl py-3 pr-10">
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
    </div>
  );
}
