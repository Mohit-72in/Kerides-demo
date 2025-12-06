// src/users/User.controller.ts
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpStatus,
  HttpException,
  UseGuards, 
  Req, 
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard'; 

import { UserService } from './User.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/schemas/User.schema';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  
  // ------------------- SIGNUP -------------------
  @Post('signup')
  async signup(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
    },
  ) {
    try {
      const isUserExist = await this.userService.findByEmail(body.email);

      if (isUserExist) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      const hashedPassword = await this.authService.hashPassword(
        body.password,
      );

      const user: Partial<User> = {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      };

      const createdUser = await this.userService.createUser(user);

      // Omit password from response
      const { password, ...result } = createdUser.toObject(); 

      return {
        status: 201,
        message: 'User created successfully',
        user: result,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error('Error during signup:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ------------------- LOGIN -------------------
  @Post('login')
  async userLogin(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.userService.findByEmail(body.email);

      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const isPasswordValid = await this.authService.comparePasswords(
        body.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      
      // 💡 FIX: Generate and return JWT Token
      const payload = { 
        email: user.email, 
        // Use user._id from Mongoose document as the 'sub'
        sub: user._id.toString() 
      }; 
      const access_token = this.authService.generateToken(payload);
      
      // Extract user info to return in response
      const { password, ...userData } = user.toObject();

      return {
        status: 200,
        message: 'Login successful',
        access_token, // Returns the JWT
        user: userData, // Returns non-sensitive user data
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Error during login:', error);
      throw new HttpException(
        'User Login Failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ------------------- GET ALL USERS (PROTECTED) -------------------
  @UseGuards(JwtAuthGuard) 
  @Get('userList')
  async getAllUsers(@Req() req: any) { 
    // req.user contains { userId: payload.sub, email: payload.email }
    try {
      const users = await this.userService.findUsers();
      return { users };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new HttpException(
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ------------------- GET USER DETAILS -------------------
  // NOTE: This route is UNPROTECTED and relies on email lookup
  @Get('userDetails/:email') 
  async getUserDetails(@Param('email') email: string) {
    try {
      const userData = await this.userService.findByEmail(email, 'details');
      if (!userData) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      
      // Password is already excluded by UserService logic

      return { userData };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Error fetching user details:', error);
      throw new HttpException(
        'Failed to fetch user details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}