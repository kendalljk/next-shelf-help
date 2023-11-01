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

/*export async function GET(req, res) {
  const token = await getToken({req});
  console.log("token: ", token)
  await connectMongoDB();

  const userId = token.id;

      if (!userId) {
          return NextResponse.json(
              { message: "User ID not provided" },
              { status: 400 }
          );
      }

  const user = await User.findOne({ _id: userId });
  console.log("DB user: ", user)
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
    }*/

export async function GET(req, res) {
    const searchParams = req.nextUrl.searchParams;
    const title = searchParams.get("title");
    const token = await getToken({ req });
    console.log("token: ", token);
    await connectMongoDB();

    const userId = token.id;

    if (!userId) {
        return res.status(400).json({ message: "User ID not provided" });
    }

    const user = await User.findOne({ _id: userId });
    console.log("DB user: ", user);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
  }

    try {
        console.log("User Id:", userId, "title: ", title);
        let books;
        if (title) {
          books = await Book.find({ user: userId, title: title });
          console.log("book by title: ", books)
        } else {
            console.log("searching by ID only");
            books = await Book.find({ user: userId });
            console.log("userId books: ", books);
        }

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

/*
bookRouter.put("/:title", requireAuth, async (req, res) => {
    const { title } = req.params;
    const userId = req.user._id;
    const updatedData = req.body;

    try {
        const book = await Book.findOneAndUpdate(
            { title: decodeURIComponent(title), user: userId },
            updatedData,
            { new: true }
        );
        if (book) {
            res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while updating the book",
        });
    }
});

bookRouter.delete("/:title", requireAuth, async (req, res) => {
    const { title } = req.params;
    const userId = req.user._id;
    try {
        const book = await Book.findOneAndDelete({
            title: decodeURIComponent(title),
            user: userId,
        });

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(204).json({ message: "Book successfully deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while deleting the book",
        });
    }
});

*/
