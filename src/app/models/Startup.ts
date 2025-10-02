import mongoose, { Schema, Document } from "mongoose";

export interface IStartup extends Document {
    startupName?: string;
    industrySector: string;
    description: string;
    stage: "Just an idea" | "MVP ready" | "Registered company" | "Generating revenue" | "Fundraising";
    userId: mongoose.Types.ObjectId;
}

const StartupSchema: Schema = new Schema(
    {
        startupName: { type: String, required: false }, // optional
        industrySector: { type: String, required: true },
        description: { type: String, required: true },
        stage: {
            type: String,
            enum: [
                "Just an idea",
                "MVP ready",
                "Registered company",
                "Generating revenue",
                "Fundraising"
            ],
            required: true
        },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Startup || mongoose.model<IStartup>("Startup", StartupSchema);
