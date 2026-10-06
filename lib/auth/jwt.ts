import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const JWT_ALG = "HS256";
const TOKEN_TTL = "7d";

export interface AdminSessionPayload extends JWTPayload {
  sub: string; // AdminUser _id
  email: string;
  name: string;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_SECRET is not set (or is too short). Add a long random string to your .env.local file (see .env.local.example)."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(payload: Omit<AdminSessionPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(getSecretKey());
}

export async function verifyAdminToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: [JWT_ALG] });
    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}
