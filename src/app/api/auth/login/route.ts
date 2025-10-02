import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Explicitly type request body
    const { email, password }: { email: string; password: string } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ token, user }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Login error:", err.message);
    } else {
      console.error("Unexpected login error:", err);
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
