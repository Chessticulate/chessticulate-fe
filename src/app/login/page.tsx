import Image from "next/image";
import Navbar from "../../components/navbar";
import Login_Form from "./login_form";
import Link from "next/link";

export default function Login() {
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
        <Login_Form />
      </main>
    </div>
  );
}
