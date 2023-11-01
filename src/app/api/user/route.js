import dbConnect from "../../lib/dbConnect";
import User from "../../models/user";
import { NextResponse } from "next/server";
import { setCorsHeaders } from "../../utils/cors";

export async function POST(req, res) {
      setCorsHeaders(res);
    try {
      await dbConnect();
        const { email } = await req.json();
        const existingUser = await User.findOne({ email }).select("_id");
        console.log("user: ", existingUser);
        return NextResponse.json({ existingUser });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
