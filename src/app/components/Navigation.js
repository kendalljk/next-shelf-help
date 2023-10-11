"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import SignInOut from "./SignInOut";

function Navigation({ setLoggedIn }) {
    const router = useRouter();
    const pathname = usePathname();
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        router.push(`/search/${searchValue}`);
        setSearchValue("");
    };

    return (
        <div className="absolute top-0 flex w-full justify-between bg-pages">
            <div className="flex items-center">
                <Link href="/">
                    <img
                        src="/logo.png"
                        alt="books logo"
                        style={{
                            padding: "1rem 2rem",
                            maxHeight: "5rem",
                        }}
                    />
                </Link>
                <h1 className="text-3xl uppercase">Shelf Help</h1>
                <div className="flex gap-10 ml-10 text-lg text-blue-300">
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
                        href="/shelf"
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
                    <SignInOut />
                </div>
            </div>
        </div>
    );
}

export default Navigation;
