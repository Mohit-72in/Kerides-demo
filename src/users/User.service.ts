// src/users/User.service.ts
/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/schemas/User.schema"; 

@Injectable()
export class UserService {
  // Using Model<UserDocument> for correct Mongoose typing
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // ---------------- CREATE USER ----------------
  async createUser(userData: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  // ---------------- FIND BY ID ----------------
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  // ---------------- FIND BY EMAIL ----------------
  async findByEmail(email: string, type?: string): Promise<UserDocument | null> {
    if (type === "details") {
      // return data without password
      return this.userModel.findOne({ email }, { password: 0 }).exec();
    }

    // Return full user document (including password hash for login comparison)
    return this.userModel.findOne({ email }).exec();
  }

  // ---------------- ALL USERS ----------------
  async findUsers(): Promise<UserDocument[]> {
    // Exclude password from the list of users
    return this.userModel.find({}, { password: 0 }).exec(); 
  }

  // ---------------- UPDATE USER BY EMAIL ----------------
  async findByEmailAndUpdate(email: string, data: Partial<User>) {
    return await this.userModel.findOneAndUpdate(
      { email },
      data,
      { new: true }
    ).exec();
  }
}