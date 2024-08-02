import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import AuthWrapper from "@/auth/AuthWrapper";
import ProfileInfo from "./ProfileInfo";

function Profile() {
  return (
    <div className="flex flex-col">
      <main className="flex-grow flex items-center">
        <div className="ml-10 mt-10 border-2">
          <ProfileInfo />
        </div>
      </main>
    </div>
  );
}

export default AuthWrapper(Profile);
