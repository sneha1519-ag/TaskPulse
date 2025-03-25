import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    kanban: { type: JSON, required: true },
    calendar: { type: JSON, ref: 'Calendar' },
    meetings: { type: JSON, ref: 'Meeting' }

}, { timestamps: true });

const Event =  mongoose.model("Event", eventSchema);

export default Event;