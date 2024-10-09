"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);

      router.push("/login");
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
          <div className="pb-5">
            <input
              type="text"
              placeholder="email"
              value={email}
              onChange={handleEmailChange}
              className="placeholder:text-slate-600 rounded-md h-8 pl-2"
            />
          </div>
          <div>
            <input
              type="text"
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
            Sign up
          </button>
          <div className="flex flex-col items-center pt-6 text-white">
            Already have an account?
            <Link href="/login" passHref className="text-blue-500">
              Log in
            </Link>
          </div>
        </div>
      </form>
    </main>
  );
}
