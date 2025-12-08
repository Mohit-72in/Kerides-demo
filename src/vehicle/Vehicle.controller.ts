// src/vehicle/Vehicle.controller.ts
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put, UseGuards, Req } from '@nestjs/common';
import { VehicleService } from './Vehicle.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; 
import { CreateVehicleDto } from 'src/dto/create-vehicle.dto'; // Centralized path
import { UpdateVehicleDto } from 'src/dto/update-vehicle.dto'; // Centralized path
import * as requests from 'src/types/requests'; // Import custom request type

@Controller('vehicles')
export class VehicleController {
    constructor(private readonly vehicleService: VehicleService) {}

    // ------------------- CREATE VEHICLE (POST /vehicles) -------------------
    @Post()
    @UseGuards(JwtAuthGuard) 
    async create(@Body() createVehicleDto: CreateVehicleDto, @Req() req: requests.AuthenticatedRequest) {
        // Inject driverId from the JWT payload
        createVehicleDto.driverId = req.user.userId; 
        
        return this.vehicleService.createVehicle(createVehicleDto); 
    }

    // ------------------- GET ALL VEHICLES (UNPROTECTED: GET /vehicles) -------------------
    @Get()
    findAll() {
        return this.vehicleService.findAllVehicles(); 
    }

    // ------------------- GET VEHICLES BY DRIVER (Protected: GET /vehicles/my-list) -------------------
    @UseGuards(JwtAuthGuard)
    @Get('my-list')
    async findByDriver(@Req() req: requests.AuthenticatedRequest) {
        const driverId = req.user.userId; 
        return this.vehicleService.findVehiclesByDriverId(driverId); 
    }

    // ------------------- UPDATE VEHICLE (PUT /vehicles/:id) -------------------
    @UseGuards(JwtAuthGuard)
    @Put(':id') 
    async updateVehicle(
        @Param('id') id: string,
        @Body() updateVehicleDto: UpdateVehicleDto, // Use the Partial DTO for update
        @Req() req: requests.AuthenticatedRequest,
    ) {
        const driverId = req.user.userId;
        // Pass the driverId to the service for the ownership and security check
        return this.vehicleService.updateVehicle(id, updateVehicleDto, driverId);
    }
}