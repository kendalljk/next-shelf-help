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
    const [myNote, setMyNote] = useState("");
    console.log("My Note", myNote);

    useEffect(() => {
        const searchBook = async (title) => {
            try {
                console.log("Searching for book by title: ", title);
                const response = await axios.get(
                    `http://localhost:3000/api/books?title=${title}`
                );
                console.log("repsonse: ", response);
                setBook(response.data.books[0]);

                console.log("returned books by title: ", book);
            } catch (error) {
                console.error("An error occurred while fetching data: ", error);
            }
        };

        searchBook(title);
    }, []);

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
        event.preventDefault();

        try {
            const checkDuplicates = await axios.get(
                `http://localhost:3001/api/books/${encodeURIComponent(
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
                    navigate("/shelf");
                    return;
                } else {
                    const updateResponse = await axios.put(
                        `http://localhost:3001/api/books/${encodeURIComponent(
                            myNote.title
                        )}`,
                        myNote
                    );
                    if (updateResponse.status === 200) {
                        console.log("Book successfully updated in MongoDB.");
                        navigate("/shelf");
                    } else {
                        console.log("Failed to update the book.");
                    }
                    return;
                }
            }

            const response = await axios.post(
                "http://localhost:3001/api/books",
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
                `http://localhost:3001/api/books/${encodeURIComponent(
                    myNote.title
                )}`
            );
            if (response.status === 204) {
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
            <div className="w-1/2 flex justify-center">
                <img
                    className="w-2/3"
                    src={`http://covers.openlibrary.org/b/id/${book.cover}-L.jpg`}
                    alt={`${book.title} cover`}
                />
            </div>
            <form
                onSubmit={saveNote}
                className="relative w-1/2"
            >
                <h2 className="text-4xl italic">{book.title}</h2>
                <p className="fs-4 fw-medium">by {book.author}</p>
                <i
                    onClick={exitNote}
                    className="fa fa-times hover absolute top-0 end-0 m-2"
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
                    <label htmlFor="quotes" className="fs-4 fw-medium">
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
                    <BookMenu book={myNote} addCategory={addCategory}/>
                </div>
                <div className="flex justify-end mt-5">
                    <button
                        type="button"
                        onClick={deleteNote}
                        className="mx-5 bg-red-300 text-white border-black px-2 rounded font-bold"
                    >
                        delete
                    </button>
                    <button type="submit" className="note-button">
                        save
                    </button>
                </div>
            </form>
        </section>
    );
};

export default NotePage;
