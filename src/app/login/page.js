"use client";
import React, { useState, useEffect } from "react";
import { signOut, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import nextAuth from "next-auth";

const LoginPage = (params) => {
    const { data: session } = useSession();
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  console.log(session.user)

    if (session && session.user) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center bg-pages pt-24">
                <p>{session.user.name}</p>
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        )
    }
  return (
      <div className="flex min-h-screen w-full flex-col items-center bg-pages pt-24">
          <button onClick={() => signIn()}>Sign in</button>
      </div>
  );
};

/*const handleLogin = async () => {
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
            localStorage.setItem("token", token);
            localStorage.setItem("user", user);
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

    /*const signOut = () => {
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
            <div className="flex flex-col align-items-center w-1/2 md:w-1/4">
                {loggedIn ? (
                    <>
                        <p>Welcome, {username}!</p>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <div className="bg-white p-5 rounded-lg flex flex-col align-items-center border shadow">
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
};*/

export default LoginPage;
