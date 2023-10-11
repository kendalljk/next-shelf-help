'use client'
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

const BookMenu = ({ book, addCategory }) => {
    const pathname = usePathname();
    const router= useRouter();
    const [displayValue, setDisplayValue] = useState("Update Status");

    useEffect(() => {
        if (pathname.startsWith("/search/")) {
            setDisplayValue("Add to Shelf");
        } else {
            setDisplayValue("Update Status");
        }
    }, [pathname]);

    const handleCategoryChange = async (e) => {
        const newCategory = e.target.value;
        let newBook = {
            author: book.author,
            title: book.title,
            cover: book.coverI || book.cover,
            category: newCategory,
        };

        console.log(newBook);
        const token = localStorage.getItem("token");
        console.log("token", token);

        if (pathname.startsWith("/search")) {
            try {
                const response = await axios.post(
                    "http://localhost:3001/api/books",
                    newBook,
                    {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status === 201) {
                    console.log("Book successfully saved to MongoDB.");
                    if (newCategory === "read") {
                        router.push(`/note/${book.title}`, {
                            state: { book: newBook },
                        });
                    } else if (newCategory === "reading") {
                        router.push("/shelf");
                    } else if (newCategory === "tbr") {
                        router.push("/tbr");
                    } else {
                        alert("Error");
                    }
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        } else if (pathname.startsWith("/note")) {
            addCategory(newCategory);
        }
    };

    return (
        <div className="">
            <select
                className="book-menu px-4 fs-5 fw-normal rounded"
                value={book.category || ""}
                onChange={handleCategoryChange}
            >
                <option value="" disabled>
                    {displayValue}
                </option>
                <option value="tbr">Want to Read</option>
                <option value="reading">Reading</option>
                <option value="read">Read</option>
            </select>
        </div>
    );
};

export default BookMenu;
