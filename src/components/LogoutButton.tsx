"use client";

import { useRouter } from "next/navigation";
import { Logout } from "@/app/actions/Logout";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await Logout();
    router.push("/");
    // router.refresh();
  };

  return <button onClick={handleLogout}>Log out</button>;
}
