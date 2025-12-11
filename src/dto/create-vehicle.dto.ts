// src/dto/create-vehicle.dto.ts
import { IsString, IsNumber, IsArray, IsOptional, ValidateNested, MinLength, IsNotEmpty, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

// Nested DTO for fare structure
export class FareStructureDto {
  @IsNumber()
  @IsNotEmpty()
  minimumFare: number;

  @IsNumber()
  @IsNotEmpty()
  perKilometerRate: number;

  @IsNumber()
  @IsNotEmpty()
  waitingChargePerMinute: number;

  @IsNumber()
  @IsNotEmpty()
  cancellationFee: number;
}

export class CreateVehicleDto {
  // This is set automatically by the controller from the JWT
  @IsString()
  @IsOptional()
  driverId: string; 

  @IsString()
  @IsNotEmpty()
  readonly make: string;

  @IsString()
  @IsNotEmpty()
  readonly vehicleModel: string;

  @IsNumber()
  @IsNotEmpty()
  readonly year: number;

  @IsNumber()
  @IsNotEmpty()
  readonly seatsNo: number;

  @IsString()
  @IsNotEmpty()
  readonly licensePlate: string;

  @IsString()
  @IsNotEmpty()
  readonly vehicleClass: string;

  @IsString()
  @IsNotEmpty()
  readonly vehicleType: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly vehicleImages?: string[];

  @IsObject()
  @ValidateNested()
  @Type(() => FareStructureDto)
  readonly fareStructure: FareStructureDto;
}