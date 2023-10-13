import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import BookMenu from "@/app/components/BookMenu";

const NotePage = ({params}) => {
    const pathname = usePathname();
    const router = useRouter();
    const book = location.state?.book;
    const [myNote, setMyNote] = useState({ ...book });
    console.log("My Note", myNote);

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
        const token = localStorage.getItem("token");

        try {
            const checkDuplicates = await axios.get(
                `http://localhost:3001/api/books/${encodeURIComponent(
                    myNote.title
                )}`,
                { headers: { Authorization: `Bearer ${token}` } }
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
                        myNote,
                        { headers: { Authorization: `Bearer ${token}` } }
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
                myNote,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                console.log("Book successfully saved to MongoDB.");
            } else {
                console.log("Failed to save the book.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
        navigate("/shelf");
    };

    const deleteNote = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const response = await axios.delete(
                `http://localhost:3001/api/books/${encodeURIComponent(
                    myNote.title
                )}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 204) {
                console.log("Book deleted book.");
                if (book.category === "tbr") {
                    navigate("/tbr");
                } else {
                    navigate("/shelf");
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
            navigate("/tbr");
        } else {
            navigate("/shelf");
        }
    };

    return (
        <section className="display note-page d-flex flex-md-row flex-sm-column justify-content-center w-75 mx-auto mt-5">
            <div className="col-md-6 col-12 d-flex justify-content-center">
                <img
                    className="note-cover w-auto"
                    src={`http://covers.openlibrary.org/b/id/${book.cover}-L.jpg`}
                    alt={`${book.title} cover`}
                />
            </div>
            <form
                onSubmit={saveNote}
                className="col-md-6 col-12 position-relative"
            >
                <h2 className="fst-italic">{book.title}</h2>
                <p className="fs-4 fw-medium">by {book.author}</p>
                <i
                    onClick={exitNote}
                    className="fa fa-times hover position-absolute top-0 end-0 fs-3 m-2"
                    aria-hidden="true"
                ></i>
                <div className="d-flex flex-column">
                    <label htmlFor="review" className="fs-4 fw-medium">
                        review:
                    </label>
                    <textarea
                        value={myNote.review}
                        onChange={addToNote}
                        className="rounded border-0 p-2"
                        name="review"
                        id="review"
                        rows="3"
                    ></textarea>
                </div>
                <div className="d-flex flex-column">
                    <label htmlFor="quotes" className="fs-4 fw-medium">
                        quotes:
                    </label>
                    <textarea
                        value={myNote.quotes}
                        onChange={addToNote}
                        className="rounded border-0 p-2"
                        name="quotes"
                        id="quotes"
                        rows="5"
                    ></textarea>
                </div>
                <div className="d-flex flex-column">
                    <label htmlFor="notes" className="fs-4 fw-medium">
                        notes:
                    </label>
                    <textarea
                        value={myNote.notes}
                        onChange={addToNote}
                        className="rounded border-0 p-2"
                        name="notes"
                        id="notes"
                        rows="5"
                    ></textarea>
                    <BookMenu book={myNote} addCategory={addCategory} />
                </div>
                <div className="d-flex justify-content-end mt-5">
                    <button
                        type="button"
                        onClick={deleteNote}
                        className="note-button mx-5 bg-danger-subtle text-danger font-bold"
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
