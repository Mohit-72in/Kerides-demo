// src/types/requests.ts
/* eslint-disable prettier/prettier */
import { Request } from 'express';

// Define the structure of the payload attached by JwtStrategy
interface JwtPayload {
    userId: string; // Corresponds to 'sub' in your JWT payload
    email: string;
    // Add 'type: string' if you included { type: 'driver' } in the JWT
    type?: string; 
}

// Extend the Express Request interface with our custom 'user' property
export interface AuthenticatedRequest extends Request {
    user: JwtPayload;
}