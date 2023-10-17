import connectMongoDB from "@/app/lib/dbConnect";
import User from "./models/user";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    await connectMongoDB();
    const { email } = await req.json();
    const existingUser = await User.findOne({ email }).select("_id");
    console.log("user: ", existingUser);
    return NextResponse.json({ existingUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
