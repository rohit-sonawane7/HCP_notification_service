import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './middlewares/errorHandler';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // app.connectMicroservice<MicroserviceOptions>({
    //     transport: Transport.KAFKA,
    //     options: {
    //         client: {

    //             brokers: ['localhost:9092'],
    //         },
    //         consumer: {
    //             groupId: 'my-consumer-group',
    //         },
    //     },
    // });

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: 'nestjs-consumer-server',
                brokers: ['localhost:9092'],
            },
            consumer: {
                groupId: 'nestjs-consumer-group',
                sessionTimeout: 30000, // 30 seconds
                heartbeatInterval: 10000, // 10 seconds
                // maxPollInterval: 300000, // 5 minutes
            },
        },
    });


    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.startAllMicroservices();
    await app.listen(9006);
    Logger.log('Application is running on: http://localhost:9000', 'Bootstrap');
}

bootstrap();
