import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import key from "../config/app.config";

export default async function handler(req, res) {
  await dbConnect();

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "missing username or password" });
    }
    try {
        console.log("Received login request:", req.body);
        const user = await User.findOne({ email: email });

        const passwordCorrect =
            user === null
                ? false
                : await bcrypt.compare(password, user.password);

        if (!(user && passwordCorrect)) {
            return res.status(401).json({
                error: "invalid username or password",
            });
        }

        const token = jwt.sign(
            { email: user.email, userId: user._id },
            key.jwt.secret,
            { expiresIn: "1d" }
        );

        res.status(200).send({
            token,
            email: user.email,
            uid: user.id,
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(400).send(error);
    }
}
