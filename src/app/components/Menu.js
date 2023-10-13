import React, { useState } from "react";
import Link from "next/link";

const Menu = ({loggedIn}) => {
  const [showForm, setShowForm] = useState(false);

      const handleSignOut = () => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setLoggedIn(false);
          router.push("/");
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
                <div className="w-1/12 absolute right-5 bg-white rounded flex flex-col align-end border p-2">
                    <Link href="/search" className="text-right">
                        Search
                    </Link>
                    <Link href="/shelf" className="text-right">
                        Shelf
                    </Link>
                    <Link href="/tbr" className="text-right">
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
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => setShowForm(!showForm)}
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
