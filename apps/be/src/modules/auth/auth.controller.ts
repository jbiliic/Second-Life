import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterCompanyDto } from './dto/registerDto.dto';
import { LoginDto } from './dto/loginDto.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() dto: RegisterCompanyDto) {
        return this.authService.register(dto);
    }

    @Get('verify')
    verifyEmail(@Query('token') token: string) {
        return this.authService.verifyEmail(token);
    }
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('reset-password')
    resetPassword(@Body('email') email: string) {
        return this.authService.resetPassword(email);
    }

    @Get('confirm-reset-password')
    confirmResetPassword(@Query('token') token: string, @Res() res: Response) {
        this.authService.confirmResetPassword(token);
        return res.redirect(process.env.CORS_ORIGIN!);
    }
}
