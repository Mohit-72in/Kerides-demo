// src/dto/create-vehicle.dto.ts

import {
    IsString,
    IsNumber,
    IsArray,
    IsOptional,
    IsObject,
    ValidateNested, // <--- Necessary for nested DTOs
    MinLength,
} from 'class-validator'; // <-- Complete this import list

import { Type } from 'class-transformer'; // <-- Keep this separate for clarity

class FareStructureDto {
    @IsNumber() minimumFare: number;
    @IsNumber() perKilometerRate: number;
    @IsNumber() waitingChargePerMinute: number;
    @IsNumber() cancellationFee: number;
}

export class CreateVehicleDto {
    @IsString() make: string;
    @IsString() vehicleModel: string;
    @IsNumber() year: number;
    @IsNumber() seatsNo: number;
    @IsString() @MinLength(4) licensePlate: string;
    @IsString() vehicleClass: string;
    @IsString() vehicleType: string;
    
    @IsArray() @IsOptional() @IsString({ each: true }) vehicleImages?: string[];
    
    @IsObject() @IsOptional()
    documents?: {
        Driving_Licence?: string;
        Police_Clearance_Certificate?: string;
        Proof_Of_Address?: string;
        Vehicle_Insurance_Proof?: string;
    };
    
    @IsObject() @ValidateNested() @Type(() => FareStructureDto)
    fareStructure: FareStructureDto;

    // This field is injected by the controller, not provided in the request body.
    @IsString() @IsOptional() driverId?: string; 
}