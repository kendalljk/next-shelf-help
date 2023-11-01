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
            className="flex flex-col items-center w-full"
        >
            <img
                src={`http://covers.openlibrary.org/b/id/${book.cover}-L.jpg`}
                alt={`${book.title} cover`}
                width="100rem"
            />
            <div className="w-full flex flex-wrap justify-center text-center">
                <h4 className="">{book.title}</h4>
            </div>
        </div>
    );
};

export default ShelfDisplay;
