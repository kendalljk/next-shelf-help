"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ShelfDisplay from "../components/ShelfDisplay";
import { useSession } from "next-auth/react";

const Shelf = () => {
    const [books, setBooks] = useState([]);
    const { data: session } = useSession();
    const [filter, setFilter] = useState("recent");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/books`
                );
                setBooks(response.data.books);
            } catch (error) {
                console.error("An error occurred while fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    const readingBooks = books
        .filter((book) => book.category === "reading")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const readBooks = books.filter((book) => book.category === "read");

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const sortedBooks = (books, filter) => {
        switch (filter) {
            case "alphabetical":
                return [...books].sort((a, b) =>
                    a.author.localeCompare(b.author)
                );
            case "rating":
                return [...books].sort((a, b) => b.rating - a.rating);
            case "recent":
                return [...books].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
            default:
                return books;
        }
    };

    const filteredBooks = sortedBooks(readBooks, filter);

    return (
        <section className="flex min-h-screen w-full flex-col items-center bg-pages pt-24">
            <div className="flex flex-col w-full">
                <h2 className="text-2xl italic text-blue-300 px-5">
                    Currently reading...
                </h2>
                <div className="flex flex-wrap w-full px-5">
                    {readingBooks.map((book, i) => (
                        <div
                            key={book.id || i}
                            className="w-1/5 lg:w-1/12 mx-2"
                        >
                            <ShelfDisplay book={book} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col w-full mt-10">
                <div className="flex justify-between">
                    <h2 className="text-2xl italic text-blue-300 px-5">
                        On the shelf...
                    </h2>
                    <div className="flex mx-12">
                        <label
                            htmlFor="shelf-filter"
                            className="text-2xl italic text-blue-300"
                        >
                            <h2 className="hidden lg:inline">Filter:</h2>
                        </label>
                        <select
                            name="shelf-filter"
                            id="shelf-filter"
                            className="bg-transparent font-medium italic px-5"
                            onChange={handleFilterChange}
                        >
                            <option value="recent">Recently Added</option>
                            <option value="alphabetical">Alphabetically</option>
                            <option value="rating">Rating</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-wrap w-full px-5">
                    {filteredBooks.map((book, i) => (
                        <div
                            key={book.id || i}
                            className="w-1/5 lg:w-1/12 mx-2 hover:cursor-pointer"
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
