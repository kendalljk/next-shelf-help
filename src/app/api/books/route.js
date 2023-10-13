import connectMongoDB from "@/app/lib/dbConnect";
import Book from "@/app/models/book";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        console.log("Request Body", req.body);
        const { title, author, cover, category, review, quotes, notes } =
            req.body();
        const { user } = req;

        await connectMongoDB();
        const book = await Book.create({
            title,
            author,
            cover,
            category,
            review,
            quotes,
            notes,
            user,
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
