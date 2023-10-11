import connectMongoDB from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  await connectMongoDB();
  console.log("Test API route was hit!");
    try {
        return NextResponse.json({ message: "Test API route is working" }, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred" }, {status: 500});
    }
}
