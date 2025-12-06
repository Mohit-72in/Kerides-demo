/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

// Export the Document type for Mongoose compatibility
export type DriverDocument = Driver & Document;

@Schema()
export class Driver {

    @Prop()
    name : string;

    @Prop()
    imageUrl : string;

    @Prop({unique: true})
    email : string;

    @Prop()
    phone : number;

    @Prop()
    password : string;

    @Prop()
    agreement : boolean;

    @Prop()
    drivinglicenseNo : string;

    @Prop({ type: Object, default: {} })
    personalInfo: Record<string, any>;

}

export const DriverSchema = SchemaFactory.createForClass(Driver);