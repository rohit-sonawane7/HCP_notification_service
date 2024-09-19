import sgMail from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import { Notification, NotificationStatus, NotificationType } from '../entity/notification.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>
    ) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    }

    async sendOtpEmail(to: string, otp: string): Promise<void> {
        const subject = 'Your One-Time Password (OTP)';
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Your OTP Code</h2>
        <p style="color: #555;">Hello,</p>
        <p style="color: #555;">We received a request to access your account using this email address. Use the following OTP to complete the verification process:</p>
        <div style="background-color: #f7f7f7; padding: 10px 15px; margin: 20px 0; text-align: center; border-radius: 5px;">
          <span style="font-size: 24px; font-weight: bold; color: #333;">${otp}</span>
        </div>
        <p style="color: #555;">This OTP is valid for the next 10 minutes. Please do not share this code with anyone.</p>
        <p style="color: #555;">If you did not request this, please ignore this email or contact support if you have any concerns.</p>
        <p style="color: #999; text-align: center; font-size: 12px;">&copy; 2024 Your Company. All rights reserved.</p>
      </div>
    `;

        const msg = {
            to,
            from: process.env.EMAIL_USER as string,
            subject,
            text: `Your OTP code is ${otp}. It is valid for the next 10 minutes.`,
            html,
        };

        try {
            const notification = this.notificationRepository.create({
                recipient: to,
                type: NotificationType.EMAIL,
                status: NotificationStatus.PENDING,
                createdAt: new Date().toISOString(),
                message: `Your OTP code is ${otp}. It is valid for the next 10 minutes.`
            });
            await this.notificationRepository.save(notification);
            await sgMail.send(msg);
            console.log('OTP email sent successfully');
            notification.status = NotificationStatus.SENT;
            await this.notificationRepository.save(notification);

        } catch (error: any) {
            console.error('Error sending OTP email:', error.message);
            throw new Error('Failed to send OTP email');
        }
    }
}
