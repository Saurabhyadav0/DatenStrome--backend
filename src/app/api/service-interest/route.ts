import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import ServiceInterest from "@/app/models/ServiceInterest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Save or update user services
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Get userId from NextAuth session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await req.json();
    const { services } = body;

    if (!services || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json({ error: "Services are required" }, { status: 400 });
    }

    const updatedServices = await ServiceInterest.findOneAndUpdate(
      { userId },
      { services },
      { new: true, upsert: true } // create if not exists
    );

    return NextResponse.json({
      message: "Service interests saved",
      data: updatedServices,
    });
  } catch (error) {
    console.error("ServiceInterest POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Fetch user services
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Get userId from session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const services = await ServiceInterest.findOne({ userId });

    if (!services) {
      return NextResponse.json({ message: "No services found" }, { status: 404 });
    }

    return NextResponse.json({ services });
  } catch (error) {
    console.error("ServiceInterest GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
