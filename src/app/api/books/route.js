import connectMongoDB from "@/app/lib/dbConnect";
import Book from "@/app/models/book";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "next-auth/react";

export async function POST(req, res) {
    const session = await getSession({ req });
    try {
        console.log("Request Body", req.body);
        const { title, author, cover, category, review, quotes, notes } =
            req.body();
        const { user } = session;

        await connectMongoDB();
        const book = await Book.create({
            title,
            author,
            cover,
            category,
            review,
            quotes,
            notes,
            user: user.email,
        });

        user.books.push(book._id);
        await user.save();
        return NextResponse.json({ message: "Book created" }, { status: 201 });
    } catch (error) {
        console.error("Error creating book:", error);
        next(error);
    }
}

export async function GET() {
  await connectMongoDB();
      const session = await getSession({ req });

    try {
        const userId = req.user._id;
        const books = await Book.find({ user: userId });
        if (books.length > 0) {
            return NextResponse.json({ books });
        } else {
            return NextResponse.json({
                message: "Cannot find books for the user",
            });
        }
    } catch (error) {
        console.error("Error creating book:", error);
        next(error);
    }
}
