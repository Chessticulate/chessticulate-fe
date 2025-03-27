import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Banner from "@/components/Banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chessticulate",
  description: "Play chess online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen flex-col`}>
        <nav className="h-16">
          <Banner />
        </nav>
        <main className="flex-grow">
          <div className="h-[calc(100vh-4rem)] flex flex-grow">{children}</div>
        </main>
      </body>
    </html>
  );
}
