// src/users/User.controller.ts (FINAL SYNCHRONIZED CODE)
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from './User.service';
import type { AuthenticatedRequest } from 'src/types/requests';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  // ------------------- GET ALL USERS (PROTECTED: /users/userList) -------------------
  @UseGuards(JwtAuthGuard)
  @Get('userList')
  async getAllUsers(@Req() req: AuthenticatedRequest) {
    try {
      const users = await this.userService.findAllUsers();
      return { users };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new HttpException(
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ------------------- GET USER DETAILS (Public lookup by email: /users/userDetails/:email) -------------------
  @Get('userDetails/:email')
  async getUserDetails(@Param('email') email: string) {
    try {
      const userData = await this.userService.findUserByEmail(email, 'details');
      if (!userData) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
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

  // ------------------- UPDATE USER PROFILE (PROTECTED: /users/update) -------------------
  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateUserInfo(
    @Body() updateDto: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      const userId = req.user.userId;
      const updatedUser = await this.userService.updateUserById(userId, updateDto);

      const { password, ...result } = updatedUser.toObject();
      return { message: 'User updated successfully', data: result };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Error updating user:', error);
      throw new HttpException('Error updating user profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}