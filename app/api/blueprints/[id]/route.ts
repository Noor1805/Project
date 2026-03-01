import { NextRequest, NextResponse } from "next/server";
import { connectDB as dbConnect } from "@/lib/db";
import { Blueprint } from "@/lib/models/Blueprint";
import { verifyAuth } from "@/lib/middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const payload = await verifyAuth(req);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const blueprint = await Blueprint.findOne({
      _id: params.id,
      userId: payload.userId,
    }).lean();

    if (!blueprint) {
      return NextResponse.json(
        { success: false, message: "Blueprint not found" },
        { status: 404 },
      );
    }

    const bp = blueprint as any;
    return NextResponse.json(
      {
        success: true,
        data: {
          _id: bp._id.toString(),
          id: bp._id.toString(),
          ideaTitle: bp.ideaTitle,
          ideaDescription: bp.ideaDescription,
          targetAudience: bp.targetAudience,
          platformType: bp.platformType,
          budgetRange: bp.budgetRange,
          technicalSkillLevel: bp.technicalSkillLevel,
          criticModeEnabled: bp.criticModeEnabled,
          structuredOutput: bp.structuredOutput,
          createdAt: bp.createdAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get blueprint error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const payload = await verifyAuth(req);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const result = await Blueprint.deleteOne({
      _id: params.id,
      userId: payload.userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Blueprint not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Blueprint deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete blueprint error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
