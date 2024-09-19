import { Module } from '@nestjs/common';
import { KafkaConsumer } from './kafka.consumer';
import { NotificationService } from '../services/notification.service';

@Module({
  providers: [KafkaConsumer, NotificationService],
})
export class KafkaModule {}
