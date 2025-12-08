// src/dto/update-vehicle.dto.ts
/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-vehicle.dto';

// This utility makes every field in CreateVehicleDto optional
export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}