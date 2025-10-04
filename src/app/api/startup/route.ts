// app/api/startup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Startup from "@/app/models/Startup";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Get userId from NextAuth session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // ✅ Parse request body
    const body = await req.json();
    const { startupName, industrySector, description, stage } = body;

    // ✅ Validate required fields
    if (!startupName || !industrySector || !description || !stage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Create new startup document
    const newStartup = new Startup({
      startupName,
      industrySector,
      description,
      stage,
      userId, // From session
    });

    await newStartup.save();

    return NextResponse.json(
      { message: "Startup saved successfully", startup: newStartup },
      { status: 201 }
    );
  } catch (error) {
    console.error("Startup POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
