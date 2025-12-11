// src/auth/Auth.module.ts (UPDATED)

import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ConfigService is needed here
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller'; // 💡 NEW: Import the central controller
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';
import { Driver, DriverSchema } from 'src/schemas/Driver.schema';

@Module({
  imports: [
    PassportModule,
    ConfigModule, // Ensure ConfigModule is imported
    MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: Driver.name, schema: DriverSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Make sure imports is here if using ConfigService
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get<string>('JWT_EXPIRY');

        if (!secret) {
          throw new Error('JWT_SECRET environment variable is required');
        }
        
        if (!expiresIn) {
          throw new Error('JWT_EXPIRY environment variable is required');
        }

        return {
          secret,
          signOptions: { expiresIn: expiresIn as any },
        };
      },
    }),
  ],
  controllers: [AuthController], // 💡 REGISTERED HERE
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}