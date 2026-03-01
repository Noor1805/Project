import { NextResponse } from "next/server";

export async function GET() {
  const envCheck = {
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    MONGODB_URI: !!process.env.MONGODB_URI,
    MONGODB_URI_PREFIX: process.env.MONGODB_URI
      ? process.env.MONGODB_URI.substring(0, 20) + "..."
      : "NOT SET",
    OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
  };

  // Test MongoDB connection
  let mongoStatus = "NOT TESTED";
  try {
    const { connectDB } = await import("@/lib/db");
    await connectDB();
    mongoStatus = "CONNECTED";
  } catch (error: any) {
    mongoStatus = `FAILED: ${error.message}`;
  }

  return NextResponse.json({
    env: envCheck,
    mongoStatus,
    timestamp: new Date().toISOString(),
  });
}
