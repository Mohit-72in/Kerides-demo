// src/auth/auth.service.ts
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { User, UserDocument } from 'src/schemas/User.schema';
import { CreateDriverDto } from 'src/dto/create-driver.dto';
import { LoginDriverDto } from 'src/dto/login-driver.dto';
import { Driver, DriverDocument } from 'src/schemas/Driver.schema';
// Assuming JwtPayload is updated to use 'userType'
import { JwtPayload } from './jwt-paylode.interface'; 


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Driver.name) private driverModel: Model<DriverDocument>,
        private jwtService: JwtService,
    ) {}

    // --------------------------------------------------------------------
    // ------------------- PRIVATE HELPER METHODS -------------------------
    // --------------------------------------------------------------------

    /**
     * Hashes the plaintext password.
     */
    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    /**
     * Compares plaintext password with hashed password.
     */
    private async comparePasswords(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    /**
     * Generates a JWT for a given user or driver payload.
     */
    private async generateJwtToken(payload: JwtPayload): Promise<any> {
        const access_token = this.jwtService.sign(payload);
        return { access_token };
    }


    // --------------------------------------------------------------------
    // ------------------- USER AUTHENTICATION ----------------------------
    // --------------------------------------------------------------------

    async userSignup(createUserDto: CreateUserDto): Promise<any> {
        const { email, password, name } = createUserDto;

        const existingUser = await this.userModel.findOne({ email }).exec();
        if (existingUser) {
            throw new BadRequestException('User with this email already exists.');
        }

        const hashedPassword = await this.hashPassword(password);

        const newUser = new this.userModel({ 
            email, 
            name,
            password: hashedPassword 
        });

        await newUser.save();
        
        // Generate token upon successful signup
        const payload: JwtPayload = { sub: newUser._id.toHexString(), email, userType: 'user' };
        return this.generateJwtToken(payload);
    }

    async userLogin(loginUserDto: LoginUserDto): Promise<any> {
        const { email, password } = loginUserDto;

        // Ensure +password select option is enabled in the schema or Mongoose call
        const user = await this.userModel.findOne({ email }).select('+password').exec(); 

        if (!user) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        const isMatch = await this.comparePasswords(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        // Generate token upon successful login
        const payload: JwtPayload = { sub: user._id.toHexString(), email, userType: 'user' };
        return this.generateJwtToken(payload);
    }

    // --------------------------------------------------------------------
    // ------------------- DRIVER AUTHENTICATION --------------------------
    // --------------------------------------------------------------------

    async driverSignup(createDriverDto: CreateDriverDto): Promise<any> {
        const { email, password } = createDriverDto;

        const existingDriver = await this.driverModel.findOne({ email }).exec();
        if (existingDriver) {
            throw new BadRequestException('Driver with this email already exists.');
        }

        const hashedPassword = await this.hashPassword(password);

        const newDriver = new this.driverModel({ 
            ...createDriverDto, 
            password: hashedPassword 
        });

        await newDriver.save();

        // Generate token upon successful signup
        const payload: JwtPayload = { sub: newDriver._id.toHexString(), email, userType: 'driver' };
        return this.generateJwtToken(payload);
    }

    async driverLogin(loginDriverDto: LoginDriverDto): Promise<any> {
        const { email, password } = loginDriverDto;

        // Ensure +password select option is enabled in the schema or Mongoose call
        const driver = await this.driverModel.findOne({ email }).select('+password').exec();

        if (!driver) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        const isMatch = await this.comparePasswords(password, driver.password);

        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        // Generate token upon successful login
        const payload: JwtPayload = { sub: driver._id.toHexString(), email, userType: 'driver' };
        return this.generateJwtToken(payload);
    }
}