import { NextRequest, NextResponse } from "next/server";

// Legacy route from before NextAuth migration.
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { success: false, message: "Refresh token is handled by NextAuth." },
    { status: 410 },
  );
}
