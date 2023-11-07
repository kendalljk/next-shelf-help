"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Menu from "./Menu";

function Navigation() {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        router.push(`/search/${searchValue}`);
        setSearchValue("");
    };

    return (
        <div className="absolute top-0 flex w-full justify-between bg-pages bg-fixed">
            <div className="flex items-center">
                <Link href="/">
                    <img
                        src="/logo.png"
                        alt="books logo"
                        width={50}
                        className="mx-5 mt-2 hidden md:block"
                    />
                </Link>
                <Link href="/">
                    <h1 className="text-2xl lg:text-3xl uppercase text-slate-800">
                        Shelf Help
                    </h1>
                </Link>
                {session && session.user && (
                    <>
                        <div className="flex gap-10 ml-10 text-lg text-blue-300 hidden lg:flex">
                            <Link
                                href="/"
                                className={
                                    pathname === "/"
                                        ? "underline underline-offset-4"
                                        : ""
                                }
                            >
                                home
                            </Link>

                            <Link
                                href="/shelf/"
                                className={
                                    pathname === "/shelf"
                                        ? "underline underline-offset-4"
                                        : ""
                                }
                            >
                                shelf
                            </Link>
                            <Link
                                href="/tbr"
                                className={
                                    pathname === "/tbr"
                                        ? "underline underline-offset-4"
                                        : ""
                                }
                            >
                                tbr
                            </Link>
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center mr-5">
                <form onSubmit={handleSearch}>
                    <input
                        type="search"
                        className="bg-blue-100 text-slate-600 p-1 border-2 border-slate-300 mx-5 rounded-lg focus:outline-none"
                        placeholder="search books..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </form>

                <div className="flex">
                    <Menu />
                </div>
            </div>
        </div>
    );
}

export default Navigation;
