"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

const BookInfo = ({ params }) => {
    const title = decodeURIComponent(params.title[0]);
    const router = useRouter();
    const pathname = usePathname();
    const [book, setBook] = useState({});
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXTAUTH_URL}/api/books?title=${title}`
                );
              console.log("response: ", response)
                setBook(response.data.books);
            } catch (error) {
                console.error("An error occurred while fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    const handleEdit = async () => {
        if (isEditing) {
            try {
                await axios.put(
                    `${
                        process.env.NEXTAUTH_URL
                    }/api/books?title=${encodeURIComponent(title)}`,
                    book
                );
                alert("Success!");
                router.push("/shelf");
            } catch (error) {
                console.error("An error occurred while updating data: ", error);
            }
        }
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
        console.log("Updated Book:", book);
    };

  const deleteNote = async (event) => {
      console.log("deleting...")
        event.preventDefault();

    try {
          console.log("title for deletion: ", title)
            const response = await axios.delete(
                `${process.env.NEXTAUTH_URL}/api/books?title=${encodeURIComponent(
                  title
                )}`
      );
      console.log("response: ", response)
            if (response.status === 200) {
                console.log("Book deleted.");
                if (book.category === "tbr") {
                    router.push("/tbr");
                } else {
                    router.push("/shelf");
                }
            } else {
                console.log("Failed to delete the book.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const exitNote = () => {
        if (book.category === "tbr") {
            router.push("/tbr");
        } else {
            router.push("/shelf");
        }
    };

    return (
        <section className="flex min-h-screen w-full justify-center gap-20 bg-pages pt-24">
            <div className="w-full lg:w-3/4 flex flex-col lg:flex-row lg:justify-center gap-10 max-h-screen">
                <div className="w-full flex lg:w-1/2  justify-center">
                    <img
                        className="w-1/2 lg:w-4/5 h-fit"
                        src={`http://covers.openlibrary.org/b/id/${book.cover}-L.jpg`}
                        alt={`${book.title} book cover`}
                    />
                </div>
                <form className="relative flex flex-col  w-3/4  mx-auto lg:w-1/2">
                    <h2 className="text-3xl italic">{book.title}</h2>
                    <p className="text-lg">by {book.author}</p>
                    <i
                        onClick={exitNote}
                        className="fa fa-times text-slate-700 text-xl py-1 border-2 hover:text-black  bg-slate-300

                        active:bg-slate-200
                        active:border-2 active:border-slate-400
                        rounded-full px-2 absolute top-0 end-0 m-2"
                        aria-hidden="true"
                    ></i>
                    <div className="flex flex-col">
                        <label htmlFor="review" className="text-xl">
                            review:
                        </label>
                        <textarea
                            value={book.review}
                            onChange={handleChange}
                            className="rounded border p-2"
                            name="review"
                            id="review"
                            rows="3"
                            readOnly={!isEditing}
                        ></textarea>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="quotes" className="text-xl">
                            quotes:
                        </label>
                        <textarea
                            value={book.quotes}
                            onChange={handleChange}
                            className="rounded border p-2"
                            name="quotes"
                            id="quotes"
                            rows="5"
                            readOnly={!isEditing}
                        ></textarea>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="notes" className="text-xl">
                            notes:
                        </label>
                        <textarea
                            value={book.notes}
                            onChange={handleChange}
                            className="rounded border p-2"
                            name="notes"
                            id="notes"
                            rows="5"
                            readOnly={!isEditing}
                        ></textarea>
                    </div>
                    <div className="flex justify-end my-5">
                        <button
                            type="button"
                            onClick={deleteNote}
                            className="mx-5 bg-red-400 text-white border-2 border-black p-2 rounded font-bold"
                        >
                            delete
                        </button>
                        <button
                            type="button"
                            onClick={handleEdit}
                            className="border-2 border-black p-2 font-bold bg-green-700 text-white rounded"
                        >
                            {isEditing ? "update" : "edit"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default BookInfo;
