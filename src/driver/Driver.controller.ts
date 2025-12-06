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
import { DriverService } from '../driver/Driver.service';
import { Driver } from '../schemas/Driver.schema'; // Corrected relative path
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard'; // 💡 Using the Guard system

@Controller('drivers') 
export class DriverController {
    constructor(
        private readonly driverService: DriverService,
        private readonly authService: AuthService,
    ) { }

    // ------------------- SIGNUP (/drivers/signup) -------------------
    @Post('signup')
    async driverSignup(
        @Body()
        body: {
            name: string; email: string; phone: number; password: string;
            drivinglicenseNo: string; agreement: boolean;
        },
    ) {
        try {
            const isDriverExists = await this.driverService.findDriverByEmail(body.email);
            if (isDriverExists) {
                throw new HttpException('Email already exists', HttpStatus.CONFLICT);
            }

            const hashedPassword = await this.authService.hashPassword(body.password);
            
            const newDriverData: Partial<Driver> = {
                ...body,
                password: hashedPassword,
                imageUrl: 'no',
                personalInfo: {}, // Default empty object
            };
            
            const createdDriver = await this.driverService.createDriver(newDriverData);

            // Omit password from response
            const { password, ...driverResult } = createdDriver.toObject();

            return {
                status: 201,
                message: 'Driver Created Successfully',
                driver: driverResult,
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            console.log('Error creating driver : ', error);
            throw new HttpException('Error creating driver', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ------------------- LOGIN (/drivers/login) -------------------
    @Post('login')
    async driverLogin(@Body() body: { email: string; password: string }) {
        try {
            // Find driver WITH password hash (true)
            const driver = await this.driverService.findDriverByEmail(body.email, true); 

            if (!driver) {
                throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
            }
            
            const checkPassword = await this.authService.comparePasswords(body.password, driver.password); 
            
            if (!checkPassword) {
                throw new HttpException('INCORRECT PASSWORD', HttpStatus.UNAUTHORIZED);
            }
            
            // Generate JWT payload
            const payload = { 
                email: driver.email, 
                sub: driver._id.toString(),
                type: 'driver' 
            };
            const token = this.authService.generateToken(payload);

            const { password, ...driverResult } = driver.toObject();

            return {
                message: 'Login Successful',
                user: driverResult,
                access_token: token, 
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            console.log('Login error : ', error);
            throw new HttpException('User Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ------------------- GET ALL (PROTECTED: /drivers/list) -------------------
    @UseGuards(JwtAuthGuard) 
    @Get('list') 
    async getAll() {
        try {
            const drivers = await this.driverService.findAllDrivers();
            return { drivers };
        } catch (error) {
            console.log('Error retreiving drivers : ', error);
            throw new HttpException('Error retrieving driver data ', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ------------------- GET DETAILS (PROTECTED: /drivers/details) -------------------
    @UseGuards(JwtAuthGuard) 
    @Get('details') 
    async getUserDetails(@Req() req: Request) {
        try {
            // Get user email from the JWT payload (set by JwtStrategy)
            const userEmail = req['user'].email; 
            
            // Find driver EXCLUDING password
            const userData = await this.driverService.findDriverByEmail(userEmail); 
            
            if (!userData) {
                throw new NotFoundException('Driver Not Found');
            }
            
            return { userData };
        } catch(error) {
            if (error instanceof HttpException) throw error;
            console.error('Error getting driver data:', error);
            throw new HttpException('Error getting user data', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // --- Profile Updates (Also Protected) ---

    @Post('update')
    @UseGuards(JwtAuthGuard) 
    async updateDriver(
        @Body() body: { name?: string; phone?: number; drivinglicenseNo?: string; imageUrl?: string; },
        @Req() req: Request,
    ) {
        try {
            const userEmail = req['user'].email; 
            const updatedDriver = await this.driverService.updateDriverDetails(userEmail, body);

            const { password, ...driverResult } = updatedDriver.toObject();
            return { message: 'Driver updated successfully', data: driverResult };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            console.error('Error updating driver:', error);
            throw new HttpException('Error updating driver profile', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('updatePersonalInfo')
    @UseGuards(JwtAuthGuard) 
    async updateDriverPersonalInfo(
        @Body() body: { personalInfo: any },
        @Req() req: Request,
    ) {
        try {
            const userEmail = req['user'].email;
            const updatedDriver = await this.driverService.updateDriverPersonalInfo(userEmail, body);
            
            const { password, ...driverResult } = updatedDriver.toObject();
            return { message: 'Driver updated successfully', data: driverResult };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            console.error('Error updating driver:', error);
            throw new HttpException('Error updating driver profile', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}