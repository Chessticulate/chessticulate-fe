"use client";

import { getCookie } from "cookies-next";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { MobileNav, getNavTabTitle } from "./Navigation";
import { NavTab } from "@/types";
import { useState, useEffect } from "react";

type CommonBannerProps = {
  title: string;
};

function CommonBanner({ title }: CommonBannerProps) {
  const [mounted, setMounted] = useState(false); 
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
    const t = getCookie("token");
    setToken(typeof t === "string" ? t : undefined);
  }, []);

  return (
    <>
      <Link
        href="/"
        passHref
        className="text-xl md:text-2xl lg:text-4xl hover:bg-outline hover:text-background"
      >
        Chessticulate - {title}
      </Link>
      <div className="md:text-xl lg:text-2xl py-3 pr-10">
        {!mounted ? null : !token ? (
          <>
            <Link
              href="/signup"
              className="hover:bg-outline hover:text-background"
              passHref
            >
              Sign up
            </Link>
            <> | </>
            <Link
              href="/login"
              className="hover:bg-outline hover:text-background"
              passHref
            >
              Log in
            </Link>
          </>
        ) : (
          <LogoutButton />
        )}
      </div>
    </>
  );
}

export function Banner() {
  return (
    <nav className="flex justify-between items-center px-4 py-2 bg-foreground">
      <CommonBanner title="Say it witcha chess!" />
    </nav>
  );
}

type Props = {
  activeTab: NavTab;
  setActiveTab(t: NavTab): void;
};

export function BannerWithMenu({ activeTab, setActiveTab }: Props) {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <nav className="relative flex justify-between items-center px-4 py-2 bg-foreground">
      <div className="lg:hidden">
        <button
          onClick={() => (visible ? setVisible(false) : setVisible(true))}
          data-collapse-toggle="navbar-hamburger"
          type="button"
          className="inline-flex items-center justify-center p-2 w-10 h-10 hover:bg-outline hover:text-background focus:outline-none"
          aria-controls="navbar-hamburger"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${visible ? "flex" : "hidden"} bg-foreground absolute left-0 top-full mt-2 z-50`}
        >
          <MobileNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setVisible={setVisible}
          />
        </div>
      </div>
      <CommonBanner title={getNavTabTitle(activeTab)} />
    </nav>
  );
}
