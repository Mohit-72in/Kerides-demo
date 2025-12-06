/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver, DriverSchema } from '../schemas/Driver.schema'; 
import { DriverService } from '../driver/Driver.service';
import { DriverController } from '../driver/Driver.controller';
import { AuthModule } from 'src/auth/auth.module'; // Import AuthModule

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Driver.name,
        schema: DriverSchema, 
      },
    ]),
    AuthModule, // 💡 Essential for using AuthService (hashing/JWT generation)
  ],
  providers: [DriverService],
  controllers: [DriverController],
})
export class DriverModule {}