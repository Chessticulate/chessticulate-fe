"use client";

import Link from "next/link";
import LoginSignupInput from "@/components/LoginSignupInput";
import { setCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import { LoginSignupError } from "@/types";
import emailRegex from "../utils/emailRegex";

async function checkExists(key: string, value: string): Promise<boolean> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL + `/users/${key}/${value}`,
  );
  const content = await response.json();
  return content.exists;
}

async function usernameAlreadyExists(username: string): Promise<boolean> {
  return await checkExists("name", username);
}

async function emailAlreadyExists(email: string): Promise<boolean> {
  return await checkExists("email", email);
}

export default function LoginSignup() {
  const router = useRouter();
  const pathname = usePathname();

  const [showPageError, setShowPageError] = useState(false);
  const pageError = () => {
    setShowPageError(true);
    window.setTimeout(() => {
      setShowPageError(false);
    }, 5000);
  };

  const [uname, setUname] = useState("");
  const [unameTimeoutID, setUnameTimeoutID] = useState(0);
  const [unameErrors, setUnameErrors] = useState<LoginSignupError[]>([
    { message: "Username not already taken", show: false },
    { message: "Min 3 characters, 15 max", show: false },
    { message: 'Only includes letters, numbers, "-" or "_"', show: false },
  ]);
  const handleUnameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUname(value);
    if (pathname === "/login") {
      return;
    }

    if (unameTimeoutID !== 0) {
      clearTimeout(unameTimeoutID);
    }

    if (value === "") {
      return;
    }

    const timeoutID = window.setTimeout(async () => {
      let exists = false;
      try {
        exists = await usernameAlreadyExists(value);
      } catch (error) {
        console.log(error);
        pageError();
        return;
      }
      setUnameErrors([
        { message: unameErrors[0].message, show: exists },
        {
          message: unameErrors[1].message,
          show: value.length < 3 || value.length > 15,
        },
        { message: unameErrors[2].message, show: /[^A-Za-z0-9_-]/.test(value) },
      ]);
    }, 500);

    setUnameTimeoutID(timeoutID);
  };

  const [email, setEmail] = useState("");
  const [emailTimeoutID, setEmailTimeoutID] = useState(0);
  const [emailErrors, setEmailErrors] = useState<LoginSignupError[]>([
    { message: "Email not already taken", show: false },
    { message: "Invalid email", show: false },
  ]);
  const handleEmailChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (emailTimeoutID !== 0) {
      clearTimeout(emailTimeoutID);
    }

    if (value === "") {
      return;
    }

    const timeoutID = window.setTimeout(async () => {
      let exists = false;
      try {
        exists = await emailAlreadyExists(value);
      } catch (error) {
        console.log(error);
        pageError();
        return;
      }
      setEmailErrors([
        { message: emailErrors[0].message, show: exists },
        { message: emailErrors[1].message, show: !emailRegex.test(value) },
      ]);
    }, 500);

    setEmailTimeoutID(timeoutID);
  };

  const [pswd, setPswd] = useState("");
  const [pswdErrors, setPswdErrors] = useState<LoginSignupError[]>([
    { message: "Min 8 characters, 64 max", show: false },
    { message: "Includes an uppercase letter", show: false },
    { message: "Includes a lowercase letter", show: false },
    { message: "Includes a number", show: false },
    { message: "Includes a special character", show: false },
  ]);
  const handlePswdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPswd(value);
    if (pathname === "/login") {
      return;
    }

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

    if (
      unameErrors.some((err) => err.show) ||
      emailErrors.some((err) => err.show) ||
      pswdErrors.some((err) => err.show)
    ) {
      alert("must correct input errors before submitting");
      return;
    }

    try {
      if (pathname === "/signup") {
        if (uname === "" || pswd === "" || email === "") {
          alert("you have empty inputs!");
          return;
        }
        const signupResponse = await fetch(
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

        if (!signupResponse.ok) {
          console.log(await signupResponse.json());
          pageError();
          return;
        }
      }

      if (uname === "" || pswd === "") {
        alert("you have empty inputs!");
        return;
      }
      const loginResponse = await fetch(
        `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: uname,
            password: pswd,
          }),
        },
      );

      if (!loginResponse.ok) {
        console.log(await loginResponse.json());
        pageError();
        return;
      }

      const content = await loginResponse.json();
      const jwt = jwtDecode(content.jwt);
      if (jwt.exp === undefined) {
        throw new Error("JWT exp field is undefined");
      }
      const maxAge = jwt.exp - Math.floor(Date.now() / 1000);

      setCookie("token", content.jwt, {
        maxAge: maxAge,
        secure: true,
        sameSite: "strict",
      });

      router.push("/");
    } catch (error) {
      console.log(error);
      pageError();
    }
  };

  return (
    <div className="text-center">
      <div className="text-2xl pb-3">
        {pathname === "/login" ? <h1>Log In:</h1> : <h1>Sign Up:</h1>}
      </div>
      <form onSubmit={handleSubmit} className="space-y-1">
        <LoginSignupInput
          inputHint="username"
          inputValue={uname}
          handleValueChange={handleUnameChange}
          errors={unameErrors}
        />
        {pathname === "/login" ? (
          <></>
        ) : (
          <LoginSignupInput
            inputHint="email"
            inputValue={email}
            handleValueChange={handleEmailChange}
            errors={emailErrors}
          />
        )}
        <LoginSignupInput
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
        <div
          className={`w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-md ${showPageError ? "block" : "hidden"}`}
        >
          <p>Something broke... try again later</p>
        </div>
        <div className="flex flex-col items-center pt-6">
          {pathname === "/signup" ? (
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
