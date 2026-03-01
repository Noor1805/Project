import mongoose, { Schema, Document } from "mongoose";
import bcryptjs from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: false,
      minlength: 8,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// Force model refresh in development to avoid cached hooks
if (mongoose.models.User) {
  delete mongoose.models.User;
}

// Hash password before saving
userSchema.pre<IUser>("save", async function () {
  console.log("[USER_MODEL] pre-save hook triggered (async version)");
  if (!this.isModified("password") || !this.password) {
    return;
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcryptjs.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
