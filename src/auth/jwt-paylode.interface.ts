// src/auth/jwt-payload.interface.ts (CORRECTED)
export interface JwtPayload {
  sub: string;
  email: string;
  userType: 'user' | 'driver'; // 💡 Changed from 'type'
  iat?: number;
  exp?: number;
}