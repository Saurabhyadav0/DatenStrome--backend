import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { firstName, lastName, email, role, experienceLevel, password } =
      await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      role,
      experienceLevel,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User created", user }, { status: 201 });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
