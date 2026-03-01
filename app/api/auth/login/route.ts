import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { connectDB as dbConnect } from "@/lib/db";
import { User } from "@/lib/models/User";

async function handler(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { success: false, message: "Method not allowed" },
        { status: 405 },
      );
    }

    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: result.data.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isPasswordValid = await user.comparePassword(result.data.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 },
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const POST = handler;
