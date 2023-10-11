import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
    dateJoined: { type: Date, default: Date.now },
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        },
    ],
});

export default mongoose.model("User", userSchema);
