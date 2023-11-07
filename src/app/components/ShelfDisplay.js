'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ShelfDisplay = ({ book }) => {
    const router = useRouter();
    const [hover, setHover] = useState(false);

    const directToNote = () => {
        const { category, title } = book;
        if (category === "tbr" || category === "reading") {
            router.push(`/note/${book.title}`);
        } else if (category === "read") {
            router.push(`/info/${book.title}`);
        } else {
            alert("Error");
        }
    };

    const handleMouseEnter = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    return (
        <div
            onClick={directToNote}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="flex flex-col items-center w-full transition-transform duration-300 hover:scale-110 py-2 hover:cursor-pointer"
        >
            <img
                className="w-36 h-44"
                src={`http://covers.openlibrary.org/b/id/${book.cover}-M.jpg`}
                alt={`${book.title} cover`}
            />
            <div className="w-full">
                <h4 className="text-center text-lg truncate hover:overflow-visible hover:flex hover:flex-wrap hover:text-center hover:whitespace-normal">
                    {book.title}
                </h4>
            </div>
        </div>
    );
};

export default ShelfDisplay;
