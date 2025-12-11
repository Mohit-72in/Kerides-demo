// src/driver/Driver.service.ts (FINAL CORRECTED VERSION)
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
// 🛑 FIX 1: Removed incorrect DriverDto import and replaced with correct DTOs
import { UpdateDriverProfileDto } from "src/dto/update-driver-profile.dto";
import { Driver, DriverDocument } from "../schemas/Driver.schema"; 

@Injectable()
export class DriverService {
    // Inject the Mongoose Model using the DriverDocument type
    constructor (@InjectModel(Driver.name) private driverModel : Model<DriverDocument> ){}
    
    // ---------------- CREATE DRIVER (Signup) ----------------
    async createDriver(driverData : Partial<Driver>) : Promise<DriverDocument> {
        const newDriver = new this.driverModel(driverData);
        return newDriver.save()
    }

    // ---------------- FIND BY ID (FIX for GET /drivers/details) ----------------
    // 💡 FIX 2: Added findDriverById to match the method used in the Controller
    async findDriverById(id: string): Promise<DriverDocument | null> {
        return this.driverModel.findById(id).select('-password').exec();
    }


    // ---------------- FIND BY EMAIL (Used for Login and Details) ----------------
    // 'withPassword' option is crucial: true for login, false for details/lists.
    async findDriverByEmail(email: string, withPassword: boolean = false): Promise<DriverDocument | null> {
        const lowerEmail = email.trim().toLowerCase();
        let query = this.driverModel.findOne({ email: lowerEmail });

        if (withPassword) {
            query = query.select('+password'); // 💡 Ensure we SELECT the password if needed
        } else {
            query = query.select('-password'); // 💡 Ensure we EXCLUDE the password by default
        }
        
        return query.exec();
    }


    // ---------------- FIND ALL DRIVERS ----------------
    async findAllDrivers() : Promise<DriverDocument[]>  {
        return this.driverModel.find({},'-password').exec() // Exclude password
    }


    // ---------------- UPDATE PROFILE (FIX for POST /drivers/update) ----------------
    // 💡 FIX 3: Renamed updateDriverDetails to updateDriverProfile to match the Controller's call
    async updateDriverProfile(driverId: string, updateData: UpdateDriverProfileDto) : Promise<DriverDocument> {
        // updateData is the DTO which is Partial<Driver>
        const updatedDriver = await this.driverModel.findByIdAndUpdate(
            driverId,          
            { $set: updateData },
            { new: true, runValidators: true },
        ).exec();

        if (!updatedDriver) {
            throw new NotFoundException(`Driver with ID ${driverId} not found`);
        }
        return updatedDriver;
    }
    

    // ---------------- UPDATE PERSONAL INFO ----------------
    async updateDriverPersonalInfo(driverId: string, personalInfo: any ) : Promise<DriverDocument> {
        const updatedDriver = await this.driverModel.findByIdAndUpdate(
          driverId,
          { $set: { personalInfo: personalInfo } }, // Updated to use the passed personalInfo object directly
          { new: true },
        ).exec();
        
        if (!updatedDriver) {
            throw new NotFoundException(`Driver with ID ${driverId} not found`);
        }
        return updatedDriver;
    }
}