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
import { ApiBody, ApiQuery } from '@nestjs/swagger';

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
    @ApiBody({ schema: { properties: { email: { type: 'string' } } } })
    resetPassword(@Body('email') email: string) {
        return this.authService.resetPassword(email);
    }

    @Get('confirm-reset-password')
    @ApiQuery({ name: 'token', required: true })
    confirmResetPassword(@Query('token') token: string, @Res() res: Response) {
        this.authService.confirmResetPassword(token);
        return res.redirect(process.env.CORS_ORIGIN!);
    }

    @Get('/validate')
    async validate(@Req() req: Request) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) throw new UnauthorizedException('No token provided');
        return this.authService.validateAndRefreshToken(token);
    }
}
