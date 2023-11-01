"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import BookMenu from "@/app/components/BookMenu";

const NotePage = ({ params }) => {
    const title = decodeURIComponent(params.title[0]);
    console.log("title: ", title);
    const pathname = usePathname();
    const router = useRouter();
    const [book, setBook] = useState({});
    const [myNote, setMyNote] = useState({});

    useEffect(() => {
        const searchBook = async (title) => {
            try {
                console.log("Searching for book by title: ", title);
                const response = await axios.get(
                    `http://localhost:3000/api/books?title=${title}`
                );
                setBook(response.data.books);
                setMyNote(response.data.books);
            } catch (error) {
                console.error("An error occurred while fetching data: ", error);
            }
        };

        searchBook(title);
    }, [title]);

    useEffect(() => {
        console.log("returned book by title (updated): ", book);
    }, [book]);

    useEffect(() => {
        console.log("Updated note (updated): ", myNote);
    }, [myNote]);

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

    const saveNote = async (event) => {
        console.log("saving...");
        event.preventDefault();
        console.log("my note", myNote);

        try {
            const checkDuplicates = await axios.get(
                `http://localhost:3000/api/books?title=${encodeURIComponent(
                    myNote.title
                )}`
            );

            if (checkDuplicates.data) {
                console.log("duplicates", checkDuplicates);
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
                  console.log("myNote update: ", myNote)
                    const updateResponse = await axios.put(
                        `http://localhost:3000/api/books?title=${encodeURIComponent(
                            myNote.title
                        )}`,
                        myNote
                    );
                    if (updateResponse.status === 200) {
                        console.log("Book successfully updated in MongoDB.");
                        router.push("/shelf");
                    } else {
                        console.log("Failed to update the book.");
                    }
                    return;
                }
            } else {
                console.log("no prior note found");
            }

            const response = await axios.post(
                "http://localhost:3000/api/books",
                myNote
            );

            if (response.status === 201) {
                console.log("Book successfully saved to MongoDB.");
            } else {
                console.log("Failed to save the book.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
        router.push("/shelf");
    };

    const deleteNote = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.delete(
                `http://localhost:3000/api/books?title=${encodeURIComponent(
                    myNote.title
                )}`
            );
            if (response.status === 200) {
                console.log("Book deleted book.");
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
                <form
                    onSubmit={saveNote}
                    className="relative flex flex-col w-3/4 mx-auto lg:w-1/2"
                >
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
