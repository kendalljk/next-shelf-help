import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, signIn, useSession } from "next-auth/react";

const Menu = () => {
    const router = useRouter();
    const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);

    const firstName = () => {
        if (session.user) {
            return session.user.fullName.split(" ")[0];
        }
        console.log(firstName());
    };

    const navToSignIn = (e) => {
        e.preventDefault();
        router.push("/login");
        setShowForm(false);
    };

    const handleSignOut = () => {
        signOut({ callbackUrl: "/login" });
        setShowForm(false);
    };

    return (
        <div>
            <div
                onClick={() => setShowForm(!showForm)}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
                <i className="fa-solid fa-bars"></i>
            </div>
            {showForm && (
                <div
                    onClick={() => setShowForm(!showForm)}
                    className="w-1/3 lg:w-1/6 absolute right-5 bg-white rounded flex flex-col align-end border shadow p-2"
                >
                    {session?.user && (
                        <div className="text-right text-blue-400 text-xl">
                <h2>{`${firstName()}'s Library`}</h2>
                        </div>
                    )}
                    <Link
                        href="/search"
                        className="text-right hover:bg-blue-100 p-1"
                    >
                        Search
                    </Link>
                    <Link
                        href="/shelf"
                        className="text-right hover:bg-blue-100 p-1"
                    >
                        Shelf
                    </Link>
                    <Link
                        href="/tbr"
                        className="text-right hover:bg-blue-100 p-1"
                    >
                        TBR
                    </Link>
                    {session && session.user ? (
                        <button
                            className="flex w-full bg-blue-400 justify-center  bg-opacity-75 my-1 py-1.5 px-3 text-white font-light border-2 border-slate-600 rounded"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </button>
                    ) : (
                        <div className="text-right">
                            <button
                                className="flex w-full bg-blue-400 justify-center  bg-opacity-75 my-1 py-1.5 px-3 text-white font-light border-2 border-slate-600 rounded"
                                onClick={navToSignIn}
                            >
                                Sign In
                            </button>
                            <p className="text-sm inline">
                                {`Don't have an account?`}
                            </p>
                            <Link
                                href="/register"
                                className="text-sm text-blue-400 ml-5"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Menu;
