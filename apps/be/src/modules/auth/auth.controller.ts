import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterCompanyDto } from './dto/registerDto.dto';
import { LoginDto } from './dto/loginDto.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

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
}
