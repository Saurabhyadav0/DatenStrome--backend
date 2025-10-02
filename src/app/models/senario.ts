import mongoose, { Schema, Document } from "mongoose";

export interface IScenario extends Document {
  userId: mongoose.Types.ObjectId; // to link scenario with a user
  scenario: string;
}

const ScenarioSchema = new Schema<IScenario>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    scenario: { type: String, required: true },
  },
  { timestamps: true }
);

const Scenario =
  mongoose.models.Scenario || mongoose.model<IScenario>("Scenario", ScenarioSchema);

export default Scenario;
