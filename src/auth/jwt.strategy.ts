// src/auth/jwt.strategy.ts (FINAL CORRECTED VERSION)
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config"; 
import { JwtPayload } from './jwt-paylode.interface'; // Assuming this interface is correct

@Injectable()
// Inject ConfigService into the Strategy's constructor
export class JwtStrategy extends PassportStrategy(Strategy) {
 constructor(private readonly configService: ConfigService) {
    
    // FIX: Pass the secret retrieved from the ConfigService to super()
    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-token'), 
      ignoreExpiration: false, 
      secretOrKey: configService.get<string>('JWT_SECRET'), // 💡 Key is now secure and synchronized
    });
 }

  async validate(payload: JwtPayload) {
      if (!payload.sub || !payload.email) {
            throw new UnauthorizedException('Invalid token payload');
      }
      // 💡 Attach userType to the request object (req.user.userType)
      return { 
          userId: payload.sub, 
          email: payload.email, 
          userType: payload.userType 
      };
    }
}