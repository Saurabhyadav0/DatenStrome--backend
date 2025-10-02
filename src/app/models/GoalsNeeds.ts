import mongoose, { Schema, Document } from "mongoose";

export interface IGoalsNeeds extends Document {
  userId: mongoose.Types.ObjectId;
  mainGoal: string;
  preference: string;
  targetMarket: string;
  timeline: string;
}

const GoalsNeedsSchema = new Schema<IGoalsNeeds>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mainGoal: { type: String, required: true },
    preference: { type: String, required: true }, // Bootstrapping, Grants, Investor funding
    targetMarket: { type: String, required: true }, // Local, Germany, EU, Global
    timeline: { type: String, required: true }, // Flexible, 6 months, 1 year
  },
  { timestamps: true }
);

const GoalsNeeds =
  mongoose.models.GoalsNeeds || mongoose.model<IGoalsNeeds>("GoalsNeeds", GoalsNeedsSchema);

export default GoalsNeeds;
