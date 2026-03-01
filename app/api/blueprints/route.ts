import { NextRequest, NextResponse } from "next/server";
import { blueprintInputSchema } from "@/lib/validation";
import { connectDB as dbConnect } from "@/lib/db";
import { Blueprint } from "@/lib/models/Blueprint";
import { verifyAuth } from "@/lib/middleware";
import { generateBlueprint } from "@/services/aiService";

async function handleGET(req: NextRequest) {
  try {
    const payload = await verifyAuth(req);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const blueprints = await Blueprint.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: blueprints.map((bp: any) => ({
          _id: bp._id.toString(),
          id: bp._id.toString(),
          ideaTitle: bp.ideaTitle,
          ideaDescription: bp.ideaDescription,
          criticModeEnabled: bp.criticModeEnabled,
          createdAt: bp.createdAt,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get blueprints error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

async function handlePOST(req: NextRequest) {
  try {
    const payload = await verifyAuth(req);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const result = blueprintInputSchema.safeParse(body);

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

    const blueprintOutput = await generateBlueprint(
      result.data.ideaTitle,
      result.data.ideaDescription,
      result.data.targetAudience,
      result.data.platformType,
      result.data.budgetRange,
      result.data.technicalSkillLevel,
      result.data.criticModeEnabled,
    );

    const blueprint = new Blueprint({
      userId: payload.userId,
      ideaTitle: result.data.ideaTitle,
      ideaDescription: result.data.ideaDescription,
      structuredOutput: blueprintOutput,
      criticModeEnabled: result.data.criticModeEnabled,
    });

    await blueprint.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: blueprint._id.toString(),
          id: blueprint._id.toString(),
          ideaTitle: blueprint.ideaTitle,
          structuredOutput: blueprint.structuredOutput,
          createdAt: blueprint.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create blueprint error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  return handleGET(req);
}

export async function POST(req: NextRequest) {
  return handlePOST(req);
}
