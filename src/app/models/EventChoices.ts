// app/models/EventChoices.ts
import mongoose, { Schema, model, models } from "mongoose";

interface IEventChoices {
  userId: mongoose.Types.ObjectId; // Reference to User
  preferredLocation: string;
  eventTypeInterest: string[];
}

const eventChoicesSchema = new Schema<IEventChoices>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  preferredLocation: { type: String, required: true },
  eventTypeInterest: { type: [String], required: true },
});

const EventChoices = models.EventChoices || model<IEventChoices>("EventChoices", eventChoicesSchema);
export default EventChoices;
