import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from './notification.module';
import { Notification } from './entity/notification.entity';
import 'dotenv/config';

console.log("MONGO_URI");
console.log(process.env.MONGO_URI);


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mongodb',
            url: process.env.MONGO_URI,
            synchronize: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            entities: [Notification],
            migrations: ['src/migration']
        }),
        TypeOrmModule.forFeature([Notification]),
        NotificationModule,
    ],
})
export class AppModule { }