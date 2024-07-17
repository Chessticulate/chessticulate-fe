import Image from "next/image";
import Navbar from "../../components/navbar";
import Signup_Form from "./signup_form";
import Link from "next/link";
import config from "../../../config.js";

export default function Signup() {
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
      <main className="flex justify-center pt-10">
        <Signup_Form />
      </main>
    </div>
  );
}
