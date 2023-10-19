"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

const BookMenu = ({ book, addCategory }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
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
      console.log("new category: ", newCategory)
        let newBook = {
            author: book.author,
            title: book.title,
            cover: book.coverI || book.cover,
            category: newCategory,
            user: session.user.id,
        };

        console.log("new book", newBook);

      if (pathname.startsWith("/search")) {
        console.log(
            "start searching"
          )
          try {
                const response = await axios.post(
                    "http://localhost:3000/api/books",
                    newBook
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
                className="bg-blue-400  bg-opacity-75 py-2 px-3 text-white font-light border-2 border-slate-600 rounded"
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
