import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation";
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
    const result = registerSchema.safeParse(body);

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

    const existingUser = await User.findOne({ email: result.data.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already in use" },
        { status: 409 },
      );
    }

    const user = new User({
      name: result.data.name,
      email: result.data.email,
      password: result.data.password,
    });

    await user.save();

    const response = NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const POST = handler;
