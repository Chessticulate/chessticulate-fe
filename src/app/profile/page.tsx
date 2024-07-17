import Image from "next/image";
import Navbar from "../../components/navbar";
import Link from "next/link";

export default function Profile() {
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
      <main className="flex-grow flex items-center justify-center">
        Profile
      </main>
    </div>
  );
}
