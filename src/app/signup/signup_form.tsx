"use client";

import Navbar from "../../components/navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";

export default function Signup_Form() {
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
    <div>
      <main>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <div className="pb-5 text-black">
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
            <div className="pb-5 text-black">
              <input
                type="text"
                placeholder="email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="text-black">
              <input
                type="text"
                placeholder="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Sign up
            </button>
            <div className="flex flex-col items-center pt-6">
              Already have an account?
              <Link href="/login" passHref className="text-blue-500">
                Log in
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
