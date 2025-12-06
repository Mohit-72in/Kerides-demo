// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/User.module'; 
import { DriverModule } from './driver/Driver.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      // here paste mongo db atlas cluster string
    ),
    AuthModule,
    UserModule,
    DriverModule,
  ],
})
export class AppModule {}


