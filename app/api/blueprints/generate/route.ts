import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Blueprint } from "@/lib/models/Blueprint";
import { verifyAuth } from "@/lib/middleware";
import { validateBlueprintRequest } from "@/lib/validation";
import { generateBlueprint } from "@/services/aiService";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    const directToken = await getToken({
      req: request,
      secret: secret,
    });

    console.log(
      `[DEBUG] getToken direct: ${!!directToken}, secret: ${!!secret}`,
    );

    const payload = await verifyAuth(request);
    if (!payload || !payload.userId) {
      const allCookies = request.cookies.getAll();
      const sessionCookie =
        request.cookies.get("next-auth.session-token") ||
        request.cookies.get("__Secure-next-auth.session-token");
      const cookieNames = allCookies.map((c) => c.name).join(", ") || "none";
      const cookieValueStart = sessionCookie
        ? sessionCookie.value.substring(0, 15) + "..."
        : "N/A";

      const payloadError = (payload as any)?.error || "None (Null Payload)";
      const idLength = (payload as any)?.token?.id?.length || "N/A";

      return NextResponse.json(
        {
          success: false,
          error: `Unauthorized: error='${payloadError}', idLen=${idLength}, directToken=${!!directToken}`,
        },
        { status: 401 },
      );
    }

    console.log("DEBUG: Processing generation for userId:", payload.userId);

    // Final sanity check before BSON conversion
    if (!payload.userId || payload.userId.length !== 24) {
      console.error(
        "CRITICAL: Final ID check FAILED in route:",
        payload.userId,
      );
      return NextResponse.json(
        {
          success: false,
          error: `Account Sync Error. Please Sign Out and Sign In again once. (Technical: ID_${payload.userId})`,
        },
        { status: 400 },
      );
    }

    await connectDB();
    const mongoose = require("mongoose");

    const body = await request.json();
    const validated = validateBlueprintRequest(body);

    // Generate blueprint using AI
    const blueprintData = await generateBlueprint(
      validated.ideaTitle,
      validated.ideaDescription,
      validated.targetAudience,
      validated.platformType,
      validated.budgetRange,
      validated.technicalSkillLevel,
      validated.criticModeEnabled,
    );

    // Save to database
    const blueprint = await Blueprint.create({
      userId: new mongoose.Types.ObjectId(payload.userId),
      ideaTitle: validated.ideaTitle,
      ideaDescription: validated.ideaDescription,
      targetAudience: validated.targetAudience,
      platformType: validated.platformType,
      budgetRange: validated.budgetRange,
      technicalSkillLevel: validated.technicalSkillLevel,
      criticModeEnabled: validated.criticModeEnabled,
      structuredOutput: blueprintData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Blueprint generated successfully",
        data: {
          _id: blueprint._id.toString(),
          ideaTitle: blueprint.ideaTitle,
          createdAt: blueprint.createdAt,
          structuredOutput: blueprint.structuredOutput,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Blueprint generation error:", error);
    const message =
      error instanceof Error ? error.message : "Blueprint generation failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    );
  }
}
