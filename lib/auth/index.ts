import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return decoded.id;
  } catch (err) {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const userId = await getAuthUserId();
  return !!userId;
}
