import Navbar from "@/components/Navbar";
import SignupForm from "./SignupForm";
import Link from "next/link";

export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex justify-center pt-10">
        <SignupForm />
      </main>
    </div>
  );
}
