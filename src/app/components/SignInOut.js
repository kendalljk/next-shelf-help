"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const SignInOut = ({ loggedIn, setLoggedIn }) => {
    const [showForm, setShowForm] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignIn = async (e) => {
        e.preventDefault();
      setShowForm(false);
      console.log(password, email)
        try {
            const response = await axios.post(
                "http://localhost:3001/api/auth/login",
                {
                    email: email,
                    password: password,
                }
            );
            console.log("response", response);

            if (response.data && response.data.token) {
                const { token, user } = response.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", user);

                setUser(user);

                setLoggedIn(true);
                navigate("/shelf");
                handleModalClose();
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Failed to log in:", error);

            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message);
            } else {
                setError("An error occurred during login. Please try again.");
            }
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setLoggedIn(false);
        router.push("/");
    };

    return (
        <div>
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
            {showForm && (
                <div className="absolute right-5 bg-white rounded border p-2">
                    <form
                        onSubmit={handleSignIn}
                        className="flex flex-col justify-content-center"
                    >
                        {error && <p className="text-danger">{error}</p>}
                        <input
                            type="text"
                            placeholder="Email"
                            className="my-1 p-1 border focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="my-1 p-1 border focus:outline-none my-1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="mt-1 p-1 bg-blue-400 bg-opacity-75 border-2 border-slate-600 text-white"
                        >
                            Log In
                        </button>
                    </form>
                    {!loggedIn && (
                        <div className="text-right">
                            <Link href="/register" className="mt-0 text-blue-400 text-sm underline" onClick={()=> setShowForm(!showForm)}>
                                Register new account
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SignInOut;
