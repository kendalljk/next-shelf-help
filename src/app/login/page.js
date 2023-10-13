"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

const LoginPage = (params) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3001/api/auth/signin",
                {
                    username: username,
                    password: password,
                }
            );
            console.log(response);

            const token = response.data.token;
            const user = response.data.username;
            console.log(user);

            // Store the token in localStorage (you can also use cookies or sessionStorage)
            localStorage.setItem("token", token);
            localStorage.setItem("user", user);

            // Set the user state with the user data
            setUsername(user);
            params.setUser(user);

            setLoggedIn(true);
            params.setLoggedIn(true);
            setError("");
        } catch (error) {
            setLoggedIn(false);
            params.setLoggedIn(false);
            setError("Invalid username or password");
        }
    };

    const handleLogout = () => {
        // Clear the token from localStorage (or cookies/sessionStorage)
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setLoggedIn(false);
        params.setLoggedIn(false);
        setUsername("");
        params.setUser(null);
        setPassword("");
    };

    useEffect(() => {
        // Check if a token is stored in localStorage when the component mounts
        const storedToken = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (storedToken) {
            setLoggedIn(true);
            params.setLoggedIn(true);
            setUsername(user);
            params.setUser(user);
        }
    }, []);

    return (
        <div className="flex min-h-screen w-full flex-col items-center bg-landing pt-24">
            <div className="flex flex-col align-items-center w-1/4">
                {loggedIn ? (
                    <>
                        <p>Welcome, {username}!</p>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <div className="bg-white p-5 rounded-lg flex flex-col align-items-center">
                        <h1 className="text-slate-800 text-2xl font-semibold">
                            Login
                        </h1>
                        <input
                            className="my-1 p-1 border"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            className="my-1 p-1 border"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            className="bg-blue-400  bg-opacity-75 my-1 py-1.5 px-3 text-white font-light border-2 border-slate-600 rounded"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                        <p className="text-sm text-right">
                            {`Don't have an account?`}
                            <Link
                                href="/register"
                                className="text-blue-400 ml-5"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
