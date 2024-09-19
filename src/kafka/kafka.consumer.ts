import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class KafkaConsumer implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumer.name);

  // Inject Kafka client via constructor
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka, 
    private readonly emailService: NotificationService
  ) {}

  async onModuleInit() {
    // Subscribe to the 'send_otp' topic
    this.kafkaClient.subscribeToResponseOf('send_otp');
    await this.kafkaClient.connect(); // Ensure Kafka client connects before use
    this.logger.log('Kafka client connected and subscribed to send_otp topic.');
  }

  // Handle incoming messages for sending OTP
  async handleSendOtp(data: { email: string; otp: string }) {
    try {
      this.logger.log(`Received OTP request for email: ${data.email}`);
      await this.emailService.sendOtpEmail(data.email, data.otp);

      // Emit success message to Kafka topic
      this.kafkaClient.emit('otp_sent_success', { email: data.email });
      this.logger.log(`OTP sent successfully to ${data.email}`);
    } catch (error: any) {
      // Handle and emit failure message
      this.kafkaClient.emit('otp_sent_failure', { email: data.email, error: error.message });
      this.logger.error(`Failed to send OTP to ${data.email}`, error.message);
    }
  }
}
