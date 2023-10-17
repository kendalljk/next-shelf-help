import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    password: {
        type: String,
        required: true,
    },
    dateJoined: { type: Date, default: Date.now },
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        },
    ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
