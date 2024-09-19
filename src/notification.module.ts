import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { Notification } from './entity/notification.entity';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaConsumer } from './kafka/kafka.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'notification-service',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'notification-consumer',
          },
        },
      },
    ]),
  ],
  providers: [KafkaConsumer, NotificationService, ClientKafka],
  controllers: [NotificationController],
})
export class NotificationModule { }
