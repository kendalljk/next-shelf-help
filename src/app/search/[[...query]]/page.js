"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchDisplay from "@/app/components/SearchDisplay";

const Search = ({ params }) => {
    const query = params.query;
    const router = useRouter();
    const [searchType, setSearchType] = useState("both");
    const [inputValue, setInputValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const isFirstPage = currentPage === 1

    useEffect(() => {
        if (query) {
            searchForBooks(decodeURIComponent(query), searchType, currentPage);
            setSearchValue(decodeURIComponent(query));
        }
    }, [query, searchType, currentPage]);

    const searchForBooks = async (
        searchQuery,
        type,
        currentPage,
        limit = 20
    ) => {
        setBooks([]);

        let apiUrl;

        if (type === "both") {
            apiUrl = `https://openlibrary.org/search.json?q=${searchQuery}&page=${currentPage}&limit=${limit}`;
        } else {
            apiUrl = `https://openlibrary.org/search.json?${type}=${searchQuery}&page=${currentPage}&limit=${limit}`;
        }

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log("data: ", data);
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

    const goToNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.push(`/search/${inputValue}`);
        setSearchValue(inputValue);
    };

    return (
        <section className="flex min-h-screen w-full flex-col items-center bg-pages pb-5">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-2/3 md:w-1/3 pt-24"
            >
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
                    <button className="bg-blue-400  bg-opacity-75 py-1.5 px-3 text-white font-light border-2 border-slate-600 rounded">
                        search
                    </button>
                </div>
            </form>
            {books.length > 0 && (
                <>
                    <SearchDisplay books={books} searchValue={searchValue} />
                    <div className="flex gap-20 pt-5 text-blue-300">
                        <button
                            onClick={() =>
                                goToPreviousPage(searchValue, searchType)
                            }
                            disabled={isFirstPage}
                            className={`${
                                isFirstPage
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "hover:text-blue-500 text-blue-300"
                            }`}
                        >
                            <i className="fa-solid fa-arrow-left text-2xl"></i>
                        </button>
                        <button
                            onClick={() =>
                                goToNextPage(searchValue, searchType)
                            }
                        >
                            <i className="fa-solid fa-arrow-right text-2xl hover:text-blue-500"></i>
                        </button>
                    </div>
                </>
            )}
        </section>
    );
};

export default Search;
