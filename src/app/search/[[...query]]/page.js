"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import SearchDisplay from "@/app/components/SearchDisplay";

const Search = ({ params }) => {
    const query = params.query;
    const router = useRouter();
    const [searchType, setSearchType] = useState("both");
    const [inputValue, setInputValue] = useState(
        "" || decodeURIComponent(query)
    );
    const [searchValue, setSearchValue] = useState("");
    const [books, setBooks] = useState([]);

    useEffect(() => {
        if (query) {
            console.log(query);
            searchForBooks(decodeURIComponent(query), searchType);
            setSearchValue(decodeURIComponent(query));
        }
    }, [query, searchType]);

    const searchForBooks = async (searchQuery, type) => {
        setBooks([]);
        console.log(`Search by ${type}: ${searchQuery}`);

        let apiUrl;

        if (type === "both") {
            apiUrl = `https://openlibrary.org/search.json?q=${searchQuery}`;
        } else {
            apiUrl = `https://openlibrary.org/search.json?${type}=${searchQuery}`;
        }

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const booksData = data.docs.map((doc) => ({
                author: doc.author_name ? doc.author_name[0] : "Unknown",
                title: doc.title,
                coverI: doc.cover_i,
            }));

            const booksWithCovers = booksData.filter((book) => book.coverI);

            setBooks(booksWithCovers);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.push(`/search/${inputValue}`);
        setSearchValue(inputValue);
        console.log("search value", searchValue);
        console.log("Returned books", books);
    };

    return (
        <section className="flex min-h-screen w-full flex-col items-center bg-pages">
            <form onSubmit={handleSubmit} className="flex flex-col w-full md:w-1/3 pt-24">
                <h1 className="my-4 text-3xl text-slate-800">Search</h1>
                <input
                    className="p-1 bg-blue-100 border-2 rounded-lg focus:outline-none"
                    type="search"
                    placeholder="search books..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="my-2">
                    <input
                        className="appearance-none"
                        type="radio"
                        id="author"
                        name="search-type"
                        checked={searchType === "author"}
                        onChange={() => setSearchType("author")}
                    />
                    <label
                        htmlFor="author"
                        className={`cursor-pointer  ${
                            searchType === "author"
                                ? "text-blue-300 font-semibold"
                                : "text-gray-400"
                        }`}
                    >
                        author
                    </label>
                    <input
                        className="appearance-none"
                        type="radio"
                        id="title"
                        name="search-type"
                        checked={searchType === "title"}
                        onChange={() => setSearchType("title")}
                    />
                    <label
                        htmlFor="title"
                        className={`cursor-pointer px-4 ${
                            searchType === "title"
                                ? "text-blue-300 font-semibold"
                                : "text-gray-400"
                        }`}
                    >
                        title
                    </label>
                    <input
                        className="appearance-none"
                        type="radio"
                        id="both"
                        name="search-type"
                        checked={searchType === "both"}
                        onChange={() => setSearchType("both")}
                    />
                    <label
                        htmlFor="both"
                        className={`cursor-pointer px-4 ${
                            searchType === "both"
                                ? "text-blue-300 font-semibold"
                                : "text-gray-400"
                        }`}
                    >
                        both
                    </label>
                </div>
                <div className="flex justify-end">
                    <button className="bg-blue-400  bg-opacity-75 py-1.5 px-3 text-white font-light border-2 border-slate-600 rounded">search</button>
                </div>
            </form>
            {books && <SearchDisplay books={books} searchValue={searchValue} />}
        </section>
    );
};

export default Search;
