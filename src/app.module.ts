// src/app.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 💡 Import ConfigService here
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/User.module'; 
import { DriverModule } from './driver/Driver.module';
import { VehicleModule } from './vehicle/Vehicle.module';

@Module({
  imports: [
    // 1. Load the .env file globally
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    
    // 2. Asynchronously connect Mongoose using the ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // Safely retrieves the MONGODB_URI from the .env file
        uri: configService.get<string>('MONGODB_URI'), 
      }),
      inject: [ConfigService],
    }),
    
    // 3. Application Feature Modules
    AuthModule,
    UserModule,
    DriverModule,
    VehicleModule,
  ],
})
export class AppModule {}