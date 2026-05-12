import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { JwtStrategy } from '../../common/auth/jwt.strategy';
import { MailModule } from '../../common/mail/mail.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        PrismaModule,
        MailModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET_KEY'),
                signOptions: { expiresIn: (config.get<string>('JWT_EXPIRES_IN') as any) ?? '7d' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
