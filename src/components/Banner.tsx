import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Banner() {
  return (
    <div>
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-white">
        <Link href="/" passHref className="text-4xl">
          Chessticulate
        </Link>
        <div>
          <Navbar />
        </div>
      </div>
    </div>
  );
}
