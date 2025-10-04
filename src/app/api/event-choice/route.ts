import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/app/lib/db";
import mongoose from "mongoose";
import EventChoices from "@/app/models/EventChoices";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Get session from NextAuth
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const { preferredLocation, eventTypeInterest }: { preferredLocation: string; eventTypeInterest: string } = await req.json();

    if (!preferredLocation || !eventTypeInterest) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if user already has choices
    let eventChoice = await EventChoices.findOne({ userId });

    if (eventChoice) {
      eventChoice.preferredLocation = preferredLocation;
      eventChoice.eventTypeInterest = eventTypeInterest;
      await eventChoice.save();
    } else {
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Unexpected EventChoices error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
