"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Network response is trippin");
      }

      const data = await response.json();
      console.log("Success:", data);

      router.push("/");

      // refresh server components
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col text-black">
          <div className="pb-5">
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={handleUsernameChange}
              className="placeholder:text-slate-600 rounded-md h-8 pl-2"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={handlePasswordChange}
              className="placeholder:text-slate-600 rounded-md h-8 pl-2"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Log in
          </button>
          <div className="flex flex-col items-center pt-6 text-white">
            Don&apos;t have an account?
            <Link href="/signup" passHref className="text-blue-500">
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </main>
  );
}
