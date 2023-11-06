"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import BookMenu from "@/app/components/BookMenu";

const NotePage = ({ params }) => {
    const title = decodeURIComponent(params.title[0]);
    const pathname = usePathname();
    const router = useRouter();
    const [book, setBook] = useState({});
    const [myNote, setMyNote] = useState({});
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const searchBook = async (title) => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/books?title=${title}`
                );
                setBook(response.data.books);
                setMyNote(response.data.books);
                setRating(Number(response.data.books.rating) || 0);
            } catch (error) {
                console.error("An error occurred while fetching data: ", error);
            }
        };

        searchBook(title);
    }, [title]);

    const addToNote = (event) => {
        const { name, value } = event.target;
        setMyNote((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const addCategory = (newCategory) => {
        setMyNote((prevState) => ({
            ...prevState,
            category: newCategory,
        }));
    };

const addRating = (rate) => {
    const numRate = Number(rate);
    setRating(numRate);
    setMyNote((prevState) => ({
        ...prevState,
        rating: numRate,
    }));
    console.log("My note with rating: ", myNote);
};

    const saveNote = async (event) => {
      event.preventDefault();
      console.log("updated note: ", myNote)

        try {
            const checkDuplicates = await axios.get(
                `${
                    process.env.NEXT_PUBLIC_NEXTAUTH_URL
                }/api/books?title=${encodeURIComponent(myNote.title)}`
            );

            if (checkDuplicates.data) {
                if (
                    checkDuplicates.data.author === myNote.author &&
                    checkDuplicates.data.title === myNote.title &&
                    checkDuplicates.data.category === myNote.category &&
                    checkDuplicates.data.notes === myNote.notes &&
                    checkDuplicates.data.quotes === myNote.quotes &&
                    checkDuplicates.data.review === myNote.review
                ) {
                    router.push("/shelf");
                    return;
                } else {
                    const updateResponse = await axios.put(
                        `${
                            process.env.NEXT_PUBLIC_NEXTAUTH_URL
                        }/api/books?title=${encodeURIComponent(myNote.title)}`,
                        myNote
                    );
                    if (updateResponse.status === 200) {
                        router.push("/shelf");
                    } else {
                    }
                    return;
                }
            } else {
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/books`,
                myNote
            );
        } catch (error) {
            console.error("An error occurred:", error);
        }
        router.push("/shelf");
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
                    }/api/books?title=${encodeURIComponent(myNote.title)}`
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
        <section className="flex min-h-screen w-full justify-center gap-20 bg-pages pt-24 h-full">
            <div className="w-full lg:w-3/4 flex flex-col lg:flex-row lg:justify-center gap-10">
                <div className="w-full flex lg:w-1/2  justify-center">
                    <img
                        className="w-2/3 lg:w-4/5 h-fit"
                        src={`http://covers.openlibrary.org/b/id/${book.cover}-L.jpg`}
                        alt={`${book.title} book cover`}
                    />
                </div>
                <form
                    onSubmit={saveNote}
                    className="flex flex-col w-3/4 mx-auto lg:w-1/2"
                >
                    <div>
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
                        <div
                            className="flex gap-5 py-2 text-blue-200"
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                    key={star}
                                    value={star}
                                    className={`fa-solid fa-star cursor-pointer ${
                                        rating >= star ? "text-blue-500" : ""
                                    }`}
                                    onClick={() => addRating(star)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="review" className="text-xl">
                            review:
                        </label>
                        <textarea
                            value={myNote.review}
                            onChange={addToNote}
                            className="rounded border p-2"
                            name="review"
                            id="review"
                            rows="3"
                        ></textarea>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="quotes" className="text-xl">
                            quotes:
                        </label>
                        <textarea
                            value={myNote.quotes}
                            onChange={addToNote}
                            className="rounded border p-2"
                            name="quotes"
                            id="quotes"
                            rows="5"
                        ></textarea>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="notes" className="text-xl">
                            notes:
                        </label>
                        <textarea
                            value={myNote.notes}
                            onChange={addToNote}
                            className="rounded border p-2 mb-5"
                            name="notes"
                            id="notes"
                            rows="5"
                        ></textarea>
                        <BookMenu book={myNote} addCategory={addCategory} />
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
                            type="submit"
                            className="border-2 border-black p-2 font-bold bg-green-700 text-white rounded"
                        >
                            save
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default NotePage;
