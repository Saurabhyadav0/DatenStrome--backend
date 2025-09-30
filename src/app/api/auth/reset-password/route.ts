// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { token, newPassword } = await req.json();

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    // Hash the new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update user password
    await User.findByIdAndUpdate(decoded.id, { password: hashed });

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
  }
}
