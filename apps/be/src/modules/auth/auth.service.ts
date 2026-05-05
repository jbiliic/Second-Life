import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterCompanyDto } from './dto/registerDto.dto';
import { LoginDto } from './dto/loginDto.dto';
import * as bcrypt from 'bcrypt';
import { AuthenticatedUser } from '../../common/auth/interfaces/authenticatedUser.interface';
import { MailService } from '../../common/mail/mail.service';
import { randomBytes } from 'crypto';

interface TokenPayload {
    companyId: string;
    expires: Date;
}
@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService
    ) { }
    private verificationTokens = new Map<string, TokenPayload>();

    async register(registerDto: RegisterCompanyDto) {
        const existingCompany = await this.prisma.company.findUnique({ where: { email: registerDto.email } });
        if (existingCompany) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const company = await this.prisma.company.create({
            data: {
                name: registerDto.name,
                oib: registerDto.oib,
                mbs: registerDto.mbs,
                logo_url: registerDto.logo_url,
                password: hashedPassword,
                phone: registerDto.phone,
                email: registerDto.email,
                website: registerDto.website,
            },
        });

        const verificationToken = randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes
        this.verificationTokens.set(verificationToken, { companyId: company.id, expires });
        await this.mailService.sendVerificationEmail(company.email, verificationToken);

        const payload = { id: company.id, isAdmin: false, isVerified: company.is_verified } as AuthenticatedUser;
        const token = this.jwtService.sign(payload);
        return { access_token: token };
    }

    async verifyEmail(token: string) {
        const payload = this.verificationTokens.get(token);

        if (!payload)
            throw new NotFoundException('Invalid verification token');

        if (payload.expires < new Date()) {
            this.verificationTokens.delete(token);
            throw new BadRequestException('Verification token has expired');
        }

        await this.prisma.company.update({
            where: { id: payload.companyId },
            data: { is_verified: true },
        });

        this.verificationTokens.delete(token);
        return { message: 'Email verified successfully' };
    }

    async login(loginDto: LoginDto) {
        const company = await this.prisma.company.findUnique({ where: { email: loginDto.email } });
        if (!company) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordMatching = await bcrypt.compare(loginDto.password, company.password);

        if (!isPasswordMatching) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { id: company.id, isAdmin: false, isVerified: company.is_verified } as AuthenticatedUser;

        const token = this.jwtService.sign(payload);

        return { access_token: token };
    }
}