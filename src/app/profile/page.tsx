import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import AuthWrapper from "@/auth/AuthWrapper";

function Profile() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        Profile
      </main>
    </div>
  );
}

export default AuthWrapper(Profile);
