import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import mongoose from "mongoose";
import EventChoices from "@/app/models/EventChoices";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Get userId from middleware header
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Explicitly type request body
    const {
      preferredLocation,
      eventTypeInterest,
    }: {
      preferredLocation: string;
      eventTypeInterest: string;
    } = await req.json();

    if (!preferredLocation || !eventTypeInterest) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if user already has choices
    let eventChoice = await EventChoices.findOne({ userId });

    if (eventChoice) {
      // Update existing
      eventChoice.preferredLocation = preferredLocation;
      eventChoice.eventTypeInterest = eventTypeInterest;
      await eventChoice.save();
    } else {
      // Create new
      eventChoice = await EventChoices.create({
        userId: new mongoose.Types.ObjectId(userId),
        preferredLocation,
        eventTypeInterest,
      });
    }

    return NextResponse.json({ success: true, data: eventChoice });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("EventChoices POST error:", error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    console.error("Unexpected EventChoices error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
