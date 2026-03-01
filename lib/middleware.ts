import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { connectDB } from "./db";
import { User } from "./models/User";

export async function verifyAuth(request: NextRequest) {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({
      req: request,
      secret: secret,
    });

    if (!token) {
      console.log("[AUTH] verifyAuth: No token found. Secret set:", !!secret);
      return null;
    }

    // Now 'token' is guaranteed to exist for the rest of the block

    // NUCLEAR DEBUG: FORCE REVEAL TOKEN DATA
    // throw new Error(`DIAGNOSTIC_DATA: ${JSON.stringify({
    //   tokenId: token.id,
    //   tokenEmail: token.email,
    //   tokenName: token.name,
    //   envSecretSet: !!process.env.NEXTAUTH_SECRET,
    //   envMongoSet: !!process.env.MONGODB_URI
    // })}`);

    let userId = String(token.id || "");
    console.log(
      `[AUTH] verifyAuth: Initial userId=${userId}, email=${token.email}`,
    );

    // MongoDB ObjectIds are EXACTLY 24 hex characters.
    // Google IDs are typically 21 numeric characters.
    // If the ID is not a 24-char hex string, it's likely a Google ID
    if (token && userId && userId.length !== 24) {
      console.log(`[AUTH] verifyAuth: Normalizing non-24 char ID: ${userId}`);
      try {
        await connectDB();
        console.log("[AUTH] verifyAuth: DB connected for normalization");

        let dbUser = await User.findOne({ email: token.email });
        console.log(`[AUTH] verifyAuth: DB lookup result found=${!!dbUser}`);

        if (!dbUser && token.email) {
          console.log(`[AUTH] verifyAuth: Creating newUser for ${token.email}`);
          dbUser = await User.create({
            name: token.name || "User",
            email: token.email,
          });
          console.log(`[AUTH] verifyAuth: Created newUser ID=${dbUser._id}`);
        }

        if (dbUser) {
          userId = dbUser._id.toString();
          console.log(`[AUTH] verifyAuth: Normalized to ${userId}`);
        } else {
          // Instead of returning null, return specific error info
          return {
            userId: null,
            error: `Normalization Failed: No dbUser for ${token.email}. token.id=${token.id}`,
            token,
          };
        }
      } catch (err: any) {
        console.error("[AUTH] verifyAuth: Database operation failed:", err);
        return {
          userId: null,
          error: `DB_ERROR: ${err.message}`,
          token,
        };
      }
    }

    return {
      userId: userId || null,
      email: token?.email,
      name: token?.name,
    };
  } catch (error) {
    console.error("[AUTH] verifyAuth: Critical Exception:", error);
    return null;
  }
}

export function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    const payload = await verifyAuth(request);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    return handler(request, payload);
  };
}
