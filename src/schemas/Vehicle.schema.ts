// src/schemas/Vehicle.schema.ts
/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema()
export class Vehicle {
    @Prop()
    make: string;

    @Prop({ required: true }) // Must be required and assigned by controller
    driverId: string; 

    @Prop()
    vehicleModel: string;

    @Prop()
    year: number;

    @Prop()
    seatsNo: number;

    @Prop({ unique: true })
    licensePlate: string;

    @Prop()
    vehicleClass: string;

    @Prop()
    vehicleType: string;

    @Prop([String])
    vehicleImages: string[];

    @Prop({ type: Object })
    documents: {
        Driving_Licence?: string;
        Police_Clearance_Certificate?: string;
        Proof_Of_Address?: string;
        Vehicle_Insurance_Proof?: string;
    };

    @Prop({ type: Object })
    fareStructure: {
        minimumFare: number;
        perKilometerRate: number;
        waitingChargePerMinute: number;
        cancellationFee: number;
    };
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);