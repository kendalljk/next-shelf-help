import connectMongoDB from "@/app/lib/dbConnect";
import Book from "@/app/models/book";
import User from "@/app/models/user";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        const {
            title,
            author,
            cover,
            category,
            rating,
            review,
            quotes,
            notes,
            user: userId,
        } = await req.json();

        await connectMongoDB();

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const book = await Book.create({
            title,
            author,
            cover,
            category,
            rating,
            review,
            quotes,
            notes,
            user: userId,
        });

        user.books.push(book._id);
        await user.save();
        return NextResponse.json({ message: "Book created" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            message: "An error occurred while creating the book",
        });
    }
}

export async function GET(req, res) {
    const searchParams = req.nextUrl.searchParams;
    const title = searchParams.get("title");
    const token = await getToken({ req });
    await connectMongoDB();

    const userId = token.id;

    if (!userId) {
        return NextResponse.json(
            { message: "User ID not provided" },
            { status: 404 }
        );
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
        return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
        );
    }

    try {
        let books;
        if (title) {
            books = await Book.findOne({ user: userId, title: title });
        } else {
            books = await Book.find({ user: userId });
        }

        if (books) {
            return NextResponse.json({ books });
        } else {
            return NextResponse.json({
                message: "Cannot find books for the user",
            });
        }
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while finding books for the user" },
            { status: 500 }
        );
    }
}

export async function PUT(req, res) {
    const searchParams = req.nextUrl.searchParams;
    const title = searchParams.get("title");
    const token = await getToken({ req });
    await connectMongoDB();

    const userId = token.id;

    if (!userId) {
        return NextResponse.json(
            { message: "User Id not provided" },
            { status: 404 }
        );
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
        return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
        );
    }

    try {
        const { category, notes, quotes, review, rating } = await req.json();
        console.log("req received: ", category, notes, quotes, review, rating);

        const bookUpdates = {
            category,
            rating,
            notes,
            quotes,
            review,
        };

        console.log("Book updates: ", bookUpdates);

        const book = await Book.findOneAndUpdate(
            { title: decodeURIComponent(title), user: userId },
            bookUpdates,
            { new: true, runValidators: true }
        ).catch((err) => {
            console.error("Update error:", err);
            throw err;
        });
        if (book) {
            console.log("success", book);
            return NextResponse.json({ book });
        } else {
            return NextResponse.json(
                { message: "Book not found" },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "An error occurred while updating the book" },
            { status: 500 }
        );
    }
}

export async function DELETE(req, res) {
    const searchParams = req.nextUrl.searchParams;
    const title = searchParams.get("title");
    const token = await getToken({ req });
    await connectMongoDB();

    const userId = token.id;

    if (!userId) {
        return NextResponse.json(
            { message: "User Id not provided" },
            { status: 404 }
        );
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
        return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
        );
    }
    try {
        const book = await Book.findOneAndDelete({
            title: decodeURIComponent(title),
            user: userId,
        });

        console.log("book: ", book);

        if (!book) {
            return NextResponse.json(
                { message: "Book not found" },
                { status: 404 }
            );
        } else {
            return NextResponse.json(
                { message: "Book successfully deleted" },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "An error occurred while deleting the book" },
            { status: 500 }
        );
    }
}
