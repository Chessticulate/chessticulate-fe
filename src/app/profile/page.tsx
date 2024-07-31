import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import AuthWrapper from "@/auth/AuthWrapper";
import ProfileInfo from "./ProfileInfo";

function Profile() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        <div>
          <ProfileInfo />
        </div>
      </main>
    </div>
  );
}

export default AuthWrapper(Profile);
