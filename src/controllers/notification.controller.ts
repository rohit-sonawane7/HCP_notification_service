import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';

@Controller('notifications/email')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post('send-otp')
    async sendOtp(@Body('email') email: string): Promise<{ message: string, otp: number }> {
        const otp = this.generateOtp();
        await this.notificationService.sendOtpEmail(email, otp);
        return { message: 'OTP sent successfully', otp: Number(otp) };
    }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
