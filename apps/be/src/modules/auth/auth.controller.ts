import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Res,
    UnauthorizedException,
    Req,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto.dto';
import { RegisterCompanyDto } from './dto/registerDto.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterCompanyDto) {
        return await this.authService.register(dto);
    }

    @Get('verify')
    async verifyEmail(@Query('token') token: string, @Res() res: Response) {
        await this.authService.verifyEmail(token);
        return res.redirect(`${process.env.APP_URL}/home`);
    }
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return await this.authService.login(dto);
    }

    @Post('reset-password')
    async resetPassword(@Body('email') email: string) {
        return await this.authService.resetPassword(email);
    }

    @Get('confirm-reset-password')
    async confirmResetPassword(@Query('token') token: string, @Res() res: Response) {
        await this.authService.confirmResetPassword(token);
        return res.redirect(`${process.env.APP_URL}/login`);
    }

    @Get('/validate')
    async validate(@Req() req: Request) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) throw new UnauthorizedException('No token provided');
        return await this.authService.validateAndRefreshToken(token);
    }
}
