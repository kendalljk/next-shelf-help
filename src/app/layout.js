import "./globals.css";
import { Inter } from "next/font/google";
import Navigation from "./components/Navigation";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Shelf Help",
    description: "Created by Kendall Cercone",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Navigation />
                {children}
            </body>
            <Script
                src="https://kit.fontawesome.com/26908105cc.js"
                crossorigin="anonymous"
            ></Script>
        </html>
    );
}
