// src/auth/Auth.controller.ts (NEW FILE)
/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateDriverDto } from '../dto/create-driver.dto';
import { LoginDriverDto } from '../dto/login-driver.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ------------------- USER AUTHENTICATION -------------------
  
  @Post('user/signup')
  async userSignup(@Body() createUserDto: CreateUserDto) {
    // Assuming AuthService handles the user creation and token generation internally
    return this.authService.userSignup(createUserDto);
  }

  @Post('user/login')
  async userLogin(@Body() loginUserDto: LoginUserDto) {
    // Assuming AuthService handles user validation and token generation
    return this.authService.userLogin(loginUserDto);
  }

  // ------------------- DRIVER AUTHENTICATION -------------------

  @Post('driver/signup')
  async driverSignup(@Body() createDriverDto: CreateDriverDto) {
    // Assuming AuthService handles the driver creation and token generation
    return this.authService.driverSignup(createDriverDto);
  }

  @Post('driver/login')
  async driverLogin(@Body() loginDriverDto: LoginDriverDto) {
    // Assuming AuthService handles driver validation and token generation
    return this.authService.driverLogin(loginDriverDto);
  }
}