import mongoose from "mongoose";
import Event from "./events.js";

const userSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],

}, { timestamps: true });

const User =  mongoose.model("User", userSchema);

export default User;