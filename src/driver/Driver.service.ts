/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DriverDto } from "src/dto/driver.dto";
import { Driver, DriverDocument } from "../schemas/Driver.schema"; // Corrected relative path

@Injectable()
export class DriverService {
    // Inject the Mongoose Model using the DriverDocument type
    constructor (@InjectModel(Driver.name) private driverModel : Model<DriverDocument> ){}
    
    // ---------------- CREATE DRIVER (Signup) ----------------
    async createDriver(driverData : Partial<Driver>) : Promise<DriverDocument> {
        const newDriver = new this.driverModel(driverData);
        return newDriver.save()
    }

    // ---------------- FIND BY EMAIL (Used for Login and Details) ----------------
    // 'withPassword' option is crucial: true for login, false for details/lists.
    async findDriverByEmail(email: string, withPassword: boolean = false): Promise<DriverDocument | null> {
        const lowerEmail = email.trim().toLowerCase();
        let query = this.driverModel.findOne({ email: lowerEmail });

        if (!withPassword) {
            query = query.select('-password'); 
        }
        
        return query.exec();
    }


    // ---------------- FIND ALL DRIVERS ----------------
    async findAllDrivers() : Promise<DriverDocument[]>  {
        return this.driverModel.find({},'-password').exec() // Exclude password
    }


    // ---------------- UPDATE PERSONAL INFO ----------------
    async updateDriverPersonalInfo(userEmail: string, body: { personalInfo: any }) : Promise<DriverDocument> {
        const updatedDriver = await this.driverModel.findOneAndUpdate(
          { email: userEmail },
          { $set: { personalInfo: body.personalInfo } },
          { new: true },
        ).exec();
        
        if (!updatedDriver) {
            throw new NotFoundException(`Driver with email ${userEmail} not found`);
        }
        return updatedDriver;
    }


    // ---------------- UPDATE DETAILS ----------------
    async updateDriverDetails(userEmail: string, updateData: Partial<DriverDto>) : Promise<DriverDocument> {
        const updatedDriver = await this.driverModel.findOneAndUpdate(
            { email: userEmail },          
            { $set: updateData },
            { new: true },
        ).exec();

        if (!updatedDriver) {
            throw new NotFoundException(`Driver with email ${userEmail} not found`);
        }
        return updatedDriver;
    }
}