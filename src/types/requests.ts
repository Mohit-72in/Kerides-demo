// src/types/requests.ts (FINAL CORRECTED DEFINITION)

import { Request } from 'express'; // 1. Import the base Express Request

// 2. Define the structure placed on the request by JwtStrategy
// Note: This matches what you return in jwt.strategy.ts:
// { userId: payload.sub, email: payload.email, userType: payload.userType }
export interface AuthenticatedUser {
    userId: string;
    email: string;
    // 💡 Must match the corrected property name used in the JWT payload
    userType: 'user' | 'driver'; 
}

// 3. Extend the Express Request interface
export interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser;
}