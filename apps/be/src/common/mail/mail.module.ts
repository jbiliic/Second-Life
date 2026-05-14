import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: 'smtp.resend.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'resend',
                        pass: config.get('RESEND_API_KEY'),
                    },
                },
            }),
        }),
    ],
    providers: [MailService],
    exports: [MailService, MailerModule],
})
export class MailModule {}
