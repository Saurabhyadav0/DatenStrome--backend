import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Scenario from "@/app/models/senario";
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
    const { scenario } = body;

    if (!scenario) {
      return NextResponse.json({ error: "Scenario is required" }, { status: 400 });
    }

    // ✅ Update or create scenario for the logged-in user
    const updatedScenario = await Scenario.findOneAndUpdate(
      { userId },
      { scenario },
      { new: true, upsert: true } // create if not exists
    );

    return NextResponse.json({ message: "Scenario saved", updatedScenario });
  } catch (error) {
    console.error("Scenario POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
