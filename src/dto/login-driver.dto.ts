// src/dto/login-driver.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDriverDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}