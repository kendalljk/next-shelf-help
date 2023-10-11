'use client'
import React, { useState } from "react";
import BookMenu from "./BookMenu";

const SearchDisplay = ({ books, searchValue }) => {
    return (
        <div>
            <div className="d-flex w-100 mt-4">
                {searchValue && (
                    <h2 className="mx-auto w-75 fw-normal search-display font-italic fst-italic">
                        {searchValue}...
                    </h2>
                )}
            </div>
            <div className="container w-75 sm-w-100">
                <div className="row">
                    {books.map((book, index) => (
                        <div key={index} className="col-12 my-4">
                            <div className="d-flex flex-column flex-md-row">
                                <div className="sm-w-100">
                                    <img
                                        src={`http://covers.openlibrary.org/b/id/${book.coverI}-M.jpg`}
                                        alt={`${book.title} cover`}
                                        height="200rem"
                                        width="150rem"
                                    />
                                </div>
                                <div className="flex-grow-1 ms-md-4">
                                    <h2 className="fst-italic">{book.title}</h2>
                                    <h4>by {book.author}</h4>
                                    <div className="py-4">
                                        <BookMenu book={book} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchDisplay;
