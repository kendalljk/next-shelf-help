"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [registrationSuccessful, setRegistrationSuccessful] = useState(false);

    const handleRegister = async () => {
        const user = await axios.post("http://localhost:3001/api/auth/signup", {
            username: username,
            password: password,
        });
        console.log(user);
        if (user.status === 200) {
            setRegistrationSuccessful(true);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center bg-landing pt-24">
            <div className="flex flex-col align-items-center w-1/2 md:w-1/4">
                {registrationSuccessful ? (
                    <div>
                        <p>
                            Registration successful! You can now
                            <Link href="/login">log in</Link>.
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
