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
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/books?title=${title}`
                );
                setBook(response.data.books);
            } catch (error) {
                console.error("An error occurred while fetching data: ", error);
            }
        };

        fetchData();
    }, [title]);

    const handleEdit = async () => {
        if (isEditing) {
            try {
                await axios.put(
                    `${
                        process.env.NEXT_PUBLIC_NEXTAUTH_URL
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
    };

const addRating = (rate) => {
    if (isEditing) {
        const numRate = Number(rate);
        setRating(numRate);
        setBook((prevState) => ({
            ...prevState,
            rating: numRate,
        }));
        console.log("My note with rating: ", book);
    }
};

    const deleteNote = async (event) => {
        event.preventDefault();

        const userConfirmed = window.confirm(
            "Are you sure you want to delete?"
        );
        if (userConfirmed) {
            try {
                const response = await axios.delete(
                    `${
                        process.env.NEXT_PUBLIC_NEXTAUTH_URL
                    }/api/books?title=${encodeURIComponent(title)}`
                );
                if (response.status === 200) {
                    if (book.category === "tbr") {
                        router.push("/tbr");
                    } else {
                        router.push("/shelf");
                    }
                }
            } catch (error) {
                console.error("An error occurred:", error);
                alert("An error occurred while deleting the note.");
            }
        } else {
            console.log("Note deletion was canceled by the user.");
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
        <section className="flex min-h-screen w-full justify-center gap-20 bg-pages bg-fixed pt-24 bg-repeat-y">
            <div className="w-full lg:w-3/4 flex flex-col lg:flex-row lg:justify-center gap-10">
                <div className="w-full flex lg:w-1/2  justify-center">
                    <img
                        className="w-2/3 lg:w-4/5 h-fit"
                        src={`http://covers.openlibrary.org/b/id/${book.cover}-L.jpg`}
                        alt={`${book.title} book cover`}
                    />
                </div>
                <form className="flex flex-col  w-3/4  mx-auto lg:w-1/2">
                    <div className="flex justify-between">
                        <h2 className="text-3xl italic">{book.title}</h2>
                        <i
                            onClick={exitNote}
                            className="fa fa-times text-slate-700 text-xl py-1 border-2 hover:text-black  bg-slate-300 h-fit

                        active:bg-slate-200
                        active:border-2 active:border-slate-400
                        rounded-full px-2 m-2"
                            aria-hidden="true"
                        ></i>
                    </div>
                    <p className="text-lg">by {book.author}</p>
                    <div className="flex gap-5 py-2 text-blue-200">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i
                                key={star}
                                value={star}
                                className={`fa-solid fa-star cursor-pointer ${
                                    book.rating >= star ? "text-blue-500" : ""
                                }`}
                                onClick={() => addRating(star)}
                                style={{
                                    pointerEvents: isEditing ? "auto" : "none",
                                    opacity: isEditing ? 1 : 0.5,
                                }}
                            />
                        ))}
                    </div>
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
