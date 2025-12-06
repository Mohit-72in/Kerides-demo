// src/auth/jwt.strategy.ts
/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { authConstants } from "./auth.constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
 constructor() {
    super({
      // Use ExtractJwt.fromHeader() to look for the custom header named 'x-token'
      jwtFromRequest: ExtractJwt.fromHeader('x-token'), 
      ignoreExpiration: false, 
      secretOrKey: authConstants.secret, 
    });
 }

  async validate(payload: any) {
    // This object is attached to req.user
    return { userId: payload.sub, email: payload.email }; 
  }
}