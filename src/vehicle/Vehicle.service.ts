// src/vehicle/Vehicle.service.ts
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleDto } from 'src/dto/create-vehicle.dto'; 
import { UpdateVehicleDto } from 'src/dto/update-vehicle.dto'; // Import Update DTO
import { Vehicle, VehicleDocument } from 'src/schemas/Vehicle.schema'; 

@Injectable()
export class VehicleService {
    constructor(@InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>) {}

    // ---------------- 1. CREATE VEHICLE ----------------
    async createVehicle(createVehicleDto: CreateVehicleDto): Promise<VehicleDocument> {
        const newVehicle = new this.vehicleModel(createVehicleDto);
        return newVehicle.save();
    }

    // ---------------- 2. FIND ALL VEHICLES ----------------
    async findAllVehicles(): Promise<VehicleDocument[]> {
        return this.vehicleModel.find().exec();
    }

    // ---------------- 3. FIND VEHICLES BY DRIVER ID ----------------
    async findVehiclesByDriverId(driverId: string): Promise<VehicleDocument[]> {
        return this.vehicleModel.find({ driverId }).exec();
    }
    
    // ---------------- 4. FIND VEHICLE BY ID (Internal use) ----------------
    async findVehicleById(id: string): Promise<VehicleDocument | null> {
        return this.vehicleModel.findById(id).exec();
    }

    // ---------------- 5. UPDATE VEHICLE (Security & Concurrency Check) ----------------
    async updateVehicle(
        id: string, 
        updateVehicleDto: Partial<UpdateVehicleDto>, // Use Update DTO type
        driverId: string 
    ): Promise<VehicleDocument> {
        
        const vehicle = await this.vehicleModel.findById(id).exec();

        if (!vehicle) {
            throw new NotFoundException(`Vehicle with ID ${id} not found.`);
        }
        
        // SECURITY CHECK: Verify the vehicle belongs to the logged-in driver
        if (vehicle.driverId !== driverId) {
            throw new ForbiddenException('You do not have permission to update this vehicle.');
        }

        const updatedVehicle = await this.vehicleModel.findByIdAndUpdate(id, updateVehicleDto, {
            new: true, 
            runValidators: true,
        }).exec();
        
        // CONCURRENCY CHECK: Handles if document was deleted during the update transaction
        if (!updatedVehicle) {
            throw new NotFoundException(`Vehicle with ID ${id} was deleted during the update process.`);
        }

        return updatedVehicle;
    }
}