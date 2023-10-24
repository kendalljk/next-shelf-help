"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ShelfDisplay from "../components/ShelfDisplay";
import { useSession } from "next-auth/react";

const Shelf = () => {
    const [books, setBooks] = useState([]);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/books`
                );
                console.log("response: ", response);
                setBooks(response.data.books);
                console.log("books returned: ", books);
            } catch (error) {
                console.error("An error occurred while fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    const readingBooks = books.filter((book) => book.category === "reading");
    const readBooks = books.filter((book) => book.category === "read");

    return (
        <section className="flex min-h-screen w-full flex-col items-center bg-pages pt-24">
            <div className="flex flex-col">
                <h2 className="shelf-heading mt-5 mx-5 fst-italic fw-normal">
                    Currently reading...
                </h2>
                <div className="reading mt-2 d-flex flex-wrap">
                    {readingBooks.map((book, i) => (
                        <div
                            key={i}
                            className="text-center d-flex  flex-column align-items-center col-sm-2 col-lg-1 mx-5 mt-3"
                        >
                            <ShelfDisplay book={book} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="read mt-2">
                <h2 className="shelf-heading mt-5 mx-5 fst-italic fw-normal">
                    On the shelf...
                </h2>
                <div className="reading mt-2 d-flex flex-wrap">
                    {readBooks.map((book, i) => (
                        <div
                            key={i}
                            className="text-center d-flex  flex-column align-items-center col-sm-2 col-lg-1 mx-5 mt-3"
                        >
                            <ShelfDisplay book={book} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Shelf;
