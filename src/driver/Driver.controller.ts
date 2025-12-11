// src/driver/Driver.controller.ts (FINAL SYNCHRONIZED CODE)
/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Post,
    Get,
    UseGuards,
    Req,
    HttpException,
    HttpStatus,
    NotFoundException,
} from '@nestjs/common';
import { DriverService } from './Driver.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// Using 'type' for clean import of interface
import type { AuthenticatedRequest } from 'src/types/requests'; 
import { UpdateDriverProfileDto } from 'src/dto/update-driver-profile.dto';

@Controller('drivers')
export class DriverController {
    constructor(private readonly driverService: DriverService) {}
    
    // 🛑 SIGNUP/LOGIN ROUTES ARE CENTRALIZED IN AUTH.CONTROLLER.TS 🛑

    // ------------------- GET ALL (PROTECTED: /drivers/list) -------------------
    @UseGuards(JwtAuthGuard)
    @Get('list')
    async getAll() {
        try {
            // SYNCED: Calls the correct service method
            const drivers = await this.driverService.findAllDrivers(); 
            return { drivers };
        } catch (error) {
            console.error('Error retrieving drivers:', error);
            throw new HttpException('Error retrieving driver data', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ------------------- GET DETAILS (PROTECTED: /drivers/details) -------------------
    @UseGuards(JwtAuthGuard)
    @Get('details')
    async getDriverDetails(@Req() req: AuthenticatedRequest) {
        try {
            // Securely retrieve the driver's ID from the JWT payload
            const driverId = req.user.userId;
            
            // SYNCED: Calls the findDriverById service method
            const userData = await this.driverService.findDriverById(driverId);
            
            if (!userData) {
                throw new NotFoundException('Driver Not Found');
            }

            // Omit password before returning the data
            const { password, ...driverResult } = userData.toObject(); 
            return { userData: driverResult };

        } catch (error) {
            if (error instanceof HttpException) throw error;
            console.error('Error getting driver data:', error);
            throw new HttpException('Error getting driver data', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ------------------- UPDATE DRIVER PROFILE (PROTECTED: /drivers/update) -------------------
    @UseGuards(JwtAuthGuard)
    @Post('update')
    async updateDriver(
        @Body() updateDto: UpdateDriverProfileDto,
        @Req() req: AuthenticatedRequest,
    ) {
        try {
            const driverId = req.user.userId;
            // SYNCED: Calls the updateDriverProfile service method
            const updatedDriver = await this.driverService.updateDriverProfile(driverId, updateDto);

            // Omit password from response
            const { password, ...driverResult } = updatedDriver.toObject();
            return { message: 'Driver updated successfully', data: driverResult };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            console.error('Error updating driver:', error);
            throw new HttpException('Error updating driver profile', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } 

    // ------------------- UPDATE DRIVER PERSONAL INFO (PROTECTED: /drivers/updatePersonalInfo) -------------------
    @UseGuards(JwtAuthGuard)
    @Post('updatePersonalInfo')
    async updateDriverPersonalInfo(
        @Body() body: { personalInfo: any },
        @Req() req: AuthenticatedRequest,
    ) {
        try {
            const driverId = req.user.userId;
            // SYNCED: Calls the updateDriverPersonalInfo service method
            const updatedDriver = await this.driverService.updateDriverPersonalInfo(driverId, body.personalInfo);

            // Omit password from response
            const { password, ...driverResult } = updatedDriver.toObject();
            return { message: 'Driver personal info updated successfully', data: driverResult };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            console.error('Error updating driver personal info:', error);
            throw new HttpException('Error updating driver profile', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}