import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import { encode } from "next-auth/jwt"; // encode JWT like NextAuth

const SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Encode JWT token (NextAuth-compatible)
    const token = await encode({
      token: { id: user._id.toString(), email: user.email },
      secret: SECRET,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // ✅ Set session cookie
    const response = NextResponse.json({ message: "Login successful", user });
    response.cookies.set({
      name: "next-auth.session-token",
      value: token as string,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
