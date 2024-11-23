"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";


export default function SignupForm() {
  const [username, setUsername] = useState("");
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [showPswdHint, setShowPswdHint] = useState(false);
  const [pswdMissingUpper, setPswdMissingUpper] = useState(false);
  const [pswdMissingLower, setPswdMissingLower] = useState(false);
  const [pswdMissingNumber, setPswdMissingNumber] = useState(false);
  const [pswdMissingSpecial, setPswdMissingSpecial] = useState(false);
  const [pswdBadLength, setPswdBadLength] = useState(false);

  const router = useRouter();

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    let missingUpper = !(/[A-Z]/.test(value));
    let missingLower = !(/[a-z]/.test(value));
    let missingNumber = !(/[0-9]/.test(value));
    let missingSpecial = !(/[^0-9a-zA-Z]/.test(value));
    let badLength = value.length < 8 || value.length > 64;

    setPswdMissingUpper(missingUpper);
    setPswdMissingLower(missingLower);
    setPswdMissingNumber(missingNumber);
    setPswdMissingSpecial(missingSpecial);
    setPswdBadLength(badLength);
    setShowPswdHint(missingSpecial || missingNumber || missingLower || missingUpper || badLength);
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
      console.log("Successful signup:", data);

      router.push("/login");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
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
            <div className={`${showPswdHint?"block":"hidden"}`}>
              <ul id="passwordHints" className="mt-2 text-sm text-slate-400 space-y-1">
                <li className="requirement flex items-center">
                  <span className={`mr-2 flex items-center justify-center h-5 w-5 rounded-full bg-slate-600 ${pswdBadLength?"text-red-500":"text-green-500"}`}>
                  {pswdBadLength?"✗":"✓"}
                  </span> 
                  At least 8 characters
                </li>
                <li className="requirement flex items-center">
                  <span className={`mr-2 flex items-center justify-center h-5 w-5 rounded-full bg-slate-600 ${pswdMissingUpper?"text-red-500":"text-green-500"}`}>
                  {pswdMissingUpper?"✗":"✓"}
                  </span> 
                  Includes an uppercase letter
                </li>
                <li className="requirement flex items-center">
                  <span className={`mr-2 flex items-center justify-center h-5 w-5 rounded-full bg-slate-600 ${pswdMissingLower?"text-red-500":"text-green-500"}`}>
                  {pswdMissingLower?"✗":"✓"}
                  </span> 
                  Includes a lowercase letter 
                </li>
                <li className="requirement flex items-center">
                  <span className={`mr-2 flex items-center justify-center h-5 w-5 rounded-full bg-slate-600 ${pswdMissingNumber?"text-red-500":"text-green-500"}`}>
                  {pswdMissingNumber?"✗":"✓"}
                  </span> 
                  Includes a number
                </li>
                <li className="requirement flex items-center">
                  <span className={`mr-2 flex items-center justify-center h-5 w-5 rounded-full bg-slate-600 ${pswdMissingSpecial?"text-red-500":"text-green-500"}`}>
                  {pswdMissingSpecial?"✗":"✓"}
                  </span> 
                  Includes a special character 
                </li>
              </ul>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Sign up
          </button>
          <div className="flex flex-col items-center pt-6 text-white">
            <p>Already have an account?</p>
            <Link href="/login" passHref className="text-blue-500">
              Log in
            </Link>
          </div>
        </div>
      </form>
  );
}
