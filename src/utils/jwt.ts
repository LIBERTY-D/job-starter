import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

export function generateToken(payload: string) {
  return jwt.sign({ sub: payload }, process.env.NEXT_JWT_SECRET!, {
    expiresIn: process.env.NEXT_JWT_EXP!,
  });
}

export async function decodeToken(token: string) {
  const secret = new TextEncoder().encode(process.env.NEXT_JWT_SECRET!);
  // Verify and decode the token
  const decoded = await jwtVerify(token, secret);
  return decoded;
}
