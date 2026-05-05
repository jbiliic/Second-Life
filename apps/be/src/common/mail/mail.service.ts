import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailer: MailerService) { }

    async sendVerificationEmail(to: string, token: string) {
        const url = `${process.env.APP_URL}/auth/verify?token=${token}`;

        await this.mailer.sendMail({
            to,
            subject: 'Verify your email',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Thanks for registering! Click the button below to verify your email.</p>
          <p>This link expires in <strong>5 minutes</strong>.</p>
          <a href="${url}" style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 16px 0;
          ">
            Verify Email
          </a>
          <p>If you didn't create an account, you can ignore this email.</p>
        </div>
      `,
        });
    }

    async sendPasswordResetEmail(to: string, token: string) {
        const url = `${process.env.APP_URL}/auth/reset-password?token=${token}`;

        await this.mailer.sendMail({
            to,
            subject: 'Reset your password',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>You requested a password reset. Click below to proceed.</p>
          <p>This link expires in <strong>5 minutes</strong>.</p>
          <a href="${url}" style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 16px 0;
          ">
            Reset Password
          </a>
          <p>If you didn't request this, you can ignore this email.</p>
        </div>
      `,
        });
    }
}