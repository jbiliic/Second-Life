import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto.dto';
import { RegisterCompanyDto } from './dto/registerDto.dto';

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
    confirmResetPassword(@Query('token') token: string) {
        return this.authService.confirmResetPassword(token);
    }
}
