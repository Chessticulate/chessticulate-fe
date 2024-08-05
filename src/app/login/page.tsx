import Image from "next/image";
import Navbar from "@/components/Navbar";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex justify-center pt-10">
        <LoginForm />
      </main>
    </div>
  );
}
