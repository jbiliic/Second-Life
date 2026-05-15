import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: any;

    constructor() {
        const config = {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            family: 4,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        };
        this.transporter = createTransport(config as any); // ← cast na any
    }

    async sendVerificationEmail(to: string, token: string) {
        const url = `${process.env.VITE_SERVER_URL}/auth/verify?token=${token}`;
        await this.transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject: 'Verify your email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Email Verification</h2>
                    <p>Thanks for registering! Click the button below to verify your email.</p>
                    <p>This link expires in <strong>5 minutes</strong>.</p>
                    <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                        Verify Email
                    </a>
                    <p>If you didn't create an account, you can ignore this email.</p>
                </div>
            `,
        });
        console.log('Verification email sent to:', to);
    }

    async sendPasswordResetEmail(to: string, newPassword: string, token: string) {
        const url = `${process.env.VITE_SERVER_URL}/auth/confirm-reset-password?token=${token}`;
        await this.transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset</h2>
                    <p>Your new temporary password will be:</p>
                    <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${newPassword}</p>
                    <p>This link expires in <strong>5 minutes</strong>.</p>
                    <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                        Confirm Password Reset
                    </a>
                    <p>If you didn't request this, you can ignore this email.</p>
                </div>
            `,
        });
        console.log('Password reset email sent to:', to);
    }
}
