import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { AuthenticatedUser } from '../../common/auth/interfaces/authenticatedUser.interface';
import { MailService } from '../../common/mail/mail.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoginDto } from './dto/loginDto.dto';
import { RegisterCompanyDto } from './dto/registerDto.dto';

interface VerifyPayload {
    companyId: string;
}

interface ResetPayload {
    companyId: string;
    newPassword: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
    ) {}

    async register(registerDto: RegisterCompanyDto) {
        const existingCompany = await this.prisma.company.findUnique({
            where: { email: registerDto.email },
        });
        if (existingCompany) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const company = await this.prisma.company.create({
            data: {
                name: registerDto.name,
                oib: registerDto.oib,
                logo_url: registerDto.logo_url,
                password: hashedPassword,
                email: registerDto.email,
                ...(registerDto.location && {
                    locations: {
                        create: {
                            country: registerDto.location.country,
                            city: registerDto.location.city,
                            zip: registerDto.location.zip,
                            street: registerDto.location.street,
                            street_number: registerDto.location.street_number,
                            latitude: registerDto.location.latitude,
                            longitude: registerDto.location.longitude,
                        },
                    },
                }),
            },
        });

        const verificationToken = randomBytes(32).toString('hex');
        await this.cache.set(
            `verify:${verificationToken}`,
            { companyId: company.id } as VerifyPayload,
            1000 * 60 * 5,
        );
        await this.mailService.sendVerificationEmail(company.email, verificationToken);

        const payload = {
            id: company.id,
            isAdmin: false,
            isVerified: company.is_verified,
        } as AuthenticatedUser;

        return { access_token: this.jwtService.sign(payload) };
    }

    async verifyEmail(token: string) {
        const payload = await this.cache.get<VerifyPayload>(`verify:${token}`);
        if (!payload) throw new NotFoundException('Invalid or expired verification token');

        await this.prisma.company.update({
            where: { id: payload.companyId },
            data: { is_verified: true },
        });

        await this.cache.del(`verify:${token}`);
        return { message: 'Email verified successfully' };
    }

    async login(loginDto: LoginDto) {
        const company = await this.prisma.company.findUnique({ where: { email: loginDto.email } });
        if (!company) throw new UnauthorizedException('Invalid credentials');

        const isPasswordMatching = await bcrypt.compare(loginDto.password, company.password);
        if (!isPasswordMatching) throw new UnauthorizedException('Invalid credentials');

        const payload = {
            id: company.id,
            isAdmin: false,
            isVerified: company.is_verified,
        } as AuthenticatedUser;

        const token = this.jwtService.sign(payload);

        return { access_token: token };
    }

    async resetPassword(email: string) {
        const company = await this.prisma.company.findFirst({ where: { email } });
        if (!company) throw new NotFoundException('Company not found');

        const newPassword = randomBytes(8).toString('hex');
        const token = randomBytes(32).toString('hex');

        await this.cache.set(
            `reset:${token}`,
            { companyId: company.id, newPassword } as ResetPayload,
            1000 * 60 * 5,
        );
        await this.mailService.sendPasswordResetEmail(company.email, newPassword, token);

        return { message: 'Password reset email sent' };
    }

    async confirmResetPassword(token: string) {
        const payload = await this.cache.get<ResetPayload>(`reset:${token}`);
        if (!payload) throw new NotFoundException('Invalid or expired reset token');

        const hashed = await bcrypt.hash(payload.newPassword, 10);

        await this.prisma.company.update({
            where: { id: payload.companyId },
            data: { password: hashed },
        });

        await this.cache.del(`reset:${token}`);
        return { message: 'Password reset successful' };
    }
}
