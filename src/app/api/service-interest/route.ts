import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import ServiceInterest from "@/app/models/ServiceInterest";

// Save or update user services
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { services } = body;

    if (!services || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json({ error: "Services are required" }, { status: 400 });
    }

    // ✅ Save or update
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
    console.error("Service interest error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Fetch user services
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const services = await ServiceInterest.findOne({ userId });

    if (!services) {
      return NextResponse.json({ message: "No services found" }, { status: 404 });
    }

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Service interest fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
