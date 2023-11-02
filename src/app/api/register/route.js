import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { fullName, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        await dbConnect();
        await User.create({ fullName, email, password: hashedPassword });
        console.log("Name: ", fullName);
        return NextResponse.json(
            { message: "User registered." },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while registering the user" },
            { status: 500 }
        );
    }
}
