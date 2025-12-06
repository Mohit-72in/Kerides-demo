// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/User.module'; 
import { DriverModule } from './driver/Driver.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mohityadav950410s_db_user:nestStudent@cluster1.2krpsb0.mongodb.net/?appName=Cluster1'
    ),
    AuthModule,
    UserModule,
    DriverModule,
  ],
})
export class AppModule {}


