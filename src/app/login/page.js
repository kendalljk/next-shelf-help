"use client";
import React, { useState, useEffect } from "react";
import { signOut, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import nextAuth from "next-auth";
import { useRouter } from "next/navigation";

const LoginPage = (params) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const { data: session } = useSession();

    if (session) {
        console.log(session);
    } else {
        console.log("nobody logged in");
    }

    /* if (session && session.user) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center bg-pages pt-24">
                <p>{session.user.name}</p>
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        )
    }
  return (
      <div className="flex min-h-screen w-full flex-col items-center bg-pages pt-24">
          <button onClick={() => signIn()}>Sign in with Google</button>
      </div>
  );
};*/

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (user.error) {
                setError("Invalid Credentials");
                return;
            }
            console.log(user);
            setLoggedIn(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = async (e) => {
      e.preventDefault();
      signOut();
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center bg-landing pt-24">
            <div className="flex flex-col align-items-center w-1/2 md:w-1/4">
                {loggedIn ? (
                    <>
                        <p>Welcome, {}!</p>
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
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        {error && (
                            <div>
                                <p>{error}</p>
                            </div>
                        )}
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
