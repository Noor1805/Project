import jwt from "jsonwebtoken";
import { TokenPayload } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";
const JWT_REFRESH_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "dev-refresh-secret-key";
const JWT_EXPIRY = process.env.JWT_EXPIRATION || "15m";
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRATION || "7d";

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign({ ...payload }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY as any,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign({ ...payload }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY as any,
  });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function generateTokens(payload: TokenPayload): {
  accessToken: string;
  refreshToken: string;
} {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}
