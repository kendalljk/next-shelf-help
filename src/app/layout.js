import "./globals.css";
import { Arya, Proza_Libre } from "next/font/google";
import Navigation from "./components/Navigation";
import Script from "next/script";
import Provider from '@/app/context/Provider'

const mulish = Arya({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap",
    variable: "--font-mulish",
});
const spaceMono = Proza_Libre({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap",
    variable: "--font-spaceMono",
});

export const metadata = {
    title: "Shelf Help",
    description: "Created by Kendall Cercone",
};

export default async function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${mulish.variable} ${spaceMono.variable}`}>
                <Provider>
                    <Navigation />
                    {children}
                </Provider>
            </body>
            <Script
                src="https://kit.fontawesome.com/26908105cc.js"
                crossorigin="anonymous"
            ></Script>
        </html>
    );
}
