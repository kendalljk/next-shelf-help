"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ShelfDisplay from "../components/ShelfDisplay";
import { useSession } from "next-auth/react";


const TBR = () => {
  const [books, setBooks] = useState([]);
      const { data: session } = useSession();
      console.log("tbr session", session);

    useEffect(() => {
        const fetchData = async () => {
            try {
                    if (session && session.user && session.user.id) {
                        const url = `http://localhost:3000/api/books?userId=${session.user.id}`;
                        console.log("Requesting URL:", url);
                        const response = await axios.get(url);
                        setBooks(response.data);
                    }
            } catch (error) {
                console.error("An error occurred while fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    const tbrBooks = books.filter((book) => book.category === "tbr");

    return (
        <section className="flex min-h-screen w-full flex-col items-center bg-pages pt-24">
            <div className="d-flex flex-column">
                <h2 className="shelf-heading mt-5 mx-5 fst-italic fw-normal">
                    To be read...
                </h2>
                <div className="reading mt-2 d-flex flex-wrap">
                    {tbrBooks.map((book, i) => (
                        <div
                            key={i}
                            className="text-center d-flex  flex-column align-items-center col-sm-2 col-lg-1 mx-5 mt-3"
                        >
                            <ShelfDisplay book={book} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TBR;
