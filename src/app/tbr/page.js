"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ShelfDisplay from "../components/ShelfDisplay";
import { useSession } from "next-auth/react";

const TBR = () => {
    const [books, setBooks] = useState([]);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXTAUTH_URL}/api/books`
                );
                setBooks(response.data.books);
            } catch (error) {
                console.error("An error occurred while fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    const tbrBooks = books.filter((book) => book.category === "tbr");

    return (
        <section className="flex min-h-screen w-full flex-col items-center bg-pages pt-24">
            <div className="flex flex-col w-full">
                <h2 className="text-2xl italic text-blue-300 m-5">
                    To be read...
                </h2>
                <div className="flex flex-wrap w-full">
                    {tbrBooks.map((book, i) => (
                        <div key={i} className="w-1/12 mx-5">
                            <ShelfDisplay book={book} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TBR;
