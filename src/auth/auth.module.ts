// src/auth/auth.module.ts
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { authConstants } from './auth.constants';
import { JwtStrategy } from './jwt.strategy'; 

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: authConstants.secret,
      signOptions: { expiresIn: '1d' }, 
    }),
  ],
  providers: [AuthService, JwtStrategy], 
  exports: [AuthService],
})
export class AuthModule {}