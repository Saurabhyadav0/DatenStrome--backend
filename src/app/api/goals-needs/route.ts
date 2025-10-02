import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import GoalsNeeds from "@/app/models/GoalsNeeds";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ✅ User info from middleware headers
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mainGoal, preference, targetMarket, timeline } = body;

    if (!mainGoal || !preference || !targetMarket || !timeline) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newGoalsNeeds = new GoalsNeeds({
      userId,
      mainGoal,
      preference,
      targetMarket,
      timeline,
    });

    await newGoalsNeeds.save();

    return NextResponse.json(
      { message: "Goals & Needs saved successfully", data: newGoalsNeeds },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
