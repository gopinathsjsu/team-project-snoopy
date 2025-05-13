import jwt from "jsonwebtoken";

export type UserRole = "customer" | "manager" | "admin";

const JWT_SECRET = process.env.JWT_SECRET ?? "abrakadabra";

export interface JWTPayload {
  user_id: number;
  email: string;
  username: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string): JWTPayload | null {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
