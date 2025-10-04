import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import GoalsNeeds from "@/app/models/GoalsNeeds";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Get user info from NextAuth session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

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
    console.error("GoalsNeeds POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
