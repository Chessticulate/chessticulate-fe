"use client";

import Image from "next/image";
import Navbar from "../../components/navbar";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import config from "../../../config.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.chessticulate_api_url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center px-4 py-2 bg-gray-800 text-white">
        <Link href="/" passHref className="text-4xl">
          Chessticulate
        </Link>
        <div>
          <Navbar />
        </div>
      </header>
      <main className="flex justify-center pt-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 items-center"
        >
          <div className="flex flex-col space-y-center">
            <div className="flex flex-col items-center pb-5 text-black">
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
            <div className="flex flex-col items-center text-black">
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
              Login
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
