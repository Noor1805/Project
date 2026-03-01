import mongoose, { Schema, Document } from "mongoose";
import { BlueprintData } from "@/types";

export interface IBlueprint extends Document {
  userId: mongoose.Types.ObjectId;
  ideaTitle: string;
  ideaDescription: string;
  targetAudience: string;
  platformType: string;
  budgetRange: string;
  technicalSkillLevel: string;
  criticModeEnabled: boolean;
  structuredOutput: BlueprintData;
  createdAt: Date;
  updatedAt: Date;
}

const blueprintSchema = new Schema<IBlueprint>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ideaTitle: {
      type: String,
      required: true,
      trim: true,
    },
    ideaDescription: {
      type: String,
      required: true,
    },
    targetAudience: {
      type: String,
      required: true,
    },
    platformType: {
      type: String,
      required: true,
    },
    budgetRange: {
      type: String,
      required: true,
    },
    technicalSkillLevel: {
      type: String,
      required: true,
    },
    criticModeEnabled: {
      type: Boolean,
      default: false,
    },
    structuredOutput: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster user queries
blueprintSchema.index({ userId: 1, createdAt: -1 });

// Force model refresh in development to avoid cached issues
if (mongoose.models.Blueprint) {
  delete mongoose.models.Blueprint;
}

export const Blueprint = mongoose.model<IBlueprint>(
  "Blueprint",
  blueprintSchema,
);
