import connectMongoDB from "@/app/lib/dbConnect";
import Book from "@/app/models/book";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req, res) {
    console.log("Request Body", req.body);
    const { title, author, cover, category, review, quotes, notes, user } = await
        req.json();
    await connectMongoDB();
    await Book.create({
        title,
        author,
        cover,
        category,
        review,
        quotes,
        notes,
        user,
    });
    return NextResponse.json({ message: "Book created" }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const books = await Book.find();
    return NextResponse.json({ books });
}
