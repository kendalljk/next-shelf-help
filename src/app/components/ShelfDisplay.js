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
            className="d-flex flex-column align-items-center w-100 w-2/3 md:w-1/3"
        >
            <img
                src={`http://covers.openlibrary.org/b/id/${book.cover}-L.jpg`}
                alt={`${book.title} cover`}
                height="200rem"
                width="150rem"
            />
            <div className="w-100 d-block">
                <h4 className="fs-5">{book.title}</h4>
            </div>
        </div>
    );
};

export default ShelfDisplay;
