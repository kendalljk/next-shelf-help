import dbConnect from "../../lib/dbConnect";
import User from "../../lib/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import key from "../config/app.config";

export default async function handler(req, res) {
    await dbConnect();

  if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
  }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({ error: "please add all the fields" });
        }

        const savedUser = await User.findOne({ email: email });

        if (savedUser) {
            return res
                .status(422)
                .json({ error: "user already exists with that email" });
        }

        const hashedpassword = await bcrypt.hash(password, 12);

        const user = new User({
            email,
            password: hashedpassword,
        });

        await user.save();
        res.status(201).send({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
