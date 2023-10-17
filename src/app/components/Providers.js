"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

function Providers(props) {
    return <SessionProvider>{props.children}</SessionProvider>;
}

export default Providers;
