// src/vehicle/Vehicle.module.ts
/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
// 💡 Corrected Path: Importing components with correct PascalCase filename
import { VehicleController } from "./Vehicle.controller";
import { VehicleService } from "./Vehicle.service"; 

// 💡 Centralized Schema Import
import { Vehicle, VehicleSchema } from "src/schemas/Vehicle.schema"; 
import { AuthModule } from 'src/auth/auth.module'; // Needed for security

@Module({
    imports : [
        MongooseModule.forFeature([{
            name : Vehicle.name ,
            schema :VehicleSchema ,
        }]),
        AuthModule // Essential for the JwtAuthGuard used in the controller
    ] ,
    providers : [ VehicleService ] ,
    controllers:[VehicleController]
})
export class VehicleModule {
    // Note: The configure() method for middleware is omitted, as security uses Guards.
}