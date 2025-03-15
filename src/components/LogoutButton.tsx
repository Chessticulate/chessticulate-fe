"use client";

import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    deleteCookie("token")
    router.push("/");
    router.refresh();
  };

  return <button onClick={handleLogout}>Log out</button>;
}
