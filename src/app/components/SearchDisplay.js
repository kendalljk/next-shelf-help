"use client";
import React, { useState } from "react";
import BookMenu from "./BookMenu";

const SearchDisplay = ({ books, searchValue }) => {
    function capitalizeWords(str) {
        const fillers = [
            "a",
            "an",
            "the",
            "and",
            "but",
            "or",
            "nor",
            "for",
            "so",
            "yet",
            "as",
            "on",
            "in",
            "of",
            "to",
            "by",
            "up",
            "off",
            "at",
            "out",
            "from",
        ];

        str = str.replace(/^\w/, (c) => c.toUpperCase());

        str = str.replace(/\b(\w+)\b/g, (match, p1, offset) => {
            if (fillers.includes(p1.toLowerCase()) && offset !== 0) {
                return p1.toLowerCase();
            }
            return p1.charAt(0).toUpperCase() + p1.slice(1).toLowerCase();
        });

        return str;
    }

    return (
        <div className="w-full md:w-1/3">
            <div className="w-full mt-4">
                {searchValue && (
                    <h2 className="text-2xl font-medium italic text-blue-300">
                        {capitalizeWords(searchValue)}...
                    </h2>
                )}
            </div>
            <div className="w-full">
                {books.map((book, index) => (
                    <div key={index} className="w-full mt-5">
                        <div className="flex w-full">
                            <img
                                src={`http://covers.openlibrary.org/b/id/${book.coverI}-M.jpg`}
                                alt={`${book.title} cover`}
                                width="100rem"
                            />
                            <div className="flex flex-col justify-between pl-10">
                                <div>
                                    <h2 className="text-xl italic font-medium text-slate-800">
                                        {book.title}
                                    </h2>
                                    <h4 className="text-sm">
                                        by {book.author}
                                    </h4>
                                </div>
                                <div>
                                    <BookMenu book={book} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchDisplay;
