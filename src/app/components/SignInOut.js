"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

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
                <div className="absolute right-5">
                    <form
                        onSubmit={handleSignIn}
                        className="p-2 flex flex-col bg-white justify-content-center rounded border"
                    >
                        {error && <p className="text-danger">{error}</p>}
                        <input
                            type="text"
                            placeholder="Email"
                            className="w-100 border focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-100 border focus:outline-none my-1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-100 bg-blue-400 bg-opacity-75 border-2 border-slate-600 text-white"
                        >
                            Log In
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SignInOut;
