import connectMongoDB from "@/app/lib/dbConnect";
import Book from "@/app/models/book";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        const {
            title,
            author,
            cover,
            category,
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

  await connectMongoDB();
  const userId = await req.json();
  console.log(userId)

      if (!userId) {
          return NextResponse.json(
              { message: "User ID not provided" },
              { status: 400 }
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
        console.log("User Id:", userId);
        const books = await Book.find({ user: userId });
        if (books.length > 0) {
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
