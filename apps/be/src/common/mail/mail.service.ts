import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    private async sendEmail(to: string, subject: string, html: string) {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': process.env.BREVO_API_KEY!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: {
                    name: process.env.BREVO_SENDER_NAME,
                    email: process.env.BREVO_SENDER_EMAIL,
                },
                to: [{ email: to }],
                subject,
                htmlContent: html,
            }),
        });

        if (!response.ok) {
            throw new Error(`Brevo error: ${await response.text()}`);
        }
    }

    async sendVerificationEmail(to: string, token: string) {
        const url = `${process.env.VITE_SERVER_URL}/auth/verify?token=${token}`;
        await this.sendEmail(
            to,
            'Verify your email',
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Email Verification</h2>
                <p>Thanks for registering! Click the button below to verify your email.</p>
                <p>This link expires in <strong>5 minutes</strong>.</p>
                <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                    Verify Email
                </a>
            </div>
        `,
        );
        console.log('Verification email sent to:', to);
    }

    async sendPasswordResetEmail(to: string, newPassword: string, token: string) {
        const url = `${process.env.VITE_SERVER_URL}/auth/confirm-reset-password?token=${token}`;
        await this.sendEmail(
            to,
            'Password Reset Request',
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset</h2>
                <p>Your new temporary password will be:</p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${newPassword}</p>
                <p>This link expires in <strong>5 minutes</strong>.</p>
                <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                    Confirm Password Reset
                </a>
            </div>
        `,
        );
        console.log('Password reset email sent to:', to);
    }
}
