import mongoose, { Schema, Document } from "mongoose";

export interface IServiceInterest extends Document {
  userId: mongoose.Types.ObjectId;
  services: string[]; // Array of selected services
}

const ServiceInterestSchema = new Schema<IServiceInterest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    services: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const ServiceInterest =
  mongoose.models.ServiceInterest ||
  mongoose.model<IServiceInterest>("ServiceInterest", ServiceInterestSchema);

export default ServiceInterest;
