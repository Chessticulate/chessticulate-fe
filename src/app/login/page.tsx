"use client";

import Image from "next/image";
import Navbar from "../../components/navbar";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
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
        </div>
      </main>
    </div>
  );
}
