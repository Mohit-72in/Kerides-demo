// src/dto/update-driver-profile.dto.ts
import { IsString, IsOptional, IsNumber, MinLength, IsBoolean } from 'class-validator';

export class UpdateDriverProfileDto {
  @IsOptional()
  @IsNumber()
  readonly phone?: number;

  @IsOptional()
  @IsString()
  @MinLength(8)
  readonly password?: string;

  @IsOptional()
  @IsString()
  readonly drivinglicenseNo?: string;

  @IsOptional()
  @IsBoolean()
  readonly agreement?: boolean;
}