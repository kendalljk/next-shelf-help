import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Menu = ({ loggedIn, setLoggedIn }) => {
  const router = useRouter();
    const [showForm, setShowForm] = useState(false);

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setLoggedIn(false);
        router.push("/");
    };

    const navToSignIn = (e) => {
      e.preventDefault();
      router.push('/login')
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
                    className="w-1/4 lg:w-1/12 absolute right-5 bg-white rounded flex flex-col align-end border shadow p-2"
                >
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
                    {loggedIn ? (
                        <button
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </button>
                    ) : (
                        <button
                            className="bg-blue-400  bg-opacity-75 my-1 py-1.5 px-3 text-white font-light border-2 border-slate-600 rounded"
                            onClick={navToSignIn}
                        >
                            Sign In
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Menu;
