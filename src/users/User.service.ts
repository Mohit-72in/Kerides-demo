// src/users/User.service.ts (FINAL SYNCHRONIZED VERSION)
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/schemas/User.schema"; 
import { UpdateUserDto } from "src/dto/update-user.dto"; // DTO needed for update method

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // ---------------- CREATE USER ----------------
  async createUser(userData: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  // ---------------- FIND ALL USERS (SYNCED with Controller) ----------------
  // 💡 SYNCED: Controller calls findAllUsers(), so the service method is named this way.
  async findAllUsers(): Promise<UserDocument[]> { 
    // Exclude password from the list of users
    return this.userModel.find({}, { password: 0 }).exec(); 
  }
  
  // ---------------- FIND BY EMAIL (SYNCED with Controller) ----------------
  // 💡 SYNCED: Controller calls findUserByEmail(), so we define it here.
  async findUserByEmail(email: string, type?: string): Promise<UserDocument | null> {
    let query = this.userModel.findOne({ email });
    
    // Logic to include or exclude password
    if (type === "details") {
      query = query.select('-password');
    } else {
        // Assume default (for login flow in AuthService) means we need the password hash
        query = query.select('+password'); 
    }
    
    return query.exec();
  }
  
  // ---------------- UPDATE USER BY ID (SYNCED with Controller) ----------------
  // 💡 SYNCED: Controller calls updateUserById(), which is the secure method for profile updates.
  async updateUserById(id: string, data: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      { _id: id },
      data,
      { new: true, runValidators: true }
    ).exec();
    
    if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return updatedUser;
  }
  
  // NOTE: findById is kept private/internal if the controller doesn't use it directly.
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
}