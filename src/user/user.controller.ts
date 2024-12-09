// src/user/user.controller.ts
import {
    Controller,
    Post,
    Patch,
    Req,
    Body,
    UseGuards,
    UseInterceptors,
    BadRequestException,
    UploadedFile,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { UserService } from './user.service';
  import { JwtAuthGuard } from '../guard/jwt-auth.guard';
  import { RoleGuard } from '../guard/role.guard';
  import * as bcrypt from 'bcrypt';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  
  @Controller('user')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Post('create')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: './uploads', // Directory where files are saved
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      }),
    )
    async createUser(
      @Body() body: { name: string; email: string; password: string; role?: string },
      @UploadedFile() file: Express.Multer.File, // Handle uploaded file
    ) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const imagePath = file ? `/uploads/${file.filename}` : undefined; // Save file path if image is provided
  
      return this.userService.createUser({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: body.role || 'user',
        image: imagePath, // Save the image path
      });
    }


    @Patch('edit-profile')
    @UseGuards(JwtAuthGuard) // Protect the endpoint with authentication
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: './uploads', // Directory where files are saved
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      }),
    )
    async editProfile(
      @Req() req: any, // Retrieve user details from token
      @Body() body: { name?: string },
      @UploadedFile() file?: Express.Multer.File, // Handle uploaded file
    ) {
      const userId = req.user.id; // Get user ID from JWT token
      const updates: any = {};
  
      // Update the name if provided
      if (body.name) {
        updates.name = body.name;
      }
  
      // Update the image if provided
      if (file) {
        updates.image = `/uploads/${file.filename}`;
      }
  
      const updatedUser = await this.userService.updateProfile(userId, updates);
  
      return { message: 'Profile updated successfully', user: updatedUser };
    }

    @Patch('change-password')
    @UseGuards(JwtAuthGuard) // Protect with JWT authentication
    async changePassword(
      @Req() req: any, // Retrieve user ID from token
      @Body() body: { newPassword: string; confirmPassword: string },
    ) {
      const userId = req.user.id; // Extract user ID from JWT token
  
      // Validate new password and confirm password
      if (body.newPassword !== body.confirmPassword) {
        throw new BadRequestException('New password and confirm password do not match');
      }
  
      // Hash the new password and update it in the database
      const hashedPassword = await bcrypt.hash(body.newPassword, 10);
      await this.userService.updatePassword(userId, hashedPassword);
  
      return { message: 'Password changed successfully' };
    }
  }