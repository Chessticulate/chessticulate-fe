import Image from "next/image";
import Navbar from "../components/navbar";

export default function Home() {
  return (
    <main>
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-white">
          <h1 className="text-4xl"> Chessticulate </h1>
          <div>
              <Navbar/>
          </div>
      </div>
    </main>
  );
}
