import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Scenario from "@/app/models/senario";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Get userId from middleware (x-user-id header)
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { scenario } = body;

    if (!scenario) {
      return NextResponse.json({ error: "Scenario is required" }, { status: 400 });
    }

    // ✅ Update scenario for the logged-in user
    const updatedScenario = await Scenario.findOneAndUpdate(
      { userId },
      { scenario },
      { new: true, upsert: true } // ⚡ add upsert to create if not exists
    );

    return NextResponse.json({ message: "Scenario saved", updatedScenario });
  } catch (error) {
    console.error("Scenario error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
