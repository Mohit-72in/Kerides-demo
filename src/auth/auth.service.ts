// src/auth/auth.service.ts
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Hash password
  async hashPassword(password: string): Promise<string> {
    // 10 is the salt rounds
    return bcrypt.hash(password, 10); 
  }

  // Compare password
  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate JWT token
  generateToken(payload: object): string {
    return this.jwtService.sign(payload);
  }
}