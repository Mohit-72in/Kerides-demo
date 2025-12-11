// src/dto/create-driver.dto.ts
import { IsString, IsEmail, IsNotEmpty, MinLength, IsBoolean, IsNumberString, IsNumber } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(8)
  readonly password: string;

  @IsNumber()
  @IsNotEmpty()
  readonly phone: number; // Assuming MongoDB stores this as a number

  @IsString()
  @IsNotEmpty()
  readonly drivinglicenseNo: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly agreement: boolean; // Must agree to terms
}