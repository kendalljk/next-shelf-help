"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";

const RegisterPage = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [registrationSuccessful, setRegistrationSuccessful] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!fullName || !email || !password) {
            setError("All fields are necessary.");
            return;
        }

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/user`,
                { email }
            );

            const existingUser = res.data.existingUser;
            console.log("existing user: ", existingUser);

            if (existingUser) {
                setError("User already exists.");
                return;
            }

            const user = await axios.post(
                `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/register`,
                {
                    fullName: fullName,
                    email: email,
                    password: password,
                }
            );
            console.log(user);
            if (user.status === 201) {
                setRegistrationSuccessful(true);
            }
        } catch (error) {
            setError("An error occurred during registration.");
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center bg-landing pt-24">
            <div className="flex flex-col align-items-center w-1/2 md:w-1/4">
                {registrationSuccessful ? (
                    <div>
                        <p className="bg-white p-5 border">
                            {`Registration successful! You can now `}
                            <Link href="/login" className="underline">
                                log in
                            </Link>
                            .
                        </p>
                    </div>
                ) : (
                    <div className="bg-white flex flex-col p-5 rounded-lg border shadow">
                        <h1 className="text-slate-800 text-2xl font-semibold">
                            Register
                        </h1>
                        <input
                            className="my-1 p-1 border"
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
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
                        <input
                            className="my-1 p-1 border"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            className="bg-blue-400  bg-opacity-75 my-1 py-1.5 px-3 text-white font-light border-2 border-slate-600 rounded"
                            onClick={handleRegister}
                        >
                            Register
                        </button>
                        {error && (
                            <div>
                                <p className="text-red-500">{error}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
