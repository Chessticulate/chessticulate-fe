"use client";

import Link from "next/link";
import UserFormInput from "@/components/UserFormInput";
import { useRouter, usePathname } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";

export default function UserForm() {
  const router = useRouter();
  const pathname = usePathname();

  const [uname, setUname] = useState("");
  const [unameErrors, setUnameErrors] = useState([
    { message: "Min 3 characters, 15 max", show: false },
    { message: 'Only includes letters, numbers, "-" or "_" ', show: false },
  ]);
  const handleUnameChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setUname(e.target.value);

    if (pathname == "/login") {
      return;
    }

    setUnameErrors([
      {
        message: unameErrors[0].message,
        show: value.length < 3 || value.length > 15,
      },
      { message: unameErrors[1].message, show: /[^A-Za-z0-9_-]/.test(value) },
    ]);
  };

  const [email, setEmail] = useState("");
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const [pswd, setPswd] = useState("");
  const [pswdErrors, setPswdErrors] = useState([
    { message: "Min 8 characters, 64 max", show: false },
    { message: "Includes an uppercase letter", show: false },
    { message: "Includes a lowercase letter", show: false },
    { message: "Includes a number", show: false },
    { message: "Includes a special character", show: false },
  ]);
  const handlePswdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPswd(e.target.value);
    if (pathname == "/login") {
      return;
    }
    let value = e.target.value;
    setPswdErrors([
      {
        message: pswdErrors[0].message,
        show: value.length < 8 || value.length > 64,
      },
      { message: pswdErrors[1].message, show: !/[A-Z]/.test(value) },
      { message: pswdErrors[2].message, show: !/[a-z]/.test(value) },
      { message: pswdErrors[3].message, show: !/[0-9]/.test(value) },
      { message: pswdErrors[4].message, show: !/[^A-Za-z0-9]/.test(value) },
    ]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: uname,
            email: email,
            password: pswd,
          }),
        },
      );

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
    <div className="text-center">
      <div className="text-2xl pb-3">
        {pathname === "/login" ? <h1>Log In:</h1> : <h1>Sign Up:</h1>}
      </div>
      <form onSubmit={handleSubmit} className="space-y-1">
        <UserFormInput
          inputHint="username"
          inputValue={uname}
          handleValueChange={handleUnameChange}
          errors={unameErrors}
        />
        {pathname === "/login" ? (
          <></>
        ) : (
          <UserFormInput
            inputHint="email"
            inputValue={email}
            handleValueChange={handleEmailChange}
            errors={[]}
          />
        )}
        <UserFormInput
          inputHint="password"
          inputValue={pswd}
          handleValueChange={handlePswdChange}
          errors={pswdErrors}
        />
        <button
          type="submit"
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Submit
        </button>
        <div className="flex flex-col items-center pt-6">
          {pathname == "/signup" ? (
            <>
              <p className="text-white">Already have an account?</p>
              <Link href="/login" passHref className="text-blue-500">
                Log in
              </Link>
            </>
          ) : (
            <>
              <p className="text-white">Don&apos;t have an account?</p>
              <Link href="/signup" passHref className="text-blue-500">
                Sign up
              </Link>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
